/**
 * @fileoverview Calendar text measurement: hour/day/month column widths
 * derived from rendered text metrics. Pure functions over a canvas 2D
 * context, the dynamic style and the calendar options - testable without
 * mounting the component.
 * @license MIT
 * @package GanttElastic
 */
import dayjs from 'dayjs';
import { monthsCount } from './time-scale.js';

/**
 * Compute all calendar column widths - when the scale was changed for example.
 * Mutates the calendar options (widths/formatted/maxWidths) exactly as the
 * original inline component methods did, quirks included.
 *
 * @param {CanvasRenderingContext2D} ctx shared measurement context
 * @param {object} style dynamic style (needs 'calendar-row-text' + per-row variants)
 * @param {object} calendar options.calendar
 * @param {object} times options.times (needs steps + firstTime/lastTime)
 * @param {string} localeName dayjs locale name
 */
export function computeCalendarWidths(ctx, style, calendar, times, localeName) {
  computeDayWidths(ctx, style, calendar, times, localeName);
  computeHourWidths(ctx, style, calendar, localeName);
  computeMonthWidths(ctx, style, calendar, times, localeName);
}

/**
 * Compute width of calendar hour column widths basing on text widths
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} style
 * @param {object} calendar options.calendar
 * @param {string} localeName
 */
export function computeHourWidths(ctx, style, calendar, localeName) {
  const hourStyle = { ...style['calendar-row-text'], ...style['calendar-row-text--hour'] };
  ctx.font = hourStyle['font-size'] + ' ' + hourStyle['font-family'];
  let currentDate = dayjs('2018-01-01T00:00:00').locale(localeName); // any date will be good for hours
  let maxWidths = calendar.hour.maxWidths;
  if (maxWidths.length) {
    return;
  }
  for (let formatName in calendar.hour.format) {
    maxWidths[formatName] = 0;
  }
  for (let hour = 0; hour < 24; hour++) {
    let widths = { hour };
    for (let formatName in calendar.hour.format) {
      const hourFormatted = calendar.hour.format[formatName](currentDate);
      calendar.hour.formatted[formatName].push(hourFormatted);
      widths[formatName] = ctx.measureText(hourFormatted).width;
    }
    calendar.hour.widths.push(widths);
    for (let formatName in calendar.hour.format) {
      if (widths[formatName] > maxWidths[formatName]) {
        maxWidths[formatName] = widths[formatName];
      }
    }
    currentDate = currentDate.add(1, 'hour');
  }
}

/**
 * Compute width of calendar day column widths basing on text widths
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} style
 * @param {object} calendar options.calendar
 * @param {object} times options.times
 * @param {string} localeName
 */
export function computeDayWidths(ctx, style, calendar, times, localeName) {
  const dayStyle = { ...style['calendar-row-text'], ...style['calendar-row-text--day'] };
  ctx.font = dayStyle['font-size'] + ' ' + dayStyle['font-family'];
  let currentDate = dayjs(times.steps[0].time).locale(localeName);
  let maxWidths = calendar.day.maxWidths;
  calendar.day.widths = [];
  Object.keys(calendar.day.format).forEach(formatName => {
    maxWidths[formatName] = 0;
  });
  for (let day = 0, daysLen = times.steps.length; day < daysLen; day++) {
    const widths = {
      day
    };
    Object.keys(calendar.day.format).forEach(formatName => {
      widths[formatName] = ctx.measureText(calendar.day.format[formatName](currentDate)).width;
    });
    calendar.day.widths.push(widths);
    Object.keys(calendar.day.format).forEach(formatName => {
      if (widths[formatName] > maxWidths[formatName]) {
        maxWidths[formatName] = widths[formatName];
      }
    });
    currentDate = currentDate.add(1, 'day');
  }
}

/**
 * Compute month calendar column widths basing on text widths
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} style
 * @param {object} calendar options.calendar
 * @param {object} times options.times
 * @param {string} localeName
 */
export function computeMonthWidths(ctx, style, calendar, times, localeName) {
  const monthStyle = { ...style['calendar-row-text'], ...style['calendar-row-text--month'] };
  ctx.font = monthStyle['font-size'] + ' ' + monthStyle['font-family'];
  let maxWidths = calendar.month.maxWidths;
  calendar.month.widths = [];
  Object.keys(calendar.month.format).forEach(formatName => {
    maxWidths[formatName] = 0;
  });
  let currentDate = dayjs(times.firstTime).locale(localeName);
  const months = monthsCount(times.firstTime, times.lastTime);
  for (let month = 0; month < months; month++) {
    const widths = {
      month
    };
    Object.keys(calendar.month.format).forEach(formatName => {
      widths[formatName] = ctx.measureText(calendar.month.format[formatName](currentDate)).width;
    });
    calendar.month.widths.push(widths);
    Object.keys(calendar.month.format).forEach(formatName => {
      if (widths[formatName] > maxWidths[formatName]) {
        maxWidths[formatName] = widths[formatName];
      }
    });
    currentDate = currentDate.add(1, 'month');
  }
}
