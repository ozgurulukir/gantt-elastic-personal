/**
 * @fileoverview Task mixin
 * @license MIT
 * @author Rafal Pospiech <neuronet.io@gmail.com>
 * @package GanttElastic
 */
import dayjs from 'dayjs';

export default {
  computed: {
    /**
     * Get view box
     *
     * @returns {string}
     */
    getViewBox() {
      const task = this.task;
      return `0 0 ${task.width} ${task.height}`;
    },

    /**
     * Get group transform
     *
     * @returns {string}
     */
    getGroupTransform() {
      return `translate(${this.task.x} ${this.task.y})`;
    },

    /**
     * Should we display expander?
     *
     * @returns {boolean}
     */
    displayExpander() {
      const expander = this.root.state.options.chart.expander;
      return expander.display || (expander.displayIfTaskListHidden && !this.root.state.options.taskList.display);
    },

    /**
     * Accessible label for the bar: label plus date range (issue #13)
     *
     * @returns {string}
     */
    barAriaLabel() {
      const task = this.task;
      const endTime = typeof task.endTime === 'undefined' ? task.startTime + task.duration : task.endTime;
      const start = dayjs(task.startTime).format('YYYY-MM-DD');
      const end = dayjs(endTime).format('YYYY-MM-DD');
      return `${task.label}, ${start} - ${end}`;
    }
  },
  methods: {
    /**
     * Emit event
     *
     * @param {string} eventName
     * @param {Event} event
     */
    emitEvent(eventName, event) {
      if (!this.root.state.options.scroll.scrolling) {
        this.root.$emitBus.emit(`chart-${this.task.type}-${eventName}`, { event, data: this.task });
      }
    },

    /**
     * Keyboard interaction on a focused bar (issue #13): Enter/Space activate
     * (same event a click would fire), arrows move between rendered bars,
     * Escape clears the selection
     *
     * @param {event} event
     */
    onBarKeyDown(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.emitEvent('click', event);
      } else if (event.key === 'Escape') {
        this.root.clearSelection();
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const bars = Array.from(document.querySelectorAll('.gantt-elastic__chart-row-bar'));
        const index = bars.indexOf(event.currentTarget);
        const next = bars[index + (event.key === 'ArrowDown' ? 1 : -1)];
        if (next) {
          next.focus();
        }
      }
    }
  }
};
