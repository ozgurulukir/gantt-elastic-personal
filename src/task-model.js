/**
 * @fileoverview Task model: normalization of user-supplied task fields and
 * derivation of time fields from patches. The single source of truth for
 * "what a task's canonical time fields are" - previously three divergent
 * copies lived in GanttElastic.vue (fillTasks, applyTaskPatch), Task.mixin
 * and Tooltip.
 * @license MIT
 * @package GanttElastic
 */
import dayjs from 'dayjs';

/**
 * Canonical end time of a task: endTime when present, otherwise start plus
 * duration.
 *
 * @param {object} task
 * @returns {number} end time in ms
 */
export function taskEndTime(task) {
  return typeof task.endTime !== 'undefined' ? task.endTime : task.startTime + task.duration;
}

/**
 * Fill out empty task properties so downstream geometry code never meets
 * undefined. Mutates the tasks in place and returns them.
 * 'dependentOn' is the pre-rename field name - still accepted transparently.
 * A task with neither end nor duration would produce NaN geometry further
 * down the pipeline, so duration defaults to 0.
 *
 * @param {array} tasks mapped state tasks
 * @returns {array} the same tasks, normalized
 */
export function normalizeTasks(tasks) {
  for (let task of tasks) {
    if (typeof task.x === 'undefined') {
      task.x = 0;
    }
    if (typeof task.y === 'undefined') {
      task.y = 0;
    }
    if (typeof task.width === 'undefined') {
      task.width = 0;
    }
    if (typeof task.height === 'undefined') {
      task.height = 0;
    }
    if (typeof task.mouseOver === 'undefined') {
      task.mouseOver = false;
    }
    if (typeof task.collapsed === 'undefined') {
      task.collapsed = false;
    }
    if (typeof task.dependencies === 'undefined') {
      task.dependencies = Array.isArray(task.dependentOn) ? task.dependentOn : [];
    }
    if (typeof task.parentId === 'undefined') {
      task.parentId = null;
    }
    if (typeof task.style === 'undefined') {
      task.style = {};
    }
    if (typeof task.children === 'undefined') {
      task.children = [];
    }
    if (typeof task.allChildren === 'undefined') {
      task.allChildren = [];
    }
    if (typeof task.parents === 'undefined') {
      task.parents = [];
    }
    if (typeof task.parent === 'undefined') {
      task.parent = null;
    }
    if (typeof task.startTime === 'undefined') {
      task.startTime = dayjs(task.start).valueOf();
    }
    if (typeof task.endTime === 'undefined' && task.hasOwnProperty('end')) {
      task.endTime = dayjs(task.end).valueOf();
    } else if (typeof task.endTime === 'undefined' && task.hasOwnProperty('duration')) {
      task.endTime = task.startTime + task.duration;
    }
    if (typeof task.duration === 'undefined' && task.hasOwnProperty('endTime')) {
      task.duration = task.endTime - task.startTime;
    }
    if (typeof task.duration === 'undefined') {
      task.duration = 0;
    }
  }
  return tasks;
}

/**
 * Derive the canonical time fields (startTime/endTime/duration) on a task
 * after a patch has been merged into it. Handles: start/end as user-facing
 * strings, startTime/endTime as raw ms, duration-preserving shift when only
 * the start moved, and duration → endTime recomputation.
 * Mutates the task; call only when the patch touches at least one time field.
 *
 * @param {object} task state task already merged with the patch
 * @param {object} patch the patch that was applied
 * @param {number|undefined} prevStartTime task startTime before the merge
 */
export function deriveTimeFields(task, patch, prevStartTime) {
  if (typeof patch.start !== 'undefined') {
    task.startTime = dayjs(task.start).valueOf();
  }
  if (typeof patch.end !== 'undefined') {
    task.endTime = dayjs(task.end).valueOf();
  }
  if (typeof patch.startTime !== 'undefined') {
    task.startTime = patch.startTime;
  }
  if (typeof patch.endTime !== 'undefined') {
    task.endTime = patch.endTime;
  }
  if (
    (typeof patch.start !== 'undefined' || typeof patch.startTime !== 'undefined') &&
    typeof patch.end === 'undefined' &&
    typeof patch.endTime === 'undefined' &&
    typeof prevStartTime !== 'undefined' &&
    typeof task.endTime !== 'undefined'
  ) {
    // the start moved without a new end - shift the end to keep the duration
    task.endTime = task.startTime + (task.endTime - prevStartTime);
  }
  if (typeof patch.duration !== 'undefined') {
    task.endTime = task.startTime + task.duration;
  } else if (typeof task.endTime !== 'undefined') {
    task.duration = task.endTime - task.startTime;
  }
}
