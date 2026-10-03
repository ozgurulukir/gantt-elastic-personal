<!--
/**
 * @fileoverview TaskListHeader component
 * @license MIT
 * @author Rafal Pospiech <neuronet.io@gmail.com>
 * @package GanttElastic
 */
-->
<template>
  <div
    class="gantt-elastic__task-list-header"
    :style="{
      ...root.style['task-list-header'],
      height: `${root.state.options.calendar.height}px`,
      'margin-bottom': `${root.state.options.calendar.gap}px`
    }"
  >
    <div
      class="gantt-elastic__task-list-header-column"
      :style="{
        ...root.style['task-list-header-column'],
        ...column.style['task-list-header-column'],
        ...getStyle(column)
      }"
      v-for="column in root.getTaskListColumns"
      :key="column._id"
    >
      <task-list-expander
        v-if="column.expander"
        :tasks="collapsible"
        :options="root.state.options.taskList.expander"
      ></task-list-expander>
      <div
        class="gantt-elastic__task-list-header-label"
        :style="{ ...root.style['task-list-header-label'], ...column.style['task-list-header-label'] }"
        :column="column"
        @mouseup="resizerMouseUp"
      >
        {{ column.label }}
      </div>
      <div
        class="gantt-elastic__task-list-header-resizer-wrapper"
        :style="{
          ...root.style['task-list-header-resizer-wrapper'],
          ...column.style['task-list-header-resizer-wrapper']
        }"
        :column="column"
        tabindex="0"
        role="separator"
        aria-orientation="vertical"
        :aria-label="`Resize ${column.label} column`"
        :aria-valuenow="column.width"
        @keydown="resizerKeyDown($event, column)"
        @mousedown="resizerMouseDown($event, column)"
        @dblclick="resizerReset($event, column)"
      >
        <div
          class="gantt-elastic__task-list-header-resizer"
          :style="{ ...root.style['task-list-header-resizer'], ...column.style['task-list-header-resizer'] }"
        >
          <div
            class="gantt-elastic__task-list-header-resizer-dot"
            :style="{ ...root.style['task-list-header-resizer-dot'], ...column.style['task-list-header-resizer-dot'] }"
          ></div>
          <div
            class="gantt-elastic__task-list-header-resizer-dot"
            :style="{ ...root.style['task-list-header-resizer-dot'], ...column.style['task-list-header-resizer-dot'] }"
          ></div>
          <div
            class="gantt-elastic__task-list-header-resizer-dot"
            :style="{ ...root.style['task-list-header-resizer-dot'], ...column.style['task-list-header-resizer-dot'] }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TaskListExpander from '../Expander.vue';
