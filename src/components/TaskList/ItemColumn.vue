<!--
/**
 * @fileoverview ItemColumn component
 * @license MIT
 * @author Rafal Pospiech <neuronet.io@gmail.com>
 * @package GanttElastic
 */
-->
<template>
  <div class="gantt-elastic__task-list-item-column" :style="itemColumnStyle">
    <div class="gantt-elastic__task-list-item-value-wrapper" :style="wrapperStyle">
      <slot></slot>
      <div class="gantt-elastic__task-list-item-value-container" :style="containerStyle">
        <div
          v-if="!html"
          class="gantt-elastic__task-list-item-value"
          :style="valueStyle"
          @click="emitEvent('click', $event)"
          @mouseenter="emitEvent('mouseenter', $event)"
          @mouseover="emitEvent('mouseover', $event)"
          @mouseout="emitEvent('mouseout', $event)"
          @mouseleave="emitEvent('mouseleave', $event)"
          @mousemove="emitEvent('mousemove', $event)"
          @mousedown="emitEvent('mousedown', $event)"
          @mouseup="emitEvent('mouseup', $event)"
          @mousewheel="emitEvent('mousewheel', $event)"
          @touchstart="emitEvent('touchstart', $event)"
          @touchmove="emitEvent('touchmove', $event)"
          @touchend="emitEvent('touchend', $event)"
        >
          {{ value }}
        </div>
        <div
          v-else
          class="gantt-elastic__task-list-item-value"
          :style="valueStyle"
          @click="emitEvent('click', $event)"
          @mouseenter="emitEvent('mouseenter', $event)"
          @mouseover="emitEvent('mouseover', $event)"
          @mouseout="emitEvent('mouseout', $event)"
          @mouseleave="emitEvent('mouseleave', $event)"
          @mousemove="emitEvent('mousemove', $event)"
          @mousedown="emitEvent('mousedown', $event)"
          @mouseup="emitEvent('mouseup', $event)"
          @mousewheel="emitEvent('mousewheel', $event)"
          @touchstart="emitEvent('touchstart', $event)"
          @touchmove="emitEvent('touchmove', $event)"
          @touchend="emitEvent('touchend', $event)"
          v-html="sanitizedValue"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { sanitizeHtml } from '../../html.js';

export default {
  name: 'ItemColumn',
  inject: ['root'],
  props: ['column', 'task'],
  data() {
    return {};
  },
  methods: {
    /**
     * Emit event
     *
     * @param {String} eventName
     * @param {Event} event
     */
    emitEvent(eventName, event) {
      if (typeof this.column.events !== 'undefined' && typeof this.column.events[eventName] === 'function') {
        this.column.events[eventName]({ event, data: this.task, column: this.column });
      }
      this.root.$emitBus.emit(`taskList-${this.task.type}-${eventName}`, { event, data: this.task, column: this.column });
    }
  },
  computed: {
    /**
     * Column style; can be a function with a 'task' param,
     * so users can render different column styles depending on task attributes
     *
     * @returns {object}
     */
    columnStyle() {
      const style = typeof this.column.style === 'function' ? this.column.style(this.task) : this.column.style;
      return style || {};
    },

    /**
     * Should we display html or just text?
     *
     * @returns {boolean}
     */
    html() {
      if (typeof this.column.html !== 'undefined' && this.column.html === true) {
        return true;
      }
      return false;
    },

    /**
     * Get column value
     *
     * @returns {any|string}
     */
    value() {
      if (typeof this.column.value === 'function') {
        return this.column.value(this.task);
      }
      return this.task[this.column.value];
    },

    /**
     * Column value sanitized before v-html injection - html rendering is
     * opt-in per column but the value itself is still untrusted input
     *
     * @returns {string}
     */
    sanitizedValue() {
      return sanitizeHtml(this.value);
    },

    itemColumnStyle() {
      return {
        ...this.root.style['task-list-item-column'],
        ...this.columnStyle['task-list-item-column'],
        width: this.column.finalWidth + 'px',
        height: this.column.height + 'px'
      };
    },

    wrapperStyle() {
      return {
        ...this.root.style['task-list-item-value-wrapper'],
        ...this.columnStyle['task-list-item-value-wrapper']
      };
    },

    containerStyle() {
      return {
        ...this.root.style['task-list-item-value-container'],
        ...this.columnStyle['task-list-item-value-container']
      };
    },

    valueStyle() {
      return { ...this.root.style['task-list-item-value'], ...this.columnStyle['task-list-item-value'] };
    }
  }
};
</script>
