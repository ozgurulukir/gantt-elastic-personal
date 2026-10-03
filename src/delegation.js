/**
 * @fileoverview Delegated mouse/touch/keyboard handling (issue #10): one
 * listener set per container instead of ~12 listeners on every row element.
 * Bar and cell elements carry data-task-id (cells also data-column-id), rows
 * carry data-task-row; events are resolved with closest() and re-emitted on
 * the event bus with the same payloads the per-element handlers used.
 * mouseenter/mouseleave do not bubble - they are synthesized from delegated
 * mouseover/mouseout with relatedTarget containment checks.
 * @license MIT
 * @package GanttElastic
 */

/**
 * Create the delegation: attach container listeners and return a handle
 * whose destroy() removes them again.
 *
 * All component state reaches the factory through callbacks, so this module
 * depends on no framework and the emission/subscriber checks are explicit
 * seams rather than leaks into the bus internals.
 *
 * @param {object} deps
 * @param {element} deps.chartContainer chart scroll container element
 * @param {element} deps.taskListItems task list rows container element
 * @param {function} deps.getTask (id) => task|null
 * @param {function} deps.getColumns () => taskList columns array
 * @param {function} deps.isScrolling () => boolean - true while drag-scrolling
 * @param {function} deps.hasSubscribers (eventName) => boolean
 * @param {function} deps.emit (eventName, payload) => void - bus emission
 * @param {function} deps.selectTask (taskId) => void
 * @param {function} deps.clearSelection () => void
 * @returns {object} { destroy }
 */
