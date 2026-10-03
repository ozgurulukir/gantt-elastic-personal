<!--
/**
 * @fileoverview DependencyLines component
 * @license MIT
 * @author Rafal Pospiech <neuronet.io@gmail.com>
 * @package GanttElastic
 */
-->
<template>
  <svg
    x="0"
    y="0"
    width="100%"
    height="100%"
    class="gantt-elastic__chart-dependency-lines-container"
    :style="{ ...root.style['chart-dependency-lines-container'] }"
  >
    <g v-for="entry in dependencyTasks" :key="entry.task.id" :task="entry.task">
      <path
        class="gantt-elastic__chart-dependency-lines-path"
        :style="{ ...root.style['chart-dependency-lines-path'], ...entry.task.style['chart-dependency-lines-path'], ...entry.task.style['chart-dependency-lines-path-' + line.task_id] }"
        v-for="line in entry.lines"
        :key="line.task_id"
        :task="entry.task"
        :d="line.points"
      ></path>
    </g>
  </svg>
</template>

<script>
export default {
  name: 'DependencyLines',
  inject: ['root'],
  props: ['tasks'],
  data() {
    return {};
  },
  methods: {
    /**
     * Get path points
     *
     * @param {any} fromTaskId
     * @param {any} toTaskId
     * @returns {string}
     */
    getPoints(fromTaskId, toTaskId) {
      const fromTask = this.root.getTask(fromTaskId);
      const toTask = this.root.getTask(toTaskId);
      if (
        fromTask === null ||
        toTask === null ||
        !this.root.isTaskVisible(toTask) ||
        !this.root.isTaskVisible(fromTask)
      ) {
        return null;
      }
      const startX = fromTask.x + fromTask.width;
      const startY = fromTask.y + fromTask.height / 2;
      const stopX = toTask.x;
      const stopY = toTask.y + toTask.height / 2;
      const distanceX = stopX - startX;
      let distanceY;
      let yMultiplier = 1;
      if (stopY >= startY) {
        distanceY = stopY - startY;
      } else {
        distanceY = startY - stopY;
        yMultiplier = -1;
      }
      const offset = 10;
      const roundness = 4;
      const isBefore = distanceX <= offset + roundness;
      let points = `M ${startX} ${startY}
          L ${startX + offset},${startY} `;
      if (isBefore) {
        points += `Q ${startX + offset + roundness},${startY} ${startX + offset + roundness},${startY +
          roundness * yMultiplier}
            L ${startX + offset + roundness},${startY + (distanceY * yMultiplier) / 2 - roundness * yMultiplier}
            Q ${startX + offset + roundness},${startY + (distanceY * yMultiplier) / 2} ${startX + offset},${startY +
          (distanceY * yMultiplier) / 2}
            L ${startX - offset + distanceX},${startY + (distanceY * yMultiplier) / 2}
            Q ${startX - offset + distanceX - roundness},${startY + (distanceY * yMultiplier) / 2} ${startX -
          offset +
          distanceX -
          roundness},${startY + (distanceY * yMultiplier) / 2 + roundness * yMultiplier}
            L ${startX - offset + distanceX - roundness},${stopY - roundness * yMultiplier}
            Q ${startX - offset + distanceX - roundness},${stopY} ${startX - offset + distanceX},${stopY}
            L ${stopX},${stopY}`;
      } else {
        points += `L ${startX + distanceX / 2 - roundness},${startY}
            Q ${startX + distanceX / 2},${startY} ${startX + distanceX / 2},${startY + roundness * yMultiplier}
            L ${startX + distanceX / 2},${stopY - roundness * yMultiplier}
            Q ${startX + distanceX / 2},${stopY} ${startX + distanceX / 2 + roundness},${stopY}
            L ${stopX},${stopY}`;
      }
      return points;
    }
  },
  computed: {
    /**
     * Tasks which have dependency lines, as { task, lines } entries.
     * Pure computed - the previous version wrote task.dependencyLines back
     * onto the reactive task objects from inside the computed (issue #3).
     *
     * @returns {array}
     */
    dependencyTasks() {
      return this.tasks
        .filter(task => Array.isArray(task.dependencies))
        .map(task => ({
          task,
          lines: task.dependencies
            .map(id => ({ points: this.getPoints(id, task.id), task_id: id }))
            .filter(line => line.points !== null)
        }))
        .filter(entry => entry.lines.length > 0);
    }
  }
};
</script>
