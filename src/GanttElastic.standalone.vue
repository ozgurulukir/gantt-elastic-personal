<!--
/**
 * @fileoverview GanttElastic standalone version component
 * @license MIT
 * @author Rafal Pospiech <neuronet.io@gmail.com>
 * @package
 */
-->
<template>
  <gantt-elastic ref="gantt" :tasks="tasks" :options="options" :dynamicStyle="dynamicStyle" @gantt-elastic-ready="onReady">
    <template v-if="components.header" #header>
      <component :is="components.header" />
    </template>
    <template v-if="components.footer" #footer>
      <component :is="components.footer" />
    </template>
  </gantt-elastic>
</template>
<script>
import GanttElastic from './GanttElastic.vue';
export default {
  name: 'GanttElasticStandalone',
  components: {
    'gantt-elastic': GanttElastic
  },
  props: ['header', 'footer'],
  data() { return {
    components: {},
    tasks: [],
    options: {},
    dynamicStyle: {} };
  },
  methods: {
    onReady(instance) {
      if (typeof this.ready === 'function') {
        this.ready(instance);
      }
    }
  }
};
</script>