export function createDelegation(deps) {
  const { chartContainer, taskListItems, getTask, getColumns, isScrolling, hasSubscribers, emit, selectTask, clearSelection } = deps;
  const delegation = {
    handlers: [],
    lastBarElement: null,
    lastChartRowElement: null,
    lastListRowElement: null
  };
  const track = (target, type, handler) => {
    target.addEventListener(type, handler);
    delegation.handlers.push([target, type, handler]);
  };
  const closestAttribute = (event, attribute) => {
    if (typeof event.target.closest !== 'function') {
      return null;
    }
    const element = event.target.closest(`[${attribute}]`);
    return element === null ? null : element;
  };
  const barTask = event => {
    const element = closestAttribute(event, 'data-task-id');
    return element === null ? null : getTask(element.getAttribute('data-task-id'));
  };
  const suppressed = () => isScrolling();

  // ---- chart container: bar events + row hover + bar keyboard ----
  const emitChart = (eventName, event, task) => {
    const name = `chart-${task.type}-${eventName}`;
    if (hasSubscribers(name)) {
      emit(name, { event, data: task });
    }
  };
  for (let type of [
    'click',
    'mousedown',
    'mouseup',
    'mousemove',
    'mouseover',
    'mouseout',
    'mousewheel',
    'touchstart',
    'touchmove',
    'touchend'
  ]) {
    track(chartContainer, type, event => {
      // mousedown/touchstart must pass: the container's drag-scroll
      // handler runs first (registered earlier, same element) and sets
      // scroll.scrolling, which must not swallow the bar press event -
      // the old per-row handlers fired in the target phase before it
      if (suppressed() && type !== 'mousedown' && type !== 'touchstart') {
        return;
      }
      const task = barTask(event);
      if (task !== null) {
        emitChart(type, event, task);
      }
    });
  }
  track(chartContainer, 'mouseover', event => {
    if (suppressed()) {
      return;
    }
    const barElement = closestAttribute(event, 'data-task-id');
    if (barElement !== null && barElement !== delegation.lastBarElement) {
      delegation.lastBarElement = barElement;
      const task = getTask(barElement.getAttribute('data-task-id'));
      if (task !== null) {
        emitChart('mouseenter', event, task);
      }
    }
    const rowElement = closestAttribute(event, 'data-task-row');
    if (rowElement !== null && rowElement !== delegation.lastChartRowElement) {
      delegation.lastChartRowElement = rowElement;
      const task = getTask(rowElement.getAttribute('data-task-row'));
      if (task !== null && hasSubscribers('chart-row-mouseenter')) {
        emit('chart-row-mouseenter', { event, data: task });
      }
    }
  });
  track(chartContainer, 'mouseout', event => {
    if (suppressed()) {
      return;
    }
    const barElement = closestAttribute(event, 'data-task-id');
    if (barElement !== null && (event.relatedTarget === null || !barElement.contains(event.relatedTarget))) {
      if (delegation.lastBarElement === barElement) {
        delegation.lastBarElement = null;
      }
      const task = getTask(barElement.getAttribute('data-task-id'));
      if (task !== null) {
        emitChart('mouseleave', event, task);
      }
    }
    const rowElement = closestAttribute(event, 'data-task-row');
    if (rowElement !== null && (event.relatedTarget === null || !rowElement.contains(event.relatedTarget))) {
      if (delegation.lastChartRowElement === rowElement) {
        delegation.lastChartRowElement = null;
      }
      const task = getTask(rowElement.getAttribute('data-task-row'));
      if (task !== null && hasSubscribers('chart-row-mouseleave')) {
        emit('chart-row-mouseleave', { event, data: task });
      }
    }
  });
  track(chartContainer, 'keydown', event => {
    if (suppressed()) {
      return;
    }
    const barElement = closestAttribute(event, 'data-task-id');
    if (barElement === null) {
      return;
    }
    const task = getTask(barElement.getAttribute('data-task-id'));
    if (task === null) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      emitChart('click', event, task);
    } else if (event.key === 'Escape') {
      clearSelection();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const bars = Array.from(chartContainer.querySelectorAll('[data-task-id]'));
      const index = bars.indexOf(barElement);
      const next = bars[index + (event.key === 'ArrowDown' ? 1 : -1)];
      if (next !== undefined) {
        next.focus();
      }
    }
  });

  // ---- task list container: cell events + row hover + row keyboard ----
  for (let type of [
    'click',
    'mousedown',
    'mouseup',
    'mousemove',
    'mouseover',
    'mouseout',
    'mousewheel',
    'touchstart',
    'touchmove',
    'touchend'
  ]) {
    track(taskListItems, type, event => {
      if (suppressed()) {
        return;
      }
      const element = closestAttribute(event, 'data-task-id');
      if (element === null) {
        return;
      }
      const task = getTask(element.getAttribute('data-task-id'));
      if (task === null) {
        return;
      }
      const columnId = element.getAttribute('data-column-id');
      const column =
        typeof columnId === 'string'
          ? getColumns().find(candidate => candidate._id === columnId)
          : undefined;
      if (column && column.events && typeof column.events[type] === 'function') {
        column.events[type]({ event, data: task, column });
      }
      const name = `taskList-${task.type}-${type}`;
      if (hasSubscribers(name)) {
        emit(name, { event, data: task, column });
      }
    });
  }
  track(taskListItems, 'mouseover', event => {
    if (suppressed()) {
      return;
    }
    const rowElement = closestAttribute(event, 'data-task-row');
    if (rowElement !== null && rowElement !== delegation.lastListRowElement) {
      delegation.lastListRowElement = rowElement;
      const task = getTask(rowElement.getAttribute('data-task-row'));
      if (task !== null && hasSubscribers('taskList-row-mouseenter')) {
        emit('taskList-row-mouseenter', { event, data: task });
      }
    }
  });
  track(taskListItems, 'mouseout', event => {
    if (suppressed()) {
      return;
    }
    const rowElement = closestAttribute(event, 'data-task-row');
    if (rowElement !== null && (event.relatedTarget === null || !rowElement.contains(event.relatedTarget))) {
      if (delegation.lastListRowElement === rowElement) {
        delegation.lastListRowElement = null;
      }
      const task = getTask(rowElement.getAttribute('data-task-row'));
      if (task !== null && hasSubscribers('taskList-row-mouseleave')) {
        emit('taskList-row-mouseleave', { event, data: task });
      }
    }
  });
  track(taskListItems, 'keydown', event => {
    // the expander handles its own Enter/Space (toggle) - do not also
    // select the row, mirroring the chart side where the expander sits
    // outside the data-task-id chain
    if (
      typeof event.target.closest === 'function' &&
      event.target.closest('.gantt-elastic__task-list-expander-content') !== null
    ) {
      return;
    }
    const rowElement = closestAttribute(event, 'data-task-row');
    if (rowElement === null) {
      return;
    }
    // resolve through getTask - the attribute is a string while task ids
    // may be numbers and selection compares strictly
    const task = getTask(rowElement.getAttribute('data-task-row'));
    if (task === null) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectTask(task.id);
    } else if (event.key === 'Escape') {
      clearSelection();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const rows = Array.from(taskListItems.querySelectorAll('[data-task-row]'));
      const index = rows.indexOf(rowElement);
      const next = rows[index + (event.key === 'ArrowDown' ? 1 : -1)];
      if (next !== undefined) {
        next.focus();
      }
    }
  });

  return {
    destroy() {
      for (const [target, type, handler] of delegation.handlers) {
        target.removeEventListener(type, handler);
      }
      delegation.handlers = [];
    }
  };
}
