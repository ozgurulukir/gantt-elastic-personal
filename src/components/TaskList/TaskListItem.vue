<!--
/**
 * @fileoverview TaskListItem component
 * @license MIT
 * @author Rafal Pospiech <neuronet.io@gmail.com>
 * @package GanttElastic
 */
-->
<template>
  <div
    class="gantt-elastic__task-list-item"
    :class="{
      'gantt-elastic__task-list-item--selected': root.state.selectedTaskId === task.id,
      'gantt-elastic__task-list-item--hover': root.state.hoveredTaskId === task.id
    }"
    :style="{ ...root.style['task-list-item'], ...highlightStyle }"
    role="treeitem"
    tabindex="0"
    :aria-level="task.parents.length + 1"
    :aria-expanded="task.allChildren.length > 0 ? !task.collapsed : undefined"
    :aria-selected="root.state.selectedTaskId === task.id"
    :data-task-row="task.id"
  >
    <item-column v-for="column in columns" :key="column._id" :column="column" :task="task">
      <task-list-expander
        v-if="column.expander"
        :tasks="[task]"
        :options="root.state.options.taskList.expander"
        type="taskList"
      ></task-list-expander>
    </item-column>
  </div>
</template>
<script>
import TaskListExpander from '../Expander.vue';
import ItemColumn from './ItemColumn.vue';

export default {
  name: 'TaskListItem',
  components: {
    TaskListExpander,
    ItemColumn
  },
  inject: ['root'],
  props: ['task'],
  data() {
    return {};
  },
  computed: {
    columns() {
      return this.root.state.options.taskList.columns;
    },

    /**
     * Selection / hover highlight style for this row (issues #6, #12)
     *
     * @returns {object}
     */
    highlightStyle() {
      const style = {};
      if (this.root.state.selectedTaskId === this.task.id) {
        Object.assign(style, this.root.style['task-list-item--selected']);
      } else if (this.root.state.hoveredTaskId === this.task.id) {
        Object.assign(style, this.root.style['task-list-item--hover']);
      }
      return style;
    }
  }
};
</script>
