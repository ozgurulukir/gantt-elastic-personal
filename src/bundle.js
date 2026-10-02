/**
 * @fileoverview Bundle main entry file
 * @license MIT
 * @author Rafal Pospiech <neuronet.io@gmail.com>
 * @package GanttElasticStandalone
 */
import { createApp } from 'vue';
import { mergeDeep } from './GanttElastic.vue';
import GanttElasticStandalone from './GanttElastic.standalone.vue';

window.GanttElastic = {
  component: GanttElasticStandalone,
  mount(config) {
    const ready = typeof config.ready === 'function' ? config.ready : () => {};
    const cfg = mergeDeep({}, config);
    if (typeof cfg.dynamicStyle === 'undefined') {
      cfg.dynamicStyle = {};
    }
    const ganttElastic = { ...GanttElasticStandalone };
    ganttElastic.ready = ready;
    // standalone.vue's data() returns empty defaults, so the user config must be
    // delivered through data() - merging it onto the options object is ignored by Vue 3
    ganttElastic.data = function () {
      return {
        components: cfg.components || {},
        tasks: Array.isArray(cfg.tasks) ? cfg.tasks : [],
        options: cfg.options || {},
        dynamicStyle: cfg.dynamicStyle || {}
      };
    };

    const app = createApp(ganttElastic);
    const instance = app.mount(cfg.el);
    return instance;
  }
};
export default GanttElasticStandalone;