export default {
  name: 'TaskListHeader',
  components: {
    TaskListExpander
  },

  inject: ['root'],

  data() {
    return {
      resizer: {
        moving: false,
        x: 0
      }
    };
  },

  computed: {
    /**
     * Is this row collapsible?
     *
     * @returns {bool}
     */
    collapsible() {
      return this.root.state.tasks.filter(task => task.allChildren.length > 0);
    }
  },

  methods: {
    /**
     * Get style
     *
     * @returns {object}
     */
    getStyle(column) {
      return {
        width: column.finalWidth + 'px'
      };
    },

    /**
     * Clamp a column width between taskList.minWidth and 60% of the
     * client width (issue #11)
     *
     * @param {object} column
     * @param {number} width
     * @returns {number}
     */
    clampColumnWidth(column, width) {
      const minWidth = this.root.state.options.taskList.minWidth || 18;
      const maxWidth = Math.max(minWidth, this.root.state.options.clientWidth * 0.6);
      if (width < minWidth) {
        return minWidth;
      }
      if (width > maxWidth) {
        return maxWidth;
      }
      return width;
    },

    /**
     * Emit the terminal width-changed event and persist when configured
     *
     * @param {object} column
     */
    columnWidthChanged(column) {
      this.root.$emitBus.emit('taskList-column-width-changed', { column, width: column.width });
      this.persistColumnWidths();
    },

    /**
     * Resizer mouse down event handler
     */
    resizerMouseDown(event, column) {
      if (!this.resizer.moving) {
        this.resizer.moving = column;
        this.resizer.x = event.clientX;
        this.resizer.initialWidth = column.width;
        this.root.$emitBus.emit('taskList-column-width-change-start', this.resizer.moving);
      }
    },

    /**
     * Resizer mouse move event handler
     */
    resizerMouseMove(event) {
      if (this.resizer.moving) {
        const column = this.resizer.moving;
        const lastWidth = column.width;
        column.width = this.clampColumnWidth(column, this.resizer.initialWidth + event.clientX - this.resizer.x);
        if (lastWidth !== column.width) {
          this.root.$emitBus.emit('taskList-column-width-change', column);
        }
      }
    },

    /**
     * Resizer mouse up event handler
     */
    resizerMouseUp(event) {
      if (this.resizer.moving) {
        this.root.$emitBus.emit('taskList-column-width-change-stop', this.resizer.moving);
        this.columnWidthChanged(this.resizer.moving);
        this.resizer.moving = false;
      }
    },

    /**
     * Keyboard resize - arrow keys adjust the focused column divider
     * (issue #11); shift for fine steps
     *
     * @param {event} event
     * @param {object} column
     */
    resizerKeyDown(event, column) {
      let delta = 0;
      if (event.key === 'ArrowLeft') {
        delta = event.shiftKey ? -1 : -10;
      } else if (event.key === 'ArrowRight') {
        delta = event.shiftKey ? 1 : 10;
      } else {
        return;
      }
      event.preventDefault();
      const lastWidth = column.width;
      column.width = this.clampColumnWidth(column, column.width + delta);
      if (lastWidth !== column.width) {
        this.root.$emitBus.emit('taskList-column-width-change', column);
        this.columnWidthChanged(column);
      }
    },

    /**
     * Double click resets the column to its configured width (issue #11)
     *
     * @param {event} event
     * @param {object} column
     */
    resizerReset(event, column) {
      if (typeof column._initialWidth !== 'undefined') {
        const lastWidth = column.width;
        column.width = this.clampColumnWidth(column, column._initialWidth);
        this.root.$emitBus.emit('taskList-column-width-change', column);
        this.columnWidthChanged(column);
      }
    },

    /**
     * Persist runtime column widths to localStorage (issue #11, opt-in via
     * taskList.persistColumnWidths) - best effort, storage may be unavailable
     */
    persistColumnWidths() {
      if (this.root.state.options.taskList.persistColumnWidths !== true) {
        return;
      }
      try {
        const widths = {};
        for (let column of this.root.getTaskListColumns) {
          widths[column._id] = column.width;
        }
        window.localStorage.setItem('gantt-elastic:column-widths:' + this.storageKey, JSON.stringify(widths));
      } catch (error) {
        // storage unavailable (private mode, quota) - persistence is best effort
      }
    },

    /**
     * Restore persisted column widths (issue #11) - best effort, corrupted or
     * missing storage is ignored
     */
    restoreColumnWidths() {
      if (this.root.state.options.taskList.persistColumnWidths !== true) {
        return;
      }
      try {
        const raw = window.localStorage.getItem('gantt-elastic:column-widths:' + this.storageKey);
        if (!raw) {
          return;
        }
        const widths = JSON.parse(raw);
        for (let column of this.root.getTaskListColumns) {
          if (typeof widths[column._id] === 'number') {
            column.width = this.clampColumnWidth(column, widths[column._id]);
          }
        }
        this.root.$emitBus.emit('taskList-column-width-change');
      } catch (error) {
        // corrupted storage entry - start from the configured widths
      }
    }
  },

  /**
   * Created
   */
  created() {
    this.$set = function(obj, key, val) { obj[key] = val; };
    this.$delete = function(obj, key) { delete obj[key]; };

    // bind once and keep the references - bind() in addEventListener left the
    // document listeners impossible to remove (leak on every unmount)
    this.boundResizerMouseUp = this.resizerMouseUp.bind(this);
    this.boundResizerMouseMove = this.resizerMouseMove.bind(this);
    document.addEventListener('mouseup', this.boundResizerMouseUp);
    document.addEventListener('mousemove', this.boundResizerMouseMove);
    this.root.$emitBus.on('main-view-mousemove', this.resizerMouseMove);
    this.root.$emitBus.on('main-view-mouseup', this.resizerMouseUp);
    this.storageKey = this.root.state.options.taskList.persistKey || 'default';
    this.restoreColumnWidths();
  },

  /**
   * Before destroy event - clear all event listeners
   */
  beforeUnmount() {
    document.removeEventListener('mouseup', this.boundResizerMouseUp);
    document.removeEventListener('mousemove', this.boundResizerMouseMove);
    this.root.$emitBus.off('main-view-mousemove', this.resizerMouseMove);
    this.root.$emitBus.off('main-view-mouseup', this.resizerMouseUp);
  }
};
</script>
