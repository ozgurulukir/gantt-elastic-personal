/**
 * @fileoverview Time-scale math: chart time window, pixel-per-time scale and
 * day steps. Pure functions over a plain `times` object (the shape of
 * `options.times`) so the highest-risk math in the chart is testable
 * without mounting the component.
 * @license MIT
 * @package GanttElastic
 */
import dayjs from 'dayjs';

/**
 * Recalculate the pixel-per-millisecond scale and total view duration from
 * the current time window. Mutates `times` (timePerPixel, totalViewDurationMs,
 * totalViewDurationPx) and returns the resulting chart width in pixels.
 *
 * @param {object} times options.times
 * @param {number} gridStrokeWidth style['grid-line-vertical'].stroke-width
 * @returns {number} chart width in px
 */
export function recalculateTimes(times, gridStrokeWidth) {
  const max = times.timeScale * 60;
  const min = times.timeScale;
  const steps = max / min;
  const percent = times.timeZoom / 100;
  times.timePerPixel = times.timeScale * steps * percent + Math.pow(2, times.timeZoom);
  times.totalViewDurationMs = dayjs(times.lastTime).diff(times.firstTime, 'milliseconds');
  times.totalViewDurationPx = times.totalViewDurationMs / times.timePerPixel;
  return times.totalViewDurationPx + gridStrokeWidth;
}

/**
 * Compute the rendered time window (firstTime/lastTime) around the task time
 * range: tasks are padded with `scope.before`/`scope.after` whole days.
 *
 * @param {number} firstTaskTime earliest task start in ms
 * @param {number} lastTaskTime latest task end in ms
 * @param {string} localeName dayjs locale for week/day boundaries
 * @param {object} scope { before, after } in days
 * @returns {object} { firstTime, lastTime } in ms
 */
export function computeViewRange(firstTaskTime, lastTaskTime, localeName, scope) {
  return {
    firstTime: dayjs(firstTaskTime)
      .locale(localeName)
      .startOf('day')
      .subtract(scope.before, 'days')
      .startOf('day')
      .valueOf(),
    lastTime: dayjs(lastTaskTime)
      .locale(localeName)
      .endOf('day')
      .add(scope.after, 'days')
      .endOf('day')
      .valueOf()
  };
}

/**
 * Find the task time range across all tasks. An empty task list keeps the
 * historical MAX_SAFE_INTEGER/0 sentinel pair (no task can narrow the window).
 *
 * @param {array} tasks state tasks
 * @returns {object} { firstTaskTime, lastTaskTime } in ms
 */
export function computeTaskTimeRange(tasks) {
  let firstTaskTime = Number.MAX_SAFE_INTEGER;
  let lastTaskTime = 0;
  for (let index = 0, len = tasks.length; index < len; index++) {
    const task = tasks[index];
    if (task.startTime < firstTaskTime) {
      firstTaskTime = task.startTime;
    }
    if (task.startTime + task.duration > lastTaskTime) {
      lastTaskTime = task.startTime + task.duration;
    }
  }
  return { firstTaskTime, lastTaskTime };
}

/**
 * Calculate steps - one per `stepDuration` (day by default) covering the
 * rendered time window. Each step carries its time and its offset (ms/px)
 * from the window start; every step but the last also gets a width in ms/px.
 *
 * @param {object} times options.times (firstTime, lastTime, stepDuration, timePerPixel, totals)
 * @returns {array} steps
 */
export function calculateSteps(times) {
  const steps = [];
  const lastMs = dayjs(times.lastTime).valueOf();
  steps.push({
    time: dayjs(times.firstTime).valueOf(),
    offset: {
      ms: 0,
      px: 0
    }
  });
  for (
    let currentDate = dayjs(times.firstTime)
      .add(1, times.stepDuration)
      .startOf('day');
    currentDate.valueOf() <= lastMs;
    currentDate = currentDate.add(1, times.stepDuration).startOf('day')
  ) {
    const offsetMs = currentDate.diff(times.firstTime, 'milliseconds');
    const offsetPx = offsetMs / times.timePerPixel;
    const step = {
      time: currentDate.valueOf(),
      offset: {
        ms: offsetMs,
        px: offsetPx
      }
    };
    const previousStep = steps[steps.length - 1];
    previousStep.width = {
      ms: offsetMs - previousStep.offset.ms,
      px: offsetPx - previousStep.offset.px
    };
    steps.push(step);
  }
  const lastStep = steps[steps.length - 1];
  lastStep.width = {
    ms: times.totalViewDurationMs - lastStep.offset.ms,
    px: times.totalViewDurationPx - lastStep.offset.px
  };
  return steps;
}

/**
 * Convert time (in milliseconds) to pixel offset inside the chart.
 * Guards against timePerPixel still being 0 (before the first
 * recalculateTimes) - never divides into Infinity.
 *
 * @param {number} ms
 * @param {object} times options.times
 * @returns {number}
 */
export function timeToPixelOffsetX(ms, times) {
  const x = ms - times.firstTime;
  if (!x) {
    return 0;
  }
  return times.timePerPixel > 0 ? x / times.timePerPixel : 0;
}

/**
 * Convert pixel offset inside the chart to the corresponding time in
 * milliseconds. The half grid stroke centers the conversion on the line.
 *
 * @param {number} pixelOffsetX
 * @param {object} times options.times
 * @param {number} gridStrokeWidth style['grid-line-vertical'].stroke-width
 * @returns {number} milliseconds
 */
export function pixelOffsetXToTime(pixelOffsetX, times, gridStrokeWidth) {
  const offset = pixelOffsetX + gridStrokeWidth / 2;
  return offset * times.timePerPixel + times.firstTime;
}

/**
 * Number of different months in the specified time range (inclusive).
 *
 * @param {number} fromTime - date in ms
 * @param {number} toTime - date in ms
 * @returns {number} different months count
 */
export function monthsCount(fromTime, toTime) {
  if (fromTime > toTime) {
    return 0;
  }
  let currentMonth = dayjs(fromTime);
  let previousMonth = currentMonth.clone();
  let count = 1;
  while (currentMonth.valueOf() <= toTime) {
    currentMonth = currentMonth.add(1, 'day');
    if (previousMonth.month() !== currentMonth.month()) {
      count++;
    }
    previousMonth = currentMonth.clone();
  }
  return count;
}
