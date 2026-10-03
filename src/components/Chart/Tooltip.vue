<!--
/**
 * @fileoverview Chart bar tooltip
 * @license MIT
 * @package GanttElastic
 */
-->
<template>
  <div
    class="gantt-elastic__chart-tooltip"
    :style="{ ...root.style['chart-tooltip'], left: x + 'px', top: y + 'px' }"
    v-if="visible"
  >
    {{ content }}
  </div>
</template>

<script>
import dayjs from 'dayjs';

const BAR_TYPES = ['task', 'milestone', 'project'];

export default {
  name: 'ChartTooltip',
  inject: ['root'],
  data() {
    return {
      visible: false,
      x: 0,
      y: 0,
      task: null,
      boundHandlers: []
    };
  },
  created() {
    this.$set = function(obj, key, val) { obj[key] = val; };
    this.$delete = function(obj, key) { delete obj[key]; };
    if (this.root.state.options.chart.tooltip.display === false) {
      return;
    }
    // bars already emit chart-<type>-<event> through the event bus (Task.mixin emitEvent)
    for (let type of BAR_TYPES) {
      for (let eventName of ['mouseenter', 'mousemove', 'mouseleave']) {
        const handler = payload => this.onBarEvent(eventName, payload);
        this.root.$emitBus.on(`chart-${type}-${eventName}`, handler);
        this.boundHandlers.push([`chart-${type}-${eventName}`, handler]);
      }
    }
  },

  beforeUnmount() {
    for (const [eventName, handler] of this.boundHandlers) {
      this.root.$emitBus.off(eventName, handler);
    }
    this.boundHandlers = [];
  },

  methods: {
    /**
     * Bus event dispatched by a chart bar
     *
     * @param {string} eventName mouseenter | mousemove | mouseleave
     * @param {object} payload { event, data } as emitted by the row mixin
     */
    onBarEvent(eventName, { event, data }) {
      if (eventName === 'mouseleave') {
        this.visible = false;
        this.task = null;
        return;
      }
      this.task = data;
      // fixed positioning keeps the tooltip out of any overflow:hidden ancestor
      this.x = event.clientX + 14;
      this.y = event.clientY + 14;
      this.visible = true;
    }
  },

  computed: {
    /**
     * Tooltip text - custom options.chart.tooltip.format(task) or default layout
     *
     * @returns {string}
     */
    content() {
      const task = this.task;
      if (!task) {
        return '';
      }
      const custom = this.root.state.options.chart.tooltip.format;
      if (typeof custom === 'function') {
        return String(custom(task));
      }
      const localeName = this.root.state.options.locale.name;
      const endTime = typeof task.endTime === 'undefined' ? task.startTime + task.duration : task.endTime;
      const start = dayjs(task.startTime)
        .locale(localeName)
        .format('L LT');
      const end = dayjs(endTime)
        .locale(localeName)
        .format('L LT');
      const days = Math.round((task.duration / 86400000) * 10) / 10;
      const duration = days >= 1 ? `${days} day(s)` : `${Math.round((task.duration / 3600000) * 10) / 10} hour(s)`;
      const lines = [task.label, `${start} – ${end}`, duration, `progress: ${task.progress}%`];
      if (typeof task.user !== 'undefined' && task.user !== null) {
        lines.push(`user: ${task.user}`);
      }
      return lines.join('\n');
    }
  }
};
</script>
