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
      // `ready` is supplied as a top-level option on the standalone component
      // (see bundle.js). In Vue 3 arbitrary top-level options are not exposed
      // on `this`, so read it from `$options`.
      if (typeof this.$options.ready === 'function') {
        this.$options.ready(instance);
      }
    }
  }
};
</script>
