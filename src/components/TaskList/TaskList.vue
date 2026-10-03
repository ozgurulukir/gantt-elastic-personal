<!--
/**
 * @fileoverview TaskList component
 * @license MIT
 * @author Rafal Pospiech <neuronet.io@gmail.com>
 * @package GanttElastic
 */
-->
<template>
  <div
    class="gantt-elastic__task-list-wrapper"
    ref="taskListWrapper"
    :style="{ ...root.style['task-list-wrapper'], width: '100%', height: '100%' }"
    v-show="root.state.options.taskList.display"
  >
    <div class="gantt-elastic__task-list" :style="{ ...root.style['task-list'] }" ref="taskList">
      <task-list-header></task-list-header>
      <div
        class="gantt-elastic__task-list-items"
        ref="taskListItems"
        :style="{ ...root.style['task-list-items'], height: root.state.options.rowsHeight + 'px' }"
      >
        <!-- virtualization spacers keep the scroll height stable while only
             rows inside the viewport are mounted (issue #9) -->
        <div class="gantt-elastic__task-list-spacer" :style="{ height: topSpacer + 'px' }" v-if="topSpacer > 0"></div>
        <task-list-item v-for="task in root.renderedTasks" :key="task.id" :task="task"></task-list-item>
        <div class="gantt-elastic__task-list-spacer" :style="{ height: bottomSpacer + 'px' }" v-if="bottomSpacer > 0"></div>
      </div>
    </div>
  </div>
</template>

<script>
import TaskListHeader from './TaskListHeader.vue';
import TaskListItem from './TaskListItem.vue';
export default {
  name: 'TaskList',
  components: {
    TaskListHeader,
    TaskListItem
  },
  inject: ['root'],
  data() {
    return {};
  },
  computed: {
    /**
     * Row pitch - matches the chart's y step
     *
     * @returns {number}
     */
    rowPitch() {
      return this.root.state.options.row.height + this.root.state.options.chart.grid.horizontal.gap * 2;
    },

    /**
     * Height of the spacer above the rendered rows (issue #9)
     *
     * @returns {number}
     */
    topSpacer() {
      return this.root.renderedFirstIndex * this.rowPitch;
    },

    /**
     * Height of the spacer below the rendered rows (issue #9)
     *
     * @returns {number}
     */
    bottomSpacer() {
      const afterLast = this.root.renderedFirstIndex + this.root.renderedTasks.length;
      return Math.max(0, this.root.visibleTasks.length - afterLast) * this.rowPitch;
    }
  },

  /**
   * Mounted
   */
  mounted() {
    this.root.state.refs.taskListWrapper = this.$refs.taskListWrapper;
    this.root.state.refs.taskList = this.$refs.taskList;
    this.root.state.refs.taskListItems = this.$refs.taskListItems;
  }
};
</script>
