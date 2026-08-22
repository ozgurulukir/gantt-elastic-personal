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
    for (let prop in cfg) {
      if (['el', 'ready'].includes(prop)) {
        continue;
      }
      if (typeof ganttElastic[prop] !== 'undefined') {
        ganttElastic[prop] = { ...ganttElastic[prop], ...cfg[prop] };
        continue;
      }
      ganttElastic[prop] = cfg[prop];
    }

    const app = createApp(ganttElastic);
    const instance = app.mount(cfg.el);
    return instance;

  }
};
export default GanttElasticStandalone;
