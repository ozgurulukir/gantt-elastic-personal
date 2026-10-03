/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 745
(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(354);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `
.gantt-elastic {
  /* default font stack so the widget never falls back to the host page's
     body font (Times New Roman on plain pages); a dynamicStyle.fontFamily
     wins over this through the inline style on the root element */
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
[class^='gantt-elastic'],
[class*=' gantt-elastic'] {
  box-sizing: border-box;
}
.gantt-elastic__main-view svg {
  display: block;
}
.gantt-elastic__grid-horizontal-line,
.gantt-elastic__grid-vertical-line {
  stroke: #a0a0a0;
  stroke-width: 1;
}
foreignObject > * {
  margin: 0px;
}
.gantt-elastic .p-2 {
  padding: 10rem;
}
.gantt-elastic__main-view-main-container,
.gantt-elastic__main-view-container {
  overflow: hidden;
  max-width: 100%;
}
.gantt-elastic__task-list-header-column:last-of-type {
  border-right: 1px solid #00000050;
}
.gantt-elastic__task-list-item:last-of-type {
  border-bottom: 1px solid #00000050;
}
.gantt-elastic__task-list-item-value-wrapper:hover {
  overflow: visible !important;
}
.gantt-elastic__task-list-item-value-wrapper:hover > .gantt-elastic__task-list-item-value-container {
  position: relative;
  overflow: visible !important;
}
.gantt-elastic__task-list-item-value-wrapper:hover > .gantt-elastic__task-list-item-value {
  position: absolute;
}
/* keyboard focus visibility (issue #13) */
.gantt-elastic__chart-row-bar:focus-visible,
.gantt-elastic__task-list-item:focus-visible,
.gantt-elastic__task-list-header-resizer-wrapper:focus-visible,
.gantt-elastic__chart-expander-content:focus-visible,
.gantt-elastic__task-list-expander-content:focus-visible {
  outline: 2px solid #4a90d2;
  outline-offset: 1px;
}
/* respect reduced motion preferences (issue #13) */
@media (prefers-reduced-motion: reduce) {
.gantt-elastic * {
    transition: none !important;
}
}
`, "",{"version":3,"sources":["webpack://./src/GanttElastic.vue"],"names":[],"mappings":";AA+1DA;EACE;;kEAEgE;EAChE,uFAAuF;AACzF;AACA;;EAEE,sBAAsB;AACxB;AACA;EACE,cAAc;AAChB;AACA;;EAEE,eAAe;EACf,eAAe;AACjB;AACA;EACE,WAAW;AACb;AACA;EACE,cAAc;AAChB;AACA;;EAEE,gBAAgB;EAChB,eAAe;AACjB;AACA;EACE,iCAAiC;AACnC;AACA;EACE,kCAAkC;AACpC;AACA;EACE,4BAA4B;AAC9B;AACA;EACE,kBAAkB;EAClB,4BAA4B;AAC9B;AACA;EACE,kBAAkB;AACpB;AACA,0CAA0C;AAC1C;;;;;EAKE,0BAA0B;EAC1B,mBAAmB;AACrB;AACA,mDAAmD;AACnD;AACE;IACE,2BAA2B;AAC7B;AACF","sourcesContent":["<!--\r\n/**\r\n * @fileoverview GanttElastic component\r\n * @license MIT\r\n * @author Rafal Pospiech <neuronet.io@gmail.com>\r\n * @package GanttElastic\r\n */\r\n-->\r\n<template>\r\n  <div class=\"gantt-elastic\" style=\"width:100%\" :style=\"{ fontFamily: state.dynamicStyle.fontFamily }\">\r\n    <slot name=\"header\">\r\n      <!-- default header when the consumer does not provide one (Vue 3 port: the old\r\n           external gantt-elastic-header UMD is Vue 2 only, so the local Header ships in) -->\r\n      <gantt-header></gantt-header>\r\n    </slot>\r\n    <main-view ref=\"mainView\"></main-view>\r\n    <slot name=\"footer\"></slot>\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nimport VueInstance from 'vue';\r\nimport dayjs from 'dayjs';\r\nimport mitt from 'mitt';\r\nimport MainView from './components/MainView.vue';\r\nimport Header from './components/Header.vue';\r\nimport getStyle from './style.js';\r\n\r\nconst ctx = document.createElement('canvas').getContext('2d');\r\n\r\n/**\r\n * Native ResizeObserver with a window-resize fallback for environments that\r\n * predate it - the resize-observer-polyfill dependency was dropped (issue #14)\r\n */\r\nclass ResizeObserverFallback {\r\n  constructor(callback) {\r\n    this.callback = callback;\r\n    this.windowListener = () => this.callback([], this);\r\n  }\r\n  observe() {\r\n    window.addEventListener('resize', this.windowListener);\r\n  }\r\n  unobserve() {\r\n    window.removeEventListener('resize', this.windowListener);\r\n  }\r\n  disconnect() {\r\n    this.unobserve();\r\n  }\r\n}\r\nconst ResizeObserverImpl =\r\n  typeof window !== 'undefined' && typeof window.ResizeObserver !== 'undefined'\r\n    ? window.ResizeObserver\r\n    : ResizeObserverFallback;\r\nlet VueInst = VueInstance;\r\nfunction initVue() {\r\n  if (typeof Vue !== 'undefined' && typeof VueInst === 'undefined') {\r\n    VueInst = Vue;\r\n  }\r\n}\r\ninitVue();\r\n\r\nlet hourWidthCache = null;\r\n\r\n/**\r\n * Helper function to fill out empty options in user settings\r\n *\r\n * @param {object} userOptions - initial user options that will merge with those below\r\n * @returns {object} merged options\r\n */\r\nfunction getOptions(userOptions) {\r\n  let localeName = 'en';\r\n  if (typeof userOptions.locale !== 'undefined' && typeof userOptions.locale.name !== 'undefined') {\r\n    localeName = userOptions.locale.name;\r\n  }\r\n  return {\r\n    slots: {\r\n      header: {}\r\n    },\r\n    taskMapping: {\r\n      //*\r\n      id: 'id',\r\n      start: 'start',\r\n      label: 'label',\r\n      duration: 'duration',\r\n      progress: 'progress',\r\n      type: 'type',\r\n      style: 'style',\r\n      collapsed: 'collapsed'\r\n    },\r\n    width: 0,\r\n    height: 0,\r\n    clientWidth: 0,\r\n    outerHeight: 0,\r\n    rowsHeight: 0,\r\n    allVisibleTasksHeight: 0,\r\n    scroll: {\r\n      scrolling: false,\r\n      dragXMoveMultiplier: 3, //*\r\n      dragYMoveMultiplier: 2, //*\r\n      top: 0,\r\n      taskList: {\r\n        left: 0,\r\n        right: 0,\r\n        top: 0,\r\n        bottom: 0\r\n      },\r\n      chart: {\r\n        left: 0,\r\n        right: 0,\r\n        percent: 0,\r\n        timePercent: 0,\r\n        top: 0,\r\n        bottom: 0,\r\n        time: 0,\r\n        timeCenter: 0,\r\n        dateTime: {\r\n          left: '',\r\n          right: ''\r\n        }\r\n      }\r\n    },\r\n    scope: {\r\n      //*\r\n      before: 1,\r\n      after: 1\r\n    },\r\n    times: {\r\n      timeScale: 60 * 1000,\r\n      timeZoom: 17, //*\r\n      timePerPixel: 0,\r\n      firstTime: null,\r\n      lastTime: null,\r\n      firstTaskTime: 0,\r\n      lastTaskTime: 0,\r\n      totalViewDurationMs: 0,\r\n      totalViewDurationPx: 0,\r\n      stepDuration: 'day',\r\n      steps: []\r\n    },\r\n    row: {\r\n      height: 24 //*\r\n    },\r\n    maxRows: 20, //*\r\n    maxHeight: 0, //*\r\n    taskSelection: {\r\n      display: true //*\r\n    },\r\n    chart: {\r\n      grid: {\r\n        horizontal: {\r\n          gap: 6 //*\r\n        }\r\n      },\r\n      progress: {\r\n        width: 20, //*\r\n        height: 6, //*\r\n        pattern: true,\r\n        bar: false\r\n      },\r\n      text: {\r\n        offset: 4, //*\r\n        xPadding: 10, //*\r\n        display: true //*\r\n      },\r\n      expander: {\r\n        type: 'chart',\r\n        display: false, //*\r\n        displayIfTaskListHidden: true, //*\r\n        offset: 4, //*\r\n        size: 18\r\n      },\r\n      tooltip: {\r\n        display: true, //*\r\n        format: null //* custom format(task) returning the tooltip text\r\n      },\r\n      currentTimeLine: {\r\n        display: true, //*\r\n        color: '', //* optional stroke color override\r\n        strokeWidth: 0, //* optional stroke width override\r\n        updateInterval: 60000 //* ms between \"now\" refreshes\r\n      }\r\n    },\r\n    taskList: {\r\n      display: true, //*\r\n      resizeAfterThreshold: true, //*\r\n      widthThreshold: 75, //*\r\n      columns: [\r\n        //*\r\n        {\r\n          id: 0,\r\n          label: 'ID',\r\n          value: 'id',\r\n          width: 40\r\n        }\r\n      ],\r\n      percent: 100, //*\r\n      width: 0,\r\n      finalWidth: 0,\r\n      widthFromPercentage: 0,\r\n      minWidth: 18,\r\n      persistColumnWidths: false, //* persist runtime column widths to localStorage\r\n      persistKey: 'default', //* storage key suffix when persistColumnWidths is on\r\n      expander: {\r\n        type: 'task-list',\r\n        size: 16,\r\n        columnWidth: 24,\r\n        padding: 16,\r\n        margin: 10,\r\n        straight: false\r\n      }\r\n    },\r\n    calendar: {\r\n      workingDays: [1, 2, 3, 4, 5], //*\r\n      gap: 6, //*\r\n      height: 0,\r\n      strokeWidth: 1,\r\n      hour: {\r\n        height: 20, //*\r\n        display: true, //*\r\n        widths: [],\r\n        maxWidths: { short: 0, medium: 0, long: 0 },\r\n        formatted: {\r\n          long: [],\r\n          medium: [],\r\n          short: []\r\n        },\r\n        format: {\r\n          //*\r\n          long(date) {\r\n            return date.format('HH:mm');\r\n          },\r\n          medium(date) {\r\n            return date.format('HH:mm');\r\n          },\r\n          short(date) {\r\n            return date.format('HH');\r\n          }\r\n        }\r\n      },\r\n      day: {\r\n        height: 20, //*\r\n        display: true, //*\r\n        widths: [],\r\n        maxWidths: { short: 0, medium: 0, long: 0 },\r\n        format: {\r\n          long(date) {\r\n            return date.format('DD dddd');\r\n          },\r\n          medium(date) {\r\n            return date.format('DD ddd');\r\n          },\r\n          short(date) {\r\n            return date.format('DD');\r\n          }\r\n        }\r\n      },\r\n      month: {\r\n        height: 20, //*\r\n        display: true, //*\r\n        widths: [],\r\n        maxWidths: { short: 0, medium: 0, long: 0 },\r\n        format: {\r\n          //*\r\n          short(date) {\r\n            return date.format('MM');\r\n          },\r\n          medium(date) {\r\n            return date.format(\"MMM 'YY\");\r\n          },\r\n          long(date) {\r\n            return date.format('MMMM YYYY');\r\n          }\r\n        }\r\n      }\r\n    },\r\n    locale: {\r\n      //*\r\n      name: 'en',\r\n      weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),\r\n      weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),\r\n      weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),\r\n      months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),\r\n      monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),\r\n      weekStart: 1,\r\n      relativeTime: {\r\n        future: 'in %s',\r\n        past: '%s ago',\r\n        s: 'a few seconds',\r\n        m: 'a minute',\r\n        mm: '%d minutes',\r\n        h: 'an hour',\r\n        hh: '%d hours',\r\n        d: 'a day',\r\n        dd: '%d days',\r\n        M: 'a month',\r\n        MM: '%d months',\r\n        y: 'a year',\r\n        yy: '%d years'\r\n      },\r\n      formats: {\r\n        LT: 'HH:mm',\r\n        LTS: 'HH:mm:ss',\r\n        L: 'DD/MM/YYYY',\r\n        LL: 'D MMMM YYYY',\r\n        LLL: 'D MMMM YYYY HH:mm',\r\n        LLLL: 'dddd, D MMMM YYYY HH:mm'\r\n      },\r\n      ordinal: n => {\r\n        const s = ['th', 'st', 'nd', 'rd'];\r\n        const v = n % 100;\r\n        return `[${n}${s[(v - 20) % 10] || s[v] || s[0]}]`;\r\n      }\r\n    }\r\n  };\r\n}\r\n\r\n/**\r\n * Prepare style\r\n *\r\n * @returns {object}\r\n */\r\nfunction prepareStyle(userStyle) {\r\n  let fontSize = '12px';\r\n  let fontFamily; // getStyle() supplies the default system stack, no body inheritance\r\n  if (typeof userStyle !== 'undefined') {\r\n    if (typeof userStyle.fontSize !== 'undefined') {\r\n      fontSize = userStyle.fontSize;\r\n    }\r\n    if (typeof userStyle.fontFamily !== 'undefined') {\r\n      fontFamily = userStyle.fontFamily;\r\n    }\r\n  }\r\n  return getStyle(fontSize, fontFamily);\r\n}\r\n\r\n/**\r\n * Helper function to determine if specified variable is an object\r\n *\r\n * @param {any} item\r\n *\r\n * @returns {boolean}\r\n */\r\nfunction isObject(item) {\r\n  return (\r\n    item &&\r\n    typeof item === 'object' &&\r\n    !Array.isArray(item) &&\r\n    !(item instanceof HTMLElement) &&\r\n    !(item instanceof CanvasRenderingContext2D) &&\r\n    typeof item !== 'function'\r\n  );\r\n}\r\n\r\n/**\r\n * Helper function which will merge objects recursively - creating brand new one - like clone\r\n *\r\n * @param {object} target\r\n * @params {object} sources\r\n *\r\n * @returns {object}\r\n */\r\nexport function mergeDeep(target, ...sources) {\r\n  if (!sources.length) {\r\n    return target;\r\n  }\r\n  const source = sources.shift();\r\n  if (isObject(target) && isObject(source)) {\r\n    for (const key in source) {\r\n      if (isObject(source[key])) {\r\n        if (typeof target[key] === 'undefined') {\r\n          target[key] = {};\r\n        }\r\n        target[key] = mergeDeep(target[key], source[key]);\r\n      } else if (Array.isArray(source[key])) {\r\n        target[key] = [];\r\n        for (let item of source[key]) {\r\n          if (isObject(item)) {\r\n            target[key].push(mergeDeep({}, item));\r\n            continue;\r\n          }\r\n          target[key].push(item);\r\n        }\r\n      } else {\r\n        target[key] = source[key];\r\n      }\r\n    }\r\n  }\r\n  return mergeDeep(target, ...sources);\r\n}\r\n\r\n/**\r\n * Detect if object or array is observable\r\n *\r\n * @param {object|array} obj\r\n *\r\n * @returns {boolean}\r\n */\r\nfunction isObservable(obj) {\r\n  return typeof obj === 'object' && obj.hasOwnProperty('__ob__');\r\n}\r\n\r\n/**\r\n * Same as above but with reactivity in mind\r\n *\r\n * @param {object} target\r\n * @params {object} sources\r\n *\r\n * @returns {object}\r\n */\r\nexport function mergeDeepReactive(component, target, ...sources) {\r\n  if (!sources.length) {\r\n    return target;\r\n  }\r\n  const source = sources.shift();\r\n  if (isObject(target) && isObject(source)) {\r\n    for (const key in source) {\r\n      if (isObject(source[key])) {\r\n        if (typeof target[key] === 'undefined') {\r\n          component.$set(target, key, {});\r\n        }\r\n        mergeDeepReactive(component, target[key], source[key]);\r\n      } else if (Array.isArray(source[key])) {\r\n        component.$set(target, key, source[key]);\r\n      } else if (typeof source[key] === 'function') {\r\n        if (source[key].toString().indexOf('[native code]') === -1) {\r\n          target[key] = source[key];\r\n        }\r\n      } else {\r\n        component.$set(target, key, source[key]);\r\n      }\r\n    }\r\n  }\r\n  return mergeDeepReactive(component, target, ...sources);\r\n}\r\n/**\r\n * Check if objects or arrays are equal by comparing nested values\r\n *\r\n * @param {object|array} left\r\n * @param {object|array} right\r\n *\r\n * @returns {boolean}\r\n */\r\nexport function notEqualDeep(left, right, cache = [], path = '') {\r\n  if (typeof right !== typeof left) {\r\n    return { left, right, what: path + '.typeof' };\r\n  } else if (Array.isArray(left) && !Array.isArray(right)) {\r\n    return { left, right, what: path + '.isArray' };\r\n  } else if (Array.isArray(right) && !Array.isArray(left)) {\r\n    return { left, right, what: path + '.isArray' };\r\n  } else if (Array.isArray(left) && Array.isArray(right)) {\r\n    if (left.length !== right.length) {\r\n      return { left, right, what: path + '.length' };\r\n    }\r\n    let what;\r\n    for (let index = 0, len = left.length; index < len; index++) {\r\n      if ((what = notEqualDeep(left[index], right[index], cache, path + '.' + index))) {\r\n        return what;\r\n      }\r\n    }\r\n  } else if (isObject(left) && !isObject(right)) {\r\n    return { left, right, what: path + '.isObject' };\r\n  } else if (isObject(right) && !isObject(left)) {\r\n    return { left, right, what: path + '.isObject' };\r\n  } else if (isObject(left) && isObject(right)) {\r\n    for (let key in left) {\r\n      if (!left.hasOwnProperty(key) || !left.propertyIsEnumerable(key)) {\r\n        continue;\r\n      }\r\n      if (!right.hasOwnProperty(key)) {\r\n        return { left, right, what: path + '.' + key };\r\n      }\r\n      let what;\r\n      if ((what = notEqualDeep(left[key], right[key], cache, path + '.' + key))) {\r\n        return what;\r\n      }\r\n    }\r\n  } else if (left !== right) {\r\n    return { left, right, what: path + '. !==' };\r\n  }\r\n  return false;\r\n}\r\n\r\n/**\r\n * GanttElastic\r\n * Main vue component\r\n */\r\nconst GanttElastic = {\r\n  name: 'GanttElastic',\r\n  components: {\r\n    MainView,\r\n    GanttHeader: Header\r\n  },\r\n  props: ['tasks', 'options', 'dynamicStyle'],\r\n  provide() {\r\n    const provider = {};\r\n    const self = this;\r\n    Object.defineProperty(provider, 'root', {\r\n      enumerable: true,\r\n      get: () => self\r\n    });\r\n    return provider;\r\n  },\r\n  data() {\r\n    return {\r\n      state: {\r\n        tasks: [],\r\n        options: {\r\n          scrollBarHeight: 0,\r\n          allVisibleTasksHeight: 0,\r\n          outerHeight: 0,\r\n          scroll: {\r\n            left: 0,\r\n            top: 0\r\n          }\r\n        },\r\n        dynamicStyle: {},\r\n        selectedTaskId: null,\r\n        hoveredTaskId: null,\r\n        now: Date.now(),\r\n        nowTimer: null,\r\n        refs: {},\r\n        tasksById: {},\r\n        taskTree: {},\r\n        ctx,\r\n        emitTasksChanges: true, // some operations may pause emitting changes to parent component\r\n        emitOptionsChanges: true, // some operations may pause emitting changes to parent component\r\n        resizeObserver: null,\r\n        unwatchTasks: null,\r\n        unwatchOptions: null,\r\n        unwatchStyle: null,\r\n        unwatchVisibleTasksGeometry: null,\r\n        initialized: false,\r\n        unwatchOutputTasks: null,\r\n        unwatchOutputOptions: null,\r\n        unwatchOutputStyle: null\r\n      }\r\n    };\r\n  },\r\n  methods: {\r\n    mergeDeep,\r\n    mergeDeepReactive,\r\n\r\n    /**\r\n     * Calculate height of scrollbar in current browser\r\n     *\r\n     * @returns {number}\r\n     */\r\n    getScrollBarHeight() {\r\n      const outer = document.createElement('div');\r\n      outer.style.visibility = 'hidden';\r\n      outer.style.height = '100px';\r\n      outer.style.msOverflowStyle = 'scrollbar';\r\n      document.body.appendChild(outer);\r\n      var noScroll = outer.offsetHeight;\r\n      outer.style.overflow = 'scroll';\r\n      var inner = document.createElement('div');\r\n      inner.style.height = '100%';\r\n      outer.appendChild(inner);\r\n      var withScroll = inner.offsetHeight;\r\n      outer.parentNode.removeChild(outer);\r\n      const height = noScroll - withScroll;\r\n      this.style['chart-scroll-container--vertical']['margin-left'] = `-${height}px`;\r\n      return (this.state.options.scrollBarHeight = height);\r\n    },\r\n\r\n    /**\r\n     * Fill out empty task properties and make it reactive\r\n     *\r\n     * @param {array} tasks\r\n     */\r\n    fillTasks(tasks) {\r\n      for (let task of tasks) {\r\n        if (typeof task.x === 'undefined') {\r\n          task.x = 0;\r\n        }\r\n        if (typeof task.y === 'undefined') {\r\n          task.y = 0;\r\n        }\r\n        if (typeof task.width === 'undefined') {\r\n          task.width = 0;\r\n        }\r\n        if (typeof task.height === 'undefined') {\r\n          task.height = 0;\r\n        }\r\n        if (typeof task.mouseOver === 'undefined') {\r\n          task.mouseOver = false;\r\n        }\r\n        if (typeof task.collapsed === 'undefined') {\r\n          task.collapsed = false;\r\n        }\r\n        if (typeof task.dependentOn === 'undefined') {\r\n          task.dependentOn = [];\r\n        }\r\n        if (typeof task.parentId === 'undefined') {\r\n          task.parentId = null;\r\n        }\r\n        if (typeof task.style === 'undefined') {\r\n          task.style = {};\r\n        }\r\n        if (typeof task.children === 'undefined') {\r\n          task.children = [];\r\n        }\r\n        if (typeof task.allChildren === 'undefined') {\r\n          task.allChildren = [];\r\n        }\r\n        if (typeof task.parents === 'undefined') {\r\n          task.parents = [];\r\n        }\r\n        if (typeof task.parent === 'undefined') {\r\n          task.parent = null;\r\n        }\r\n        if (typeof task.startTime === 'undefined') {\r\n          task.startTime = dayjs(task.start).valueOf();\r\n        }\r\n        if (typeof task.endTime === 'undefined' && task.hasOwnProperty('end')) {\r\n          task.endTime = dayjs(task.end).valueOf();\r\n        } else if (typeof task.endTime === 'undefined' && task.hasOwnProperty('duration')) {\r\n          task.endTime = task.startTime + task.duration;\r\n        }\r\n        if (typeof task.duration === 'undefined' && task.hasOwnProperty('endTime')) {\r\n          task.duration = task.endTime - task.startTime;\r\n        }\r\n        // a task with neither end nor duration would produce NaN geometry\r\n        // (width, prepareDates' lastTaskTime) further down the pipeline\r\n        if (typeof task.duration === 'undefined') {\r\n          task.duration = 0;\r\n        }\r\n      }\r\n      return tasks;\r\n    },\r\n\r\n    /**\r\n     * Map tasks\r\n     *\r\n     * @param {Array} tasks\r\n     * @param {Object} options\r\n     */\r\n    mapTasks(tasks, options) {\r\n      // do not mutate the reactive props array - replacing its entries\r\n      // would re-trigger the deep tasks watcher on every setup (infinite loop in Vue 3)\r\n      return tasks.map(task => ({\r\n        ...task,\r\n        id: task[options.taskMapping.id],\r\n        start: task[options.taskMapping.start],\r\n        label: task[options.taskMapping.label],\r\n        duration: task[options.taskMapping.duration],\r\n        progress: task[options.taskMapping.progress],\r\n        type: task[options.taskMapping.type],\r\n        style: task[options.taskMapping.style],\r\n        collapsed: task[options.taskMapping.collapsed]\r\n      }));\r\n    },\r\n\r\n    /**\r\n     * Initialize component\r\n     */\r\n    initialize(itsUpdate = '') {\r\n      // on re-initialization (tasks/options prop changed at runtime) user-modified\r\n      // runtime values must survive: collapsed flags toggled via the expander and\r\n      // times.timeZoom changed through the header slider or directly on state\r\n      const reinit = this.state.initialized === true;\r\n      const prevTasksById = reinit ? this.state.tasksById : null;\r\n      let options = mergeDeep({}, this.state.options, getOptions(this.options), this.options);\r\n      if (reinit && typeof this.options.times === 'undefined') {\r\n        options.times.timeZoom = this.state.options.times.timeZoom;\r\n      }\r\n      let tasks = this.mapTasks(this.tasks, options);\r\n      if (Object.keys(this.state.dynamicStyle).length === 0) {\r\n        this.initializeStyle();\r\n      }\r\n      dayjs.locale(options.locale, null, true);\r\n      dayjs.locale(options.locale.name);\r\n      if (typeof options.taskList === 'undefined') {\r\n        options.taskList = {};\r\n      }\r\n      options.taskList.columns = options.taskList.columns.map((column, index) => {\r\n        column.thresholdPercent = 100;\r\n        column.widthFromPercentage = 0;\r\n        column.finalWidth = 0;\r\n        if (typeof column.height === 'undefined') {\r\n          column.height = 0;\r\n        }\r\n        if (typeof column.style === 'undefined') {\r\n          column.style = {};\r\n        }\r\n        column._id = `${index}-${column.label}`;\r\n        // width as configured by the user options - double-click on the column\r\n        // resizer resets to this (issue #11)\r\n        column._initialWidth = column.width;\r\n        return column;\r\n      });\r\n      this.state.options = options;\r\n      tasks = this.fillTasks(tasks);\r\n      if (reinit && prevTasksById) {\r\n        for (let task of tasks) {\r\n          const prev = prevTasksById[task.id];\r\n          if (prev && typeof prev.collapsed !== 'undefined') {\r\n            task.collapsed = prev.collapsed;\r\n          }\r\n        }\r\n      }\r\n      this.state.tasksById = this.resetTaskTree(tasks);\r\n      this.state.taskTree = this.makeTaskTree(this.state.rootTask, tasks);\r\n      this.state.tasks = this.state.taskTree.allChildren.map(childId => this.getTask(childId));\r\n      this.calculateTaskListColumnsDimensions();\r\n      this.state.options.scrollBarHeight = this.getScrollBarHeight();\r\n      this.state.options.outerHeight = this.state.options.height + this.state.options.scrollBarHeight;\r\n      this.state.initialized = true;\r\n      this.globalOnResize();\r\n    },\r\n\r\n    /**\r\n     * Initialize style\r\n     */\r\n    initializeStyle() {\r\n      this.state.dynamicStyle = mergeDeep({}, prepareStyle(this.dynamicStyle), this.dynamicStyle);\r\n    },\r\n\r\n    /**\r\n     * Get calendar rows outer height\r\n     *\r\n     * @returns {int}\r\n     */\r\n    getCalendarHeight() {\r\n      return this.state.options.calendar.height + this.state.options.calendar.strokeWidth;\r\n    },\r\n\r\n    /**\r\n     * Get maximal level of nested task children\r\n     *\r\n     * @returns {int}\r\n     */\r\n    getMaximalLevel() {\r\n      let maximalLevel = 0;\r\n      this.state.tasks.forEach(task => {\r\n        if (task.parents.length > maximalLevel) {\r\n          maximalLevel = task.parents.length;\r\n        }\r\n      });\r\n      return maximalLevel - 1;\r\n    },\r\n\r\n    /**\r\n     * Get maximal expander width - to calculate straight task list text\r\n     *\r\n     * @returns {int}\r\n     */\r\n    getMaximalExpanderWidth() {\r\n      return (\r\n        this.getMaximalLevel() * this.state.options.taskList.expander.padding +\r\n        this.state.options.taskList.expander.margin\r\n      );\r\n    },\r\n\r\n    /**\r\n     * Synchronize scrollTop property when row height is changed\r\n     */\r\n    syncScrollTop() {\r\n      if (\r\n        this.state.refs.taskListItems &&\r\n        this.state.refs.chartGraph.scrollTop !== this.state.refs.taskListItems.scrollTop\r\n      ) {\r\n        this.state.options.scroll.top = this.state.refs.taskListItems.scrollTop = this.state.refs.chartScrollContainerVertical.scrollTop = this.state.refs.chartGraph.scrollTop;\r\n      }\r\n    },\r\n\r\n    /**\r\n     * Calculate task list columns dimensions\r\n     */\r\n    calculateTaskListColumnsDimensions() {\r\n      let final = 0;\r\n      let percentage = 0;\r\n      for (let column of this.state.options.taskList.columns) {\r\n        if (column.expander) {\r\n          column.widthFromPercentage =\r\n            ((this.getMaximalExpanderWidth() + column.width) / 100) * this.state.options.taskList.percent;\r\n        } else {\r\n          column.widthFromPercentage = (column.width / 100) * this.state.options.taskList.percent;\r\n        }\r\n        percentage += column.widthFromPercentage;\r\n        column.finalWidth = (column.thresholdPercent * column.widthFromPercentage) / 100;\r\n        final += column.finalWidth;\r\n        column.height = this.getTaskHeight() - this.style['grid-line-horizontal']['stroke-width'];\r\n      }\r\n      this.state.options.taskList.widthFromPercentage = percentage;\r\n      this.state.options.taskList.finalWidth = final;\r\n    },\r\n\r\n    /**\r\n     * Reset task tree - which is used to create tree like structure inside task list\r\n     */\r\n    resetTaskTree(tasks) {\r\n      this.$set(this.state, 'rootTask', {\r\n        id: null,\r\n        label: 'root',\r\n        children: [],\r\n        allChildren: [],\r\n        parents: [],\r\n        parent: null,\r\n        __root: true\r\n      });\r\n      const tasksById = {};\r\n      for (let i = 0, len = tasks.length; i < len; i++) {\r\n        let current = tasks[i];\r\n        current.children = [];\r\n        current.allChildren = [];\r\n        current.parent = null;\r\n        current.parents = [];\r\n        tasksById[current.id] = current;\r\n      }\r\n      return tasksById;\r\n    },\r\n\r\n    /**\r\n     * Make task tree, after reset - look above\r\n     *\r\n     * @param {object} task\r\n     * @returns {object} tasks with children and parents\r\n     */\r\n    makeTaskTree(task, tasks) {\r\n      for (let i = 0, len = tasks.length; i < len; i++) {\r\n        let current = tasks[i];\r\n        if (current.parentId === task.id) {\r\n          if (task.parents.length) {\r\n            task.parents.forEach(parent => current.parents.push(parent));\r\n          }\r\n          if (!task.propertyIsEnumerable('__root')) {\r\n            current.parents.push(task.id);\r\n            current.parent = task.id;\r\n          } else {\r\n            current.parents = [];\r\n            current.parent = null;\r\n          }\r\n          current = this.makeTaskTree(current, tasks);\r\n          task.allChildren.push(current.id);\r\n          task.children.push(current.id);\r\n          current.allChildren.forEach(childId => task.allChildren.push(childId));\r\n        }\r\n      }\r\n      return task;\r\n    },\r\n\r\n    /**\r\n     * Get task by id\r\n     *\r\n     * @param {any} taskId\r\n     * @returns {object|null} task\r\n     */\r\n    getTask(taskId) {\r\n      if (typeof this.state.tasksById[taskId] !== 'undefined') {\r\n        return this.state.tasksById[taskId];\r\n      }\r\n      return null;\r\n    },\r\n\r\n    /**\r\n     * Get children tasks for specified taskId\r\n     *\r\n     * @param {any} taskId\r\n     * @returns {array} children\r\n     */\r\n    getChildren(taskId) {\r\n      return this.state.tasks.filter(task => task.parent === taskId);\r\n    },\r\n\r\n    /**\r\n     * Is task visible\r\n     *\r\n     * @param {Number|String|Task} task\r\n     */\r\n    isTaskVisible(task) {\r\n      if (typeof task === 'number' || typeof task === 'string') {\r\n        task = this.getTask(task);\r\n      }\r\n      for (let i = 0, len = task.parents.length; i < len; i++) {\r\n        if (this.getTask(task.parents[i]).collapsed) {\r\n          return false;\r\n        }\r\n      }\r\n      return true;\r\n    },\r\n\r\n    /**\r\n     * Get svg\r\n     *\r\n     * @returns {string} html svg image of gantt\r\n     */\r\n    getSVG() {\r\n      return this.state.options.mainView.outerHTML;\r\n    },\r\n\r\n    /**\r\n     * Get image\r\n     *\r\n     * @param {string} type image format\r\n     * @returns {Promise} when resolved returns base64 image string of gantt\r\n     */\r\n    getImage(type = 'image/png') {\r\n      return new Promise(resolve => {\r\n        const img = new Image();\r\n        img.onload = () => {\r\n          const canvas = document.createElement('canvas');\r\n          canvas.width = this.state.options.mainView.clientWidth;\r\n          canvas.height = this.state.options.rowsHeight;\r\n          canvas.getContext('2d').drawImage(img, 0, 0);\r\n          resolve(canvas.toDataURL(type));\r\n        };\r\n        img.src = 'data:image/svg+xml,' + encodeURIComponent(this.getSVG());\r\n      });\r\n    },\r\n\r\n    /**\r\n     * Get gantt total height\r\n     *\r\n     * @returns {number}\r\n     */\r\n    getHeight(visibleTasks, outer = false) {\r\n      let height =\r\n        visibleTasks.length * (this.state.options.row.height + this.state.options.chart.grid.horizontal.gap * 2) +\r\n        this.state.options.calendar.height +\r\n        this.state.options.calendar.strokeWidth +\r\n        this.state.options.calendar.gap;\r\n      if (outer) {\r\n        height += this.state.options.scrollBarHeight;\r\n      }\r\n      return height;\r\n    },\r\n\r\n    /**\r\n     * Get one task height\r\n     *\r\n     * @returns {number}\r\n     */\r\n    getTaskHeight(withStroke = false) {\r\n      if (withStroke) {\r\n        return (\r\n          this.state.options.row.height +\r\n          this.state.options.chart.grid.horizontal.gap * 2 +\r\n          this.style['grid-line-horizontal']['stroke-width']\r\n        );\r\n      }\r\n      return this.state.options.row.height + this.state.options.chart.grid.horizontal.gap * 2;\r\n    },\r\n\r\n    /**\r\n     * Get specified tasks height\r\n     *\r\n     * @returns {number}\r\n     */\r\n    getTasksHeight(visibleTasks) {\r\n      return visibleTasks.length * this.getTaskHeight();\r\n    },\r\n\r\n    /**\r\n     * Convert time (in milliseconds) to pixel offset inside chart\r\n     *\r\n     * @param {int} ms\r\n     * @returns {number}\r\n     */\r\n    timeToPixelOffsetX(ms) {\r\n      let x = ms - this.state.options.times.firstTime;\r\n      if (!x) {\r\n        return 0;\r\n      }\r\n      // timePerPixel is 0 until recalculateTimes() runs - never divide into Infinity\r\n      return this.state.options.times.timePerPixel > 0 ? x / this.state.options.times.timePerPixel : 0;\r\n    },\r\n\r\n    /**\r\n     * Convert pixel offset inside chart to corresponding time offset in milliseconds\r\n     *\r\n     * @param {number} pixelOffsetX\r\n     * @returns {int} milliseconds\r\n     */\r\n    pixelOffsetXToTime(pixelOffsetX) {\r\n      let offset = pixelOffsetX + this.style['grid-line-vertical']['stroke-width'] / 2;\r\n      return offset * this.state.options.times.timePerPixel + this.state.options.times.firstTime;\r\n    },\r\n\r\n    /**\r\n     * Determine if element is inside current view port\r\n     *\r\n     * @param {number} x - element placement\r\n     * @param {number} width - element width\r\n     * @param {int} buffer - or threshold, if element is outside viewport but offset from view port is below this value return true\r\n     * @returns {boolean}\r\n     */\r\n    isInsideViewPort(x, width, buffer = 5000) {\r\n      return (\r\n        (x + width + buffer >= this.state.options.scroll.chart.left &&\r\n          x - buffer <= this.state.options.scroll.chart.right) ||\r\n        (x - buffer <= this.state.options.scroll.chart.left &&\r\n          x + width + buffer >= this.state.options.scroll.chart.right)\r\n      );\r\n    },\r\n\r\n    /**\r\n     * Chart scroll event handler\r\n     *\r\n     * @param {event} ev\r\n     */\r\n    onScrollChart(ev) {\r\n      this._onScrollChart(\r\n        this.state.refs.chartScrollContainerHorizontal.scrollLeft,\r\n        this.state.refs.chartScrollContainerVertical.scrollTop\r\n      );\r\n    },\r\n\r\n    /**\r\n     * After same as above but with different arguments - normalized\r\n     *\r\n     * @param {number} left\r\n     * @param {number} top\r\n     */\r\n    _onScrollChart(left, top) {\r\n      if (this.state.options.scroll.chart.left === left && this.state.options.scroll.chart.top === top) {\r\n        return;\r\n      }\r\n      const chartContainerWidth = this.state.refs.chartContainer.clientWidth;\r\n      this.state.options.scroll.chart.left = left;\r\n      this.state.options.scroll.chart.right = left + chartContainerWidth;\r\n      this.state.options.scroll.chart.percent = (left / this.state.options.times.totalViewDurationPx) * 100;\r\n      this.state.options.scroll.chart.top = top;\r\n      this.state.options.scroll.chart.time = this.pixelOffsetXToTime(left);\r\n      this.state.options.scroll.chart.timeCenter = this.pixelOffsetXToTime(left + chartContainerWidth / 2);\r\n      this.state.options.scroll.chart.dateTime.left = dayjs(this.state.options.scroll.chart.time).valueOf();\r\n      this.state.options.scroll.chart.dateTime.right = dayjs(\r\n        this.pixelOffsetXToTime(left + this.state.refs.chart.clientWidth)\r\n      ).valueOf();\r\n      this.scrollTo(left, top);\r\n    },\r\n\r\n    /**\r\n     * Scroll current chart to specified time (in milliseconds)\r\n     *\r\n     * @param {int} time\r\n     */\r\n    scrollToTime(time) {\r\n      let pos = this.timeToPixelOffsetX(time);\r\n      const chartContainerWidth = this.state.refs.chartContainer.clientWidth;\r\n      pos = pos - chartContainerWidth / 2;\r\n      if (pos > this.state.options.width) {\r\n        pos = this.state.options.width - chartContainerWidth;\r\n      }\r\n      this.scrollTo(pos);\r\n    },\r\n\r\n    /**\r\n     * Scroll chart or task list to specified pixel values\r\n     *\r\n     * @param {number|null} left\r\n     * @param {number|null} top\r\n     */\r\n    scrollTo(left = null, top = null) {\r\n      if (left !== null) {\r\n        this.state.refs.chartCalendarContainer.scrollLeft = left;\r\n        this.state.refs.chartGraphContainer.scrollLeft = left;\r\n        this.state.refs.chartScrollContainerHorizontal.scrollLeft = left;\r\n        this.state.options.scroll.left = left;\r\n      }\r\n      if (top !== null) {\r\n        this.state.refs.chartScrollContainerVertical.scrollTop = top;\r\n        this.state.refs.chartGraph.scrollTop = top;\r\n        this.state.refs.taskListItems.scrollTop = top;\r\n        this.state.options.scroll.top = top;\r\n        this.syncScrollTop();\r\n      }\r\n    },\r\n\r\n    /**\r\n     * After some actions like time zoom change we need to recompensate scroll position\r\n     * so as a result everything will be in same place\r\n     */\r\n    fixScrollPos() {\r\n      this.scrollToTime(this.state.options.scroll.chart.timeCenter);\r\n    },\r\n\r\n    /**\r\n     * Mouse wheel event handler\r\n     */\r\n    onWheelChart(ev) {\r\n      if (!ev.shiftKey && ev.deltaX === 0) {\r\n        let top = this.state.options.scroll.top + ev.deltaY;\r\n        const chartClientHeight = this.state.options.rowsHeight;\r\n        const scrollHeight = this.state.refs.chartGraph.scrollHeight - chartClientHeight;\r\n        if (top < 0) {\r\n          top = 0;\r\n        } else if (top > scrollHeight) {\r\n          top = scrollHeight;\r\n        }\r\n        this.scrollTo(null, top);\r\n      } else if (ev.shiftKey && ev.deltaX === 0) {\r\n        let left = this.state.options.scroll.left + ev.deltaY;\r\n        const chartClientWidth = this.state.refs.chartScrollContainerHorizontal.clientWidth;\r\n        const scrollWidth = this.state.refs.chartScrollContainerHorizontal.scrollWidth - chartClientWidth;\r\n        if (left < 0) {\r\n          left = 0;\r\n        } else if (left > scrollWidth) {\r\n          left = scrollWidth;\r\n        }\r\n        this.scrollTo(left);\r\n      } else {\r\n        let left = this.state.options.scroll.left + ev.deltaX;\r\n        const chartClientWidth = this.state.refs.chartScrollContainerHorizontal.clientWidth;\r\n        const scrollWidth = this.state.refs.chartScrollContainerHorizontal.scrollWidth - chartClientWidth;\r\n        if (left < 0) {\r\n          left = 0;\r\n        } else if (left > scrollWidth) {\r\n          left = scrollWidth;\r\n        }\r\n        this.scrollTo(left);\r\n      }\r\n    },\r\n\r\n    /**\r\n     * Time zoom change event handler\r\n     */\r\n    onTimeZoomChange(timeZoom) {\r\n      this.state.options.times.timeZoom = timeZoom;\r\n      this.recalculateTimes();\r\n      this.calculateSteps();\r\n      this.fixScrollPos();\r\n    },\r\n\r\n    /**\r\n     * Row height change event handler\r\n     */\r\n    onRowHeightChange(height) {\r\n      this.state.options.row.height = height;\r\n      this.calculateTaskListColumnsDimensions();\r\n      this.syncScrollTop();\r\n    },\r\n\r\n    /**\r\n     * Scope change event handler\r\n     */\r\n    onScopeChange(value) {\r\n      this.state.options.scope.before = value;\r\n      this.state.options.scope.after = value;\r\n      this.initTimes();\r\n      this.calculateSteps();\r\n      this.computeCalendarWidths();\r\n      this.fixScrollPos();\r\n    },\r\n\r\n    /**\r\n     * Task list width change event handler\r\n     */\r\n    onTaskListWidthChange(value) {\r\n      this.state.options.taskList.percent = value;\r\n      this.calculateTaskListColumnsDimensions();\r\n      this.fixScrollPos();\r\n    },\r\n\r\n    /**\r\n     * Task list column width change event handler\r\n     */\r\n    onTaskListColumnWidthChange() {\r\n      this.calculateTaskListColumnsDimensions();\r\n      this.fixScrollPos();\r\n    },\r\n\r\n    /**\r\n     * Select a task - highlights its chart bar and task list row\r\n     *\r\n     * @param {any} taskId\r\n     */\r\n    selectTask(taskId) {\r\n      if (this.state.options.taskSelection.display === false || this.getTask(taskId) === null) {\r\n        return;\r\n      }\r\n      this.state.selectedTaskId = taskId;\r\n      this.$emit('task-selected', this.getTask(taskId));\r\n      this.$emitBus.emit('task-selected', this.getTask(taskId));\r\n    },\r\n\r\n    /**\r\n     * Clear the current task selection\r\n     */\r\n    clearSelection() {\r\n      if (this.state.selectedTaskId === null) {\r\n        return;\r\n      }\r\n      this.state.selectedTaskId = null;\r\n      this.$emit('task-selected', null);\r\n      this.$emitBus.emit('task-selected', null);\r\n    },\r\n\r\n    /**\r\n     * Calculate geometry (width, height, x, y) of a single visible task\r\n     * Shared by the visibleTasks watcher and updateTask()\r\n     *\r\n     * @param {object} task\r\n     * @param {number} index row index inside visibleTasks\r\n     */\r\n    calculateTaskGeometry(task, index) {\r\n      task.width =\r\n        task.duration / this.state.options.times.timePerPixel - this.style['grid-line-vertical']['stroke-width'];\r\n      // NaN (missing duration) / Infinity (timePerPixel still 0) must never\r\n      // reach the SVG attributes - issue #2 first-paint regression net\r\n      if (!Number.isFinite(task.width) || task.width < 0) {\r\n        task.width = 0;\r\n      }\r\n      task.height = this.state.options.row.height;\r\n      task.x = this.timeToPixelOffsetX(task.startTime);\r\n      task.y =\r\n        (this.state.options.row.height + this.state.options.chart.grid.horizontal.gap * 2) * index +\r\n        this.state.options.chart.grid.horizontal.gap;\r\n    },\r\n\r\n    /**\r\n     * Update a single task in place - the O(changed) alternative to mutating\r\n     * the tasks prop, which a deep watcher answers with a full rebuild.\r\n     * The patch is applied to the state task only; owners stay current through\r\n     * the tasks-changed event (mirroring onto the props task would fire the\r\n     * props watcher, whose array-order comparison treats any mutation as\r\n     * drift and triggers exactly the rebuild this API avoids).\r\n     * A patch moving the task outside the rendered time window falls back to\r\n     * a full setup() because the chart range itself must be recalculated -\r\n     * in that case the returned task is the freshly rebuilt state task.\r\n     *\r\n     * @param {any} taskId\r\n     * @param {object} patch task fields to change\r\n     * @returns {object|null} the updated state task\r\n     */\r\n    updateTask(taskId, patch) {\r\n      const task = this.getTask(taskId);\r\n      if (task === null || !isObject(patch)) {\r\n        return null;\r\n      }\r\n      Object.assign(task, patch);\r\n      if (\r\n        typeof patch.start !== 'undefined' ||\r\n        typeof patch.end !== 'undefined' ||\r\n        typeof patch.startTime !== 'undefined' ||\r\n        typeof patch.endTime !== 'undefined' ||\r\n        typeof patch.duration !== 'undefined'\r\n      ) {\r\n        const prevStartTime = task.startTime;\r\n        if (typeof patch.start !== 'undefined') {\r\n          task.startTime = dayjs(task.start).valueOf();\r\n        }\r\n        if (typeof patch.end !== 'undefined') {\r\n          task.endTime = dayjs(task.end).valueOf();\r\n        }\r\n        if (typeof patch.startTime !== 'undefined') {\r\n          task.startTime = patch.startTime;\r\n        }\r\n        if (typeof patch.endTime !== 'undefined') {\r\n          task.endTime = patch.endTime;\r\n        }\r\n        if (\r\n          (typeof patch.start !== 'undefined' || typeof patch.startTime !== 'undefined') &&\r\n          typeof patch.end === 'undefined' &&\r\n          typeof patch.endTime === 'undefined' &&\r\n          typeof prevStartTime !== 'undefined' &&\r\n          typeof task.endTime !== 'undefined'\r\n        ) {\r\n          // the start moved without a new end - shift the end to keep the duration\r\n          task.endTime = task.startTime + (task.endTime - prevStartTime);\r\n        }\r\n        if (typeof patch.duration !== 'undefined') {\r\n          task.endTime = task.startTime + task.duration;\r\n        } else if (typeof task.endTime !== 'undefined') {\r\n          task.duration = task.endTime - task.startTime;\r\n        }\r\n        const endTime = typeof task.endTime !== 'undefined' ? task.endTime : task.startTime + task.duration;\r\n        if (task.startTime < this.state.options.times.firstTime || endTime > this.state.options.times.lastTime) {\r\n          this.setup('updateTask');\r\n          return this.getTask(taskId);\r\n        }\r\n      }\r\n      const index = this.visibleTasks.indexOf(task);\r\n      if (index !== -1) {\r\n        this.calculateTaskGeometry(task, index);\r\n      }\r\n      return task;\r\n    },\r\n\r\n    /**\r\n     * (Re)start the \"now\" refresh timer for the current-time line (issue #7).\r\n     * Public so consumers can restart it after changing updateInterval.\r\n     */\r\n    startNowTimer() {\r\n      if (this.state.nowTimer !== null) {\r\n        clearInterval(this.state.nowTimer);\r\n        this.state.nowTimer = null;\r\n      }\r\n      if (this.state.options.chart.currentTimeLine.display !== false) {\r\n        const updateInterval = this.state.options.chart.currentTimeLine.updateInterval || 60000;\r\n        this.state.nowTimer = setInterval(() => {\r\n          this.state.now = Date.now();\r\n        }, updateInterval);\r\n      }\r\n    },\r\n\r\n    /**\r\n     * Listen to specified event names\r\n     */\r\n    initializeEvents() {\r\n      this.$emitBus.on('chart-scroll-horizontal', this.onScrollChart);\r\n      this.$emitBus.on('chart-scroll-vertical', this.onScrollChart);\r\n      this.$emitBus.on('chart-wheel', this.onWheelChart);\r\n      this.$emitBus.on('times-timeZoom-change', this.onTimeZoomChange);\r\n      this.$emitBus.on('row-height-change', this.onRowHeightChange);\r\n      this.$emitBus.on('scope-change', this.onScopeChange);\r\n      this.$emitBus.on('taskList-width-change', this.onTaskListWidthChange);\r\n      this.$emitBus.on('taskList-column-width-change', this.onTaskListColumnWidthChange);\r\n      // clicking a bar or a task list cell selects the task (issue #6)\r\n      for (let type of ['task', 'milestone', 'project']) {\r\n        this.$emitBus.on(`chart-${type}-click`, ({ data }) => this.selectTask(data.id));\r\n        this.$emitBus.on(`taskList-${type}-click`, ({ data }) => this.selectTask(data.id));\r\n      }\r\n      // hovering a row highlights it in both the chart and the task list\r\n      // (issue #12). Row level enter/leave only - mouseenter/mouseleave do not\r\n      // bubble, so crossings between a row's children (progress bar, expander,\r\n      // links) cannot flicker the highlight. Bar and cell level events stay\r\n      // available on the bus for consumers.\r\n      for (let source of ['chart-row', 'taskList-row']) {\r\n        this.$emitBus.on(`${source}-mouseenter`, ({ data }) => {\r\n          this.state.hoveredTaskId = data.id;\r\n        });\r\n        this.$emitBus.on(`${source}-mouseleave`, ({ data }) => {\r\n          if (this.state.hoveredTaskId === data.id) {\r\n            this.state.hoveredTaskId = null;\r\n          }\r\n        });\r\n      }\r\n    },\r\n\r\n    /**\r\n     * When some action was performed (scale change for example) - recalculate time variables\r\n     */\r\n    recalculateTimes() {\r\n      let max = this.state.options.times.timeScale * 60;\r\n      let min = this.state.options.times.timeScale;\r\n      let steps = max / min;\r\n      let percent = this.state.options.times.timeZoom / 100;\r\n      this.state.options.times.timePerPixel =\r\n        this.state.options.times.timeScale * steps * percent + Math.pow(2, this.state.options.times.timeZoom);\r\n      this.state.options.times.totalViewDurationMs = dayjs(this.state.options.times.lastTime).diff(\r\n        this.state.options.times.firstTime,\r\n        'milliseconds'\r\n      );\r\n      this.state.options.times.totalViewDurationPx =\r\n        this.state.options.times.totalViewDurationMs / this.state.options.times.timePerPixel;\r\n      this.state.options.width =\r\n        this.state.options.times.totalViewDurationPx + this.style['grid-line-vertical']['stroke-width'];\r\n    },\r\n\r\n    /**\r\n     * Initialize time variables\r\n     */\r\n    initTimes() {\r\n      this.state.options.times.firstTime = dayjs(this.state.options.times.firstTaskTime)\r\n        .locale(this.state.options.locale.name)\r\n        .startOf('day')\r\n        .subtract(this.state.options.scope.before, 'days')\r\n        .startOf('day')\r\n        .valueOf();\r\n      this.state.options.times.lastTime = dayjs(this.state.options.times.lastTaskTime)\r\n        .locale(this.state.options.locale.name)\r\n        .endOf('day')\r\n        .add(this.state.options.scope.after, 'days')\r\n        .endOf('day')\r\n        .valueOf();\r\n      this.recalculateTimes();\r\n    },\r\n\r\n    /**\r\n     * Calculate steps\r\n     * Steps are days by default\r\n     * Each step contain information about time offset and pixel offset of this time inside gantt chart\r\n     */\r\n    calculateSteps() {\r\n      const steps = [];\r\n      const lastMs = dayjs(this.state.options.times.lastTime).valueOf();\r\n      const currentDate = dayjs(this.state.options.times.firstTime);\r\n      steps.push({\r\n        time: currentDate.valueOf(),\r\n        offset: {\r\n          ms: 0,\r\n          px: 0\r\n        }\r\n      });\r\n      for (\r\n        let currentDate = dayjs(this.state.options.times.firstTime)\r\n          .add(1, this.state.options.times.stepDuration)\r\n          .startOf('day');\r\n        currentDate.valueOf() <= lastMs;\r\n        currentDate = currentDate.add(1, this.state.options.times.stepDuration).startOf('day')\r\n      ) {\r\n        const offsetMs = currentDate.diff(this.state.options.times.firstTime, 'milliseconds');\r\n        const offsetPx = offsetMs / this.state.options.times.timePerPixel;\r\n        const step = {\r\n          time: currentDate.valueOf(),\r\n          offset: {\r\n            ms: offsetMs,\r\n            px: offsetPx\r\n          }\r\n        };\r\n        const previousStep = steps[steps.length - 1];\r\n        previousStep.width = {\r\n          ms: offsetMs - previousStep.offset.ms,\r\n          px: offsetPx - previousStep.offset.px\r\n        };\r\n        steps.push(step);\r\n      }\r\n      const lastStep = steps[steps.length - 1];\r\n      lastStep.width = {\r\n        ms: this.state.options.times.totalViewDurationMs - lastStep.offset.ms,\r\n        px: this.state.options.times.totalViewDurationPx - lastStep.offset.px\r\n      };\r\n      this.state.options.times.steps = steps;\r\n    },\r\n\r\n    /**\r\n     * Calculate calendar widths - when scale was changed for example\r\n     */\r\n    computeCalendarWidths() {\r\n      this.computeDayWidths();\r\n      this.computeHourWidths();\r\n      this.computeMonthWidths();\r\n    },\r\n\r\n    /**\r\n     * Compute width of calendar hours column widths basing on text widths\r\n     */\r\n    computeHourWidths() {\r\n      const style = { ...this.style['calendar-row-text'], ...this.style['calendar-row-text--hour'] };\r\n      this.state.ctx.font = style['font-size'] + ' ' + style['font-family'];\r\n      const localeName = this.state.options.locale.name;\r\n      let currentDate = dayjs('2018-01-01T00:00:00').locale(localeName); // any date will be good for hours\r\n      let maxWidths = this.state.options.calendar.hour.maxWidths;\r\n      if (maxWidths.length) {\r\n        return;\r\n      }\r\n      for (let formatName in this.state.options.calendar.hour.format) {\r\n        maxWidths[formatName] = 0;\r\n      }\r\n      for (let hour = 0; hour < 24; hour++) {\r\n        let widths = { hour };\r\n        for (let formatName in this.state.options.calendar.hour.format) {\r\n          const hourFormatted = this.state.options.calendar.hour.format[formatName](currentDate);\r\n          this.state.options.calendar.hour.formatted[formatName].push(hourFormatted);\r\n          widths[formatName] = this.state.ctx.measureText(hourFormatted).width;\r\n        }\r\n        this.state.options.calendar.hour.widths.push(widths);\r\n        for (let formatName in this.state.options.calendar.hour.format) {\r\n          if (widths[formatName] > maxWidths[formatName]) {\r\n            maxWidths[formatName] = widths[formatName];\r\n          }\r\n        }\r\n        currentDate = currentDate.add(1, 'hour');\r\n      }\r\n    },\r\n\r\n    /**\r\n     * Compute calendar days column widths basing on text widths\r\n     */\r\n    computeDayWidths() {\r\n      const style = { ...this.style['calendar-row-text'], ...this.style['calendar-row-text--day'] };\r\n      this.state.ctx.font = style['font-size'] + ' ' + style['font-family'];\r\n      const localeName = this.state.options.locale.name;\r\n      let currentDate = dayjs(this.state.options.times.steps[0].time).locale(localeName);\r\n      let maxWidths = this.state.options.calendar.day.maxWidths;\r\n      this.state.options.calendar.day.widths = [];\r\n      Object.keys(this.state.options.calendar.day.format).forEach(formatName => {\r\n        maxWidths[formatName] = 0;\r\n      });\r\n      for (let day = 0, daysLen = this.state.options.times.steps.length; day < daysLen; day++) {\r\n        const widths = {\r\n          day\r\n        };\r\n        Object.keys(this.state.options.calendar.day.format).forEach(formatName => {\r\n          widths[formatName] = this.state.ctx.measureText(\r\n            this.state.options.calendar.day.format[formatName](currentDate)\r\n          ).width;\r\n        });\r\n        this.state.options.calendar.day.widths.push(widths);\r\n        Object.keys(this.state.options.calendar.day.format).forEach(formatName => {\r\n          if (widths[formatName] > maxWidths[formatName]) {\r\n            maxWidths[formatName] = widths[formatName];\r\n          }\r\n        });\r\n        currentDate = currentDate.add(1, 'day');\r\n      }\r\n    },\r\n\r\n    /**\r\n     * Months count\r\n     *\r\n     * @description Returns number of different months in specified time range\r\n     *\r\n     * @param {number} fromTime - date in ms\r\n     * @param {number} toTime - date in ms\r\n     *\r\n     * @returns {number} different months count\r\n     */\r\n    monthsCount(fromTime, toTime) {\r\n      if (fromTime > toTime) {\r\n        return 0;\r\n      }\r\n      let currentMonth = dayjs(fromTime);\r\n      let previousMonth = currentMonth.clone();\r\n      let monthsCount = 1;\r\n      while (currentMonth.valueOf() <= toTime) {\r\n        currentMonth = currentMonth.add(1, 'day');\r\n        if (previousMonth.month() !== currentMonth.month()) {\r\n          monthsCount++;\r\n        }\r\n        previousMonth = currentMonth.clone();\r\n      }\r\n      return monthsCount;\r\n    },\r\n\r\n    /**\r\n     * Compute month calendar columns widths basing on text widths\r\n     */\r\n    computeMonthWidths() {\r\n      const style = { ...this.style['calendar-row-text'], ...this.style['calendar-row-text--month'] };\r\n      this.state.ctx.font = style['font-size'] + ' ' + style['font-family'];\r\n      let maxWidths = this.state.options.calendar.month.maxWidths;\r\n      this.state.options.calendar.month.widths = [];\r\n      Object.keys(this.state.options.calendar.month.format).forEach(formatName => {\r\n        maxWidths[formatName] = 0;\r\n      });\r\n      const localeName = this.state.options.locale.name;\r\n      let currentDate = dayjs(this.state.options.times.firstTime).locale(localeName);\r\n      const monthsCount = this.monthsCount(this.state.options.times.firstTime, this.state.options.times.lastTime);\r\n      for (let month = 0; month < monthsCount; month++) {\r\n        const widths = {\r\n          month\r\n        };\r\n        Object.keys(this.state.options.calendar.month.format).forEach(formatName => {\r\n          widths[formatName] = this.state.ctx.measureText(\r\n            this.state.options.calendar.month.format[formatName](currentDate)\r\n          ).width;\r\n        });\r\n        this.state.options.calendar.month.widths.push(widths);\r\n        Object.keys(this.state.options.calendar.month.format).forEach(formatName => {\r\n          if (widths[formatName] > maxWidths[formatName]) {\r\n            maxWidths[formatName] = widths[formatName];\r\n          }\r\n        });\r\n        currentDate = currentDate.add(1, 'month');\r\n      }\r\n    },\r\n\r\n    /**\r\n     * Prepare time and date variables for gantt\r\n     */\r\n    prepareDates() {\r\n      let firstTaskTime = Number.MAX_SAFE_INTEGER;\r\n      let lastTaskTime = 0;\r\n      for (let index = 0, len = this.state.tasks.length; index < len; index++) {\r\n        let task = this.state.tasks[index];\r\n        if (task.startTime < firstTaskTime) {\r\n          firstTaskTime = task.startTime;\r\n        }\r\n        if (task.startTime + task.duration > lastTaskTime) {\r\n          lastTaskTime = task.startTime + task.duration;\r\n        }\r\n      }\r\n      this.state.options.times.firstTaskTime = firstTaskTime;\r\n      this.state.options.times.lastTaskTime = lastTaskTime;\r\n      this.state.options.times.firstTime = dayjs(firstTaskTime)\r\n        .locale(this.state.options.locale.name)\r\n        .startOf('day')\r\n        .subtract(this.state.options.scope.before, 'days')\r\n        .startOf('day')\r\n        .valueOf();\r\n      this.state.options.times.lastTime = dayjs(lastTaskTime)\r\n        .locale(this.state.options.locale.name)\r\n        .endOf('day')\r\n        .add(this.state.options.scope.after, 'days')\r\n        .endOf('day')\r\n        .valueOf();\r\n    },\r\n\r\n    /**\r\n     * Setup and calculate everything\r\n     */\r\n    setup(itsUpdate = '') {\r\n      this.initialize(itsUpdate);\r\n      this.prepareDates();\r\n      this.initTimes();\r\n      this.calculateSteps();\r\n      this.computeCalendarWidths();\r\n      this.state.options.taskList.width = this.state.options.taskList.columns.reduce(\r\n        (prev, current) => {\r\n          return { width: prev.width + current.width };\r\n        },\r\n        { width: 0 }\r\n      ).width;\r\n    },\r\n\r\n    /**\r\n     * Global resize event (from window.addEventListener)\r\n     */\r\n    globalOnResize() {\r\n      if (typeof this.$el === 'undefined' || !this.$el) {\r\n        return;\r\n      }\r\n      this.state.options.clientWidth = this.$el.clientWidth;\r\n      if (\r\n        this.state.options.taskList.widthFromPercentage >\r\n        (this.state.options.clientWidth / 100) * this.state.options.taskList.widthThreshold\r\n      ) {\r\n        const diff =\r\n          this.state.options.taskList.widthFromPercentage -\r\n          (this.state.options.clientWidth / 100) * this.state.options.taskList.widthThreshold;\r\n        let diffPercent = 100 - (diff / this.state.options.taskList.widthFromPercentage) * 100;\r\n        if (diffPercent < 0) {\r\n          diffPercent = 0;\r\n        }\r\n        this.state.options.taskList.columns.forEach(column => {\r\n          column.thresholdPercent = diffPercent;\r\n        });\r\n      } else {\r\n        this.state.options.taskList.columns.forEach(column => {\r\n          column.thresholdPercent = 100;\r\n        });\r\n      }\r\n      this.calculateTaskListColumnsDimensions();\r\n      this.$emit('calendar-recalculate');\r\n      this.$emitBus.emit('calendar-recalculate');\r\n      this.syncScrollTop();\r\n    }\r\n  },\r\n\r\n  computed: {\r\n    /**\r\n     * Get visible tasks\r\n     * Very important method which will bring us only those tasks that are visible inside gantt chart\r\n     * For example when task is collapsed - children of this task are not visible - we should not render them\r\n     */\r\n    visibleTasks() {\r\n      // pure computed - the geometry side effects live in the visibleTasks watcher,\r\n      // a computed that mutates reactive state re-triggers itself endlessly in Vue 3\r\n      return this.state.tasks.filter(task => this.isTaskVisible(task));\r\n    },\r\n\r\n    /**\r\n     * First visible row index of the virtualization window (issue #9):\r\n     * only rows inside the viewport (plus an overscan of a few rows) are\r\n     * rendered - keeps mounted components constant on large datasets\r\n     *\r\n     * @returns {number}\r\n     */\r\n    renderedFirstIndex() {\r\n      const rowHeight = this.state.options.row.height + this.state.options.chart.grid.horizontal.gap * 2;\r\n      const first = Math.floor(this.state.options.scroll.top / rowHeight) - 5;\r\n      return first < 0 ? 0 : first;\r\n    },\r\n\r\n    /**\r\n     * Rows inside the vertical viewport - chart and task list render these\r\n     * instead of all visibleTasks (issue #9). Chart rows are absolutely\r\n     * positioned so the window needs no layout compensation there; the task\r\n     * list uses spacers to keep its scroll height stable.\r\n     *\r\n     * @returns {array}\r\n     */\r\n    renderedTasks() {\r\n      const tasks = this.visibleTasks;\r\n      const rowHeight = this.state.options.row.height + this.state.options.chart.grid.horizontal.gap * 2;\r\n      const last = Math.min(\r\n        tasks.length,\r\n        Math.ceil((this.state.options.scroll.top + this.state.options.rowsHeight) / rowHeight) + 5\r\n      );\r\n      return tasks.slice(this.renderedFirstIndex, last);\r\n    },\r\n\r\n    /**\r\n     * Style shortcut\r\n     */\r\n    style() {\r\n      return this.state.dynamicStyle;\r\n    },\r\n\r\n    /**\r\n     * Get task list columns; dimensions are calculated in initialize(),\r\n     * a computed must not mutate reactive state or Vue 3 will re-trigger it endlessly\r\n     */\r\n    getTaskListColumns() {\r\n      return this.state.options.taskList.columns;\r\n    },\r\n\r\n    /**\r\n     * Tasks used for communicate with parent component\r\n     */\r\n    outputTasks() {\r\n      return this.state.tasks;\r\n    },\r\n\r\n    /**\r\n     * Options used to communicate with parent component\r\n     */\r\n    outputOptions() {\r\n      return this.state.options;\r\n    }\r\n  },\r\n\r\n  /**\r\n   * Watch tasks after gantt instance is created and react when we have new kids on the block\r\n   */\r\n  created() {\r\n    this.$set = function(obj, key, val) { obj[key] = val; };\r\n    this.$delete = function(obj, key) { delete obj[key]; };\r\n    this.$emitBus = mitt();\r\n    // Vue 3 removed $on - expose a Vue 2 style subscription API backed by the\r\n    // event bus so consumers can register listeners programmatically\r\n    this.$on = (event, handler) => {\r\n      this.$emitBus.on(event, handler);\r\n      return this;\r\n    };\r\n    this.$off = (event, handler) => {\r\n      this.$emitBus.off(event, handler);\r\n      return this;\r\n    };\r\n    this.initializeEvents();\r\n    this.setup();\r\n    this.state.unwatchTasks = this.$watch(\r\n      'tasks',\r\n      tasks => {\r\n        const notEqual = notEqualDeep(tasks, this.outputTasks);\r\n        if (notEqual) {\r\n          this.setup('tasks');\r\n        }\r\n      },\r\n      { deep: true }\r\n    );\r\n    this.state.unwatchOptions = this.$watch(\r\n      'options',\r\n      opts => {\r\n        const notEqual = notEqualDeep(opts, this.outputOptions);\r\n        if (notEqual) {\r\n          this.setup('options');\r\n        }\r\n      },\r\n      { deep: true }\r\n    );\r\n    this.state.unwatchStyle = this.$watch(\r\n      'dynamicStyle',\r\n      style => {\r\n        const notEqual = notEqualDeep(style, this.style);\r\n        if (notEqual) {\r\n          this.initializeStyle();\r\n        }\r\n      },\r\n      { deep: true, immediate: true }\r\n    );\r\n\r\n    this.state.unwatchOutputTasks = this.$watch(\r\n      'outputTasks',\r\n      tasks => {\r\n        this.$emit('tasks-changed', tasks.map(task => task));\r\n        this.$emitBus.emit('tasks-changed', tasks.map(task => task));\r\n      },\r\n      { deep: true }\r\n    );\r\n    this.state.unwatchOutputOptions = this.$watch(\r\n      'outputOptions',\r\n      options => {\r\n        this.$emit('options-changed', mergeDeep({}, options));\r\n        this.$emitBus.emit('options-changed', mergeDeep({}, options));\r\n      },\r\n      { deep: true }\r\n    );\r\n    this.state.unwatchOutputStyle = this.$watch(\r\n      'style',\r\n      style => {\r\n        this.$emit('dynamic-style-changed', mergeDeep({}, style));\r\n        this.$emitBus.emit('dynamic-style-changed', mergeDeep({}, style));\r\n      },\r\n      { deep: true }\r\n    );\r\n\r\n    // apply geometry when the set of visible tasks (or anything it depends on) changes;\r\n    // this used to be a side effect inside the visibleTasks computed, which loops in Vue 3\r\n    this.state.unwatchVisibleTasksGeometry = this.$watch(\r\n      'visibleTasks',\r\n      visibleTasks => {\r\n        const maxRows = visibleTasks.slice(0, this.state.options.maxRows);\r\n        this.state.options.rowsHeight = this.getTasksHeight(maxRows);\r\n        let heightCompensation = 0;\r\n        if (this.state.options.maxHeight && this.state.options.rowsHeight > this.state.options.maxHeight) {\r\n          heightCompensation = this.state.options.rowsHeight - this.state.options.maxHeight;\r\n          this.state.options.rowsHeight = this.state.options.maxHeight;\r\n        }\r\n        this.state.options.height = this.getHeight(maxRows) - heightCompensation;\r\n        this.state.options.allVisibleTasksHeight = this.getTasksHeight(visibleTasks);\r\n        this.state.options.outerHeight = this.getHeight(maxRows, true) - heightCompensation;\r\n        let len = visibleTasks.length;\r\n        for (let index = 0; index < len; index++) {\r\n          this.calculateTaskGeometry(visibleTasks[index], index);\r\n        }\r\n      },\r\n      { immediate: true }\r\n    );\r\n\r\n    this.$emitBus.emit('gantt-elastic-created', this);\r\n    this.$emit('created', this);\r\n    this.$emitBus.emit('created', this);\r\n  },\r\n\r\n  /**\r\n   * Emit before-mount event\r\n   */\r\n  beforeMount() {\r\n    this.$emit('before-mount', this);\r\n    this.$emitBus.emit('before-mount', this);\r\n  },\r\n\r\n  /**\r\n   * Emit ready/mounted events and deliver this gantt instance to outside world when needed\r\n   */\r\n  mounted() {\r\n    this.state.options.clientWidth = this.$el.clientWidth;\r\n    this.state.resizeObserver = new ResizeObserverImpl(() => {\r\n      this.globalOnResize();\r\n    });\r\n    this.state.resizeObserver.observe(this.$el.parentNode);\r\n    this.globalOnResize();\r\n    // keep the current-time line ticking (issue #7) - single timer, not watcher driven\r\n    this.startNowTimer();\r\n    this.$emit('ready', this);\r\n    this.$emitBus.emit('ready', this);\r\n    this.$emitBus.emit('gantt-elastic-mounted', this);\r\n    this.$emit('mounted', this);\r\n    this.$emitBus.emit('mounted', this);\r\n    this.$emitBus.emit('gantt-elastic-ready', this);\r\n    this.$emit('gantt-elastic-ready', this);\r\n    this.$emitBus.emit('gantt-elastic-ready', this);\r\n  },\r\n\r\n  /**\r\n   * Emit event when data was changed and before update (you can cleanup dom events here for example)\r\n   */\r\n  beforeUpdate() {\r\n    this.$emit('before-update');\r\n    this.$emitBus.emit('before-update');\r\n  },\r\n\r\n  /**\r\n   * Emit event when gantt-elastic view was updated\r\n   */\r\n  updated() {\r\n    this.$nextTick(() => {\r\n      this.$emit('updated');\r\n      this.$emitBus.emit('updated');\r\n    });\r\n  },\r\n\r\n  /**\r\n   * Before destroy event - clean up\r\n   */\r\n  beforeUnmount() {\r\n    if (this.state.nowTimer !== null) {\r\n      clearInterval(this.state.nowTimer);\r\n      this.state.nowTimer = null;\r\n    }\r\n    this.state.resizeObserver.unobserve(this.$el.parentNode);\r\n    this.state.unwatchTasks();\r\n    this.state.unwatchOptions();\r\n    this.state.unwatchStyle();\r\n    this.state.unwatchVisibleTasksGeometry();\r\n    this.state.unwatchOutputTasks();\r\n    this.state.unwatchOutputOptions();\r\n    this.state.unwatchOutputStyle();\r\n    this.$emit('before-destroy');\r\n    this.$emitBus.emit('before-destroy');\r\n  },\r\n\r\n  /**\r\n   * Emit event after gantt-elastic was destroyed\r\n   */\r\n  unmounted() {\r\n    this.$emit('destroyed');\r\n    this.$emitBus.emit('destroyed');\r\n  }\r\n};\r\nexport default GanttElastic;\r\n</script>\r\n\r\n<style>\r\n.gantt-elastic {\r\n  /* default font stack so the widget never falls back to the host page's\r\n     body font (Times New Roman on plain pages); a dynamicStyle.fontFamily\r\n     wins over this through the inline style on the root element */\r\n  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;\r\n}\r\n[class^='gantt-elastic'],\r\n[class*=' gantt-elastic'] {\r\n  box-sizing: border-box;\r\n}\r\n.gantt-elastic__main-view svg {\r\n  display: block;\r\n}\r\n.gantt-elastic__grid-horizontal-line,\r\n.gantt-elastic__grid-vertical-line {\r\n  stroke: #a0a0a0;\r\n  stroke-width: 1;\r\n}\r\nforeignObject > * {\r\n  margin: 0px;\r\n}\r\n.gantt-elastic .p-2 {\r\n  padding: 10rem;\r\n}\r\n.gantt-elastic__main-view-main-container,\r\n.gantt-elastic__main-view-container {\r\n  overflow: hidden;\r\n  max-width: 100%;\r\n}\r\n.gantt-elastic__task-list-header-column:last-of-type {\r\n  border-right: 1px solid #00000050;\r\n}\r\n.gantt-elastic__task-list-item:last-of-type {\r\n  border-bottom: 1px solid #00000050;\r\n}\r\n.gantt-elastic__task-list-item-value-wrapper:hover {\r\n  overflow: visible !important;\r\n}\r\n.gantt-elastic__task-list-item-value-wrapper:hover > .gantt-elastic__task-list-item-value-container {\r\n  position: relative;\r\n  overflow: visible !important;\r\n}\r\n.gantt-elastic__task-list-item-value-wrapper:hover > .gantt-elastic__task-list-item-value {\r\n  position: absolute;\r\n}\r\n/* keyboard focus visibility (issue #13) */\r\n.gantt-elastic__chart-row-bar:focus-visible,\r\n.gantt-elastic__task-list-item:focus-visible,\r\n.gantt-elastic__task-list-header-resizer-wrapper:focus-visible,\r\n.gantt-elastic__chart-expander-content:focus-visible,\r\n.gantt-elastic__task-list-expander-content:focus-visible {\r\n  outline: 2px solid #4a90d2;\r\n  outline-offset: 1px;\r\n}\r\n/* respect reduced motion preferences (issue #13) */\r\n@media (prefers-reduced-motion: reduce) {\r\n  .gantt-elastic * {\r\n    transition: none !important;\r\n  }\r\n}\r\n</style>\r\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);

/* harmony export */ __webpack_require__.d(__webpack_exports__, [
/* harmony export */   "default", 0, /* export default binding */ __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ ]);


/***/ },

/***/ 411
(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(354);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `
.gantt-elastic__switch {
  display: inline-block;
  position: relative;
  vertical-align: middle;
  margin: 0px 15px;
  width: 40px;
  height: 20px;
  border-radius: 10px;
  background-color: #bfc9ca;
  cursor: pointer;
  transition: background-color 0.2s;
}
.gantt-elastic__switch--on {
  background-color: #1ebc61;
}
.gantt-elastic__switch input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}
.gantt-elastic__switch::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #fff;
  transition: left 0.2s;
}
.gantt-elastic__switch--on::after {
  left: 23px;
}
`, "",{"version":3,"sources":["webpack://./src/components/Header.vue"],"names":[],"mappings":";AA0YA;EACE,qBAAqB;EACrB,kBAAkB;EAClB,sBAAsB;EACtB,gBAAgB;EAChB,WAAW;EACX,YAAY;EACZ,mBAAmB;EACnB,yBAAyB;EACzB,eAAe;EACf,iCAAiC;AACnC;AACA;EACE,yBAAyB;AAC3B;AACA;EACE,UAAU;EACV,QAAQ;EACR,SAAS;EACT,kBAAkB;AACpB;AACA;EACE,WAAW;EACX,kBAAkB;EAClB,QAAQ;EACR,SAAS;EACT,WAAW;EACX,YAAY;EACZ,kBAAkB;EAClB,sBAAsB;EACtB,qBAAqB;AACvB;AACA;EACE,UAAU;AACZ","sourcesContent":["<!--\r\n/**\r\n * @fileoverview Header component\r\n * @license MIT\r\n * @author Rafal Pospiech <neuronet.io@gmail.com>\r\n * @package GanttElasticHeader\r\n */\r\n-->\r\n<template>\r\n  <div class=\"gantt-elastic__header\" :style=\"{ ...style['header'] }\">\r\n    <div\r\n      class=\"gantt-elastic__header-title\"\r\n      :style=\"{ ...style['header-title'] }\"\r\n    >\r\n      <div\r\n        class=\"gantt-elastic__header-title--text\"\r\n        :style=\"{ ...style['header-title--text'] }\"\r\n        v-if=\"!opts.title.html\"\r\n      >\r\n        {{ opts.title.label }}\r\n      </div>\r\n      <div\r\n        class=\"gantt-elastic__header-title--html\"\r\n        :style=\"{ ...style['header-title--html'] }\"\r\n        v-if=\"opts.title.html\"\r\n        v-html=\"sanitizedTitle\"\r\n      ></div>\r\n    </div>\r\n    <div\r\n      class=\"gantt-elastic__header-options\"\r\n      :style=\"{ ...style['header-options'] }\"\r\n    >\r\n      <button\r\n        class=\"gantt-elastic__header-btn-recenter\"\r\n        :style=\"{ ...style['header-btn-recenter'] }\"\r\n        @click.prevent=\"recenterPosition\"\r\n      >\r\n        {{ opts.locale.Now }}\r\n      </button>\r\n      <label\r\n        class=\"gantt-elastic__header-label\"\r\n        :style=\"{ ...style['header-label'] }\"\r\n      >\r\n        {{ opts.locale[\"X-Scale\"] }}\r\n        <div\r\n          class=\"gantt-elastic__header-slider-wrapper\"\r\n          :style=\"{ ...style['header-slider-wrapper'] }\"\r\n        >\r\n          <vue-slider\r\n            class=\"gantt-elastic__header-slider\"\r\n            tooltip=\"none\"\r\n            :style=\"{ ...style['header-slider'] }\"\r\n            :process-style=\"{ ...style['header-slider--process'] }\"\r\n            :slider-style=\"{ ...style['header-slider--slider'] }\"\r\n            v-model=\"scale\"\r\n            :max=\"24\"\r\n            :min=\"2\"\r\n            width=\"100px\"\r\n          ></vue-slider>\r\n        </div>\r\n      </label>\r\n      <label\r\n        class=\"gantt-elastic__header-label\"\r\n        :style=\"{ ...style['header-label'] }\"\r\n      >\r\n        {{ opts.locale[\"Y-Scale\"] }}\r\n        <div\r\n          class=\"gantt-elastic__header-slider-wrapper\"\r\n          :style=\"{ ...style['header-slider-wrapper'] }\"\r\n        >\r\n          <vue-slider\r\n            class=\"gantt-elastic__header-slider\"\r\n            tooltip=\"none\"\r\n            :style=\"{ ...style['header-slider'] }\"\r\n            :process-style=\"{ ...style['header-slider--process'] }\"\r\n            :slider-style=\"{ ...style['header-slider--slider'] }\"\r\n            v-model=\"height\"\r\n            :max=\"100\"\r\n            :min=\"7\"\r\n            width=\"100px\"\r\n          ></vue-slider>\r\n        </div>\r\n      </label>\r\n      <label\r\n        class=\"gantt-elastic__header-label\"\r\n        :style=\"{ ...style['header-label'] }\"\r\n      >\r\n        {{ opts.locale[\"Before/After\"] }}\r\n        <div\r\n          class=\"gantt-elastic__header-slider-wrapper\"\r\n          :style=\"{ ...style['header-slider-wrapper'] }\"\r\n        >\r\n          <vue-slider\r\n            class=\"gantt-elastic__header-slider\"\r\n            tooltip=\"none\"\r\n            :style=\"{ ...style['header-slider'] }\"\r\n            :process-style=\"{ ...style['header-slider--process'] }\"\r\n            :slider-style=\"{ ...style['header-slider--slider'] }\"\r\n            v-model=\"scope\"\r\n            :max=\"31\"\r\n            :min=\"0\"\r\n            width=\"100px\"\r\n          ></vue-slider>\r\n        </div>\r\n      </label>\r\n      <label\r\n        class=\"gantt-elastic__header-label\"\r\n        :style=\"{ ...style['header-label'] }\"\r\n      >\r\n        {{ opts.locale[\"Task list width\"] }}\r\n        <div\r\n          class=\"gantt-elastic__header-slider-wrapper\"\r\n          :style=\"{ ...style['header-slider-wrapper'] }\"\r\n        >\r\n          <vue-slider\r\n            class=\"gantt-elastic__header-slider\"\r\n            tooltip=\"none\"\r\n            :style=\"{ ...style['header-slider'] }\"\r\n            :process-style=\"{ ...style['header-slider--process'] }\"\r\n            :slider-style=\"{ ...style['header-slider--slider'] }\"\r\n            v-model=\"divider\"\r\n            :max=\"100\"\r\n            :min=\"0\"\r\n            width=\"100px\"\r\n          ></vue-slider>\r\n        </div>\r\n      </label>\r\n      <label\r\n        class=\"gantt-elastic__header-task-list-switch--wrapper\"\r\n        :style=\"{ ...style['header-task-list-switch--label'] }\"\r\n      >\r\n        <gantt-switch\r\n          class=\"gantt-elastic__header-task-list-switch\"\r\n          :style=\"{ ...style['header-task-list-switch'] }\"\r\n          :value=\"root.state.options.taskList.display\"\r\n          :label=\"opts.locale['Display task list']\"\r\n          @input=\"value => (root.state.options.taskList.display = value)\"\r\n        ></gantt-switch>\r\n        {{ opts.locale[\"Display task list\"] }}\r\n      </label>\r\n    </div>\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nimport vueSlider from \"vue-slider-component\";\r\nimport \"vue-slider-component/theme/default.css\";\r\nimport { h } from \"vue\";\r\nimport { sanitizeHtml } from \"../html.js\";\r\n\r\n// tiny inline on/off switch - replaces the Vue 2 only vue-switches dependency\r\nconst GanttSwitch = {\r\n  name: \"GanttSwitch\",\r\n  props: {\r\n    value: { type: Boolean, default: false },\r\n    label: { type: String, default: \"\" }\r\n  },\r\n  emits: [\"input\"],\r\n  methods: {\r\n    toggle(event) {\r\n      this.$emit(\"input\", event.target.checked);\r\n    }\r\n  },\r\n  render() {\r\n    return h(\"label\", { class: [\"gantt-elastic__switch\", this.value ? \"gantt-elastic__switch--on\" : \"gantt-elastic__switch--off\"] }, [\r\n      h(\"input\", { type: \"checkbox\", checked: this.value, onChange: this.toggle, \"aria-label\": this.label })\r\n    ]);\r\n  }\r\n};\r\n\r\nconst defaultStyle = {\r\n  header: {\r\n    margin: \"0px auto\",\r\n    background: \"#f3f5f747\",\r\n    padding: \"10px\",\r\n    overflow: \"hidden\",\r\n    clear: \"both\",\r\n    display: \"flex\",\r\n    \"justify-content\": \"space-between\"\r\n  },\r\n  \"header-title\": { float: \"left\" },\r\n  \"header-options\": { float: \"right\" },\r\n  \"header-title--text\": {\r\n    \"font-size\": \"20px\",\r\n    \"vertical-align\": \"middle\",\r\n    \"font-weight\": \"400\",\r\n    \"line-height\": \"35px\",\r\n    \"padding-left\": \"22px\",\r\n    \"letter-spacing\": \"1px\"\r\n  },\r\n  \"header-title--html\": {\r\n    \"font-size\": \"20px\",\r\n    \"vertical-align\": \"middle\",\r\n    \"font-weight\": \"400\",\r\n    \"line-height\": \"35px\",\r\n    \"padding-left\": \"22px\",\r\n    \"letter-spacing\": \"1px\"\r\n  },\r\n  \"header-btn-recenter\": {\r\n    background: \"#95A5A6\",\r\n    border: \"none\",\r\n    outline: \"none\",\r\n    cursor: \"pointer\",\r\n    color: \"white\",\r\n    \"border-radius\": \"3px\",\r\n    \"margin-right\": \"27px\",\r\n    \"font-size\": \"16px\",\r\n    padding: \"8px 12px\"\r\n  },\r\n  \"header-slider\": {\r\n    \"box-sizing\": \"content-box\"\r\n  },\r\n  \"header-slider-wrapper\": {\r\n    display: \"inline-block\",\r\n    \"vertical-align\": \"middle\"\r\n  },\r\n  \"header-slider--slider\": { \"box-sizing\": \"content-box\" },\r\n  \"header-slider--process\": { \"box-sizing\": \"content-box\" },\r\n  \"header-task-list-switch--label\": { \"box-sizing\": \"content-box\" },\r\n  \"header-task-list-switch\": {\r\n    margin: \"0px 15px\",\r\n    \"vertical-align\": \"middle\"\r\n  },\r\n  \"header-label\": {}\r\n};\r\nconst defaultOptions = {\r\n  title: {\r\n    label: \"gantt-elastic\",\r\n    html: false\r\n  },\r\n  locale: {\r\n    Now: \"Now\",\r\n    \"X-Scale\": \"Zoom-X\",\r\n    \"Y-Scale\": \"Zoom-Y\",\r\n    \"Task list width\": \"Task list\",\r\n    \"Before/After\": \"Expand\",\r\n    \"Display task list\": \"Show task list\"\r\n  }\r\n};\r\nexport default {\r\n  name: \"GanttHeader\",\r\n  components: {\r\n    vueSlider,\r\n    GanttSwitch\r\n  },\r\n  props: [\"options\", \"dynamicStyle\"],\r\n  inject: [\"root\"],\r\n  data() {\r\n    return {\r\n      scaleTimeoutId: null,\r\n      firstScale: false,\r\n      localScale: 0,\r\n      localHeight: 0,\r\n      localBefore: 0,\r\n      localPercent: 0,\r\n      sliderOptions: {\r\n        xScale: {\r\n          value: 0\r\n        }\r\n      },\r\n      style: {},\r\n      opts: {}\r\n    };\r\n  },\r\n  created() {\r\n    this.$set = function(obj, key, val) { obj[key] = val; };\r\n    this.$delete = function(obj, key) { delete obj[key]; };\r\n\r\n    this.localScale = this.root.state.options.times.timeZoom;\r\n    this.localHeight = this.root.state.options.row.height;\r\n    this.localBefore = this.root.state.options.scope.before;\r\n    this.localPercent = this.root.state.options.taskList.percent;\r\n    this.sliderOptions.xScale.value = this.root.state.options.times.timeZoom;\r\n    this.style = this.root.mergeDeep({}, defaultStyle, this.dynamicStyle);\r\n    // the integrated header (rendered when the consumer overrides no header slot)\r\n    // gets no props - read title and locale from the gantt options instead, so\r\n    // options.title.html and translated labels actually take effect\r\n    const rootOptions = this.root.state.options;\r\n    const sources = [defaultOptions];\r\n    if (rootOptions.title) {\r\n      sources.push({ title: rootOptions.title });\r\n    }\r\n    if (rootOptions.locale) {\r\n      sources.push({ locale: rootOptions.locale });\r\n    }\r\n    if (this.options) {\r\n      sources.push(this.options);\r\n    }\r\n    this.opts = this.root.mergeDeep({}, ...sources);\r\n  },\r\n  methods: {\r\n    getImage() {\r\n      this.root.getImage(\"image/png\").then(imgB64 => {\r\n        const link = document.createElement(\"a\");\r\n        link.href = imgB64;\r\n        link.download = \"gantt-elastic.png\";\r\n        document.body.appendChild(link);\r\n        link.click();\r\n        document.body.removeChild(link);\r\n      });\r\n    },\r\n    recenterPosition() {\r\n      this.root.$emitBus.emit(\"recenterPosition\");\r\n    },\r\n    setScale(value) {\r\n      if (this.scaleTimeoutId !== null) {\r\n        clearTimeout(this.scaleTimeoutId);\r\n        this.scaleTimeoutId = null;\r\n      }\r\n      // debouncing\r\n      if (this.firstScale) {\r\n        this.scaleTimeoutId = setTimeout(() => {\r\n          this.root.$emitBus.emit(\"times-timeZoom-change\", value);\r\n          this.scaleTimeoutId = null;\r\n        }, 50);\r\n      } else {\r\n        this.root.$emitBus.emit(\"times-timeZoom-change\", value);\r\n        this.firstScale = true;\r\n      }\r\n    }\r\n  },\r\n  computed: {\r\n    /**\r\n     * Header title sanitized before v-html injection - html rendering is\r\n     * opt-in via options.title.html but the label itself is untrusted input\r\n     * @returns {string}\r\n     */\r\n    sanitizedTitle() {\r\n      return sanitizeHtml(this.opts.title.label);\r\n    },\r\n    /**\r\n     * If there is a component slot specified for header\r\n     * @returns {bool}\r\n     */\r\n    beforeOptionsIsComponent() {\r\n      const headerSlot = this.options.slots.header;\r\n      if (\r\n        typeof headerSlot.beforeOptions === \"object\" &&\r\n        !Array.isArray(headerSlot.beforeOptions)\r\n      ) {\r\n        return true;\r\n      }\r\n      return false;\r\n    },\r\n    /**\r\n     * If there is a slot with beforeOptions html content\r\n     * @returns {bool}\r\n     */\r\n    beforeOptionsIsHtml() {\r\n      if (typeof this.options.slots.header.beforeOptions === \"string\") {\r\n        return true;\r\n      }\r\n      return false;\r\n    },\r\n    scale: {\r\n      get() {\r\n        return this.localScale;\r\n      },\r\n      set(value) {\r\n        this.localScale = Number(value);\r\n        this.setScale(this.localScale);\r\n      }\r\n    },\r\n    height: {\r\n      get() {\r\n        return this.localHeight;\r\n      },\r\n      set(value) {\r\n        this.localHeight = Number(value);\r\n        this.root.$emitBus.emit(\"row-height-change\", Number(value));\r\n      }\r\n    },\r\n    scope: {\r\n      get() {\r\n        return this.localBefore;\r\n      },\r\n      set(value) {\r\n        this.localBefore = Number(value);\r\n        this.root.$emitBus.emit(\"scope-change\", Number(value));\r\n      }\r\n    },\r\n    divider: {\r\n      get() {\r\n        return this.localPercent;\r\n      },\r\n      set(value) {\r\n        this.localPercent = Number(value);\r\n        this.root.$emitBus.emit(\"taskList-width-change\", Number(value));\r\n      }\r\n    }\r\n  }\r\n};\r\n</script>\r\n<style>\r\n.gantt-elastic__switch {\r\n  display: inline-block;\r\n  position: relative;\r\n  vertical-align: middle;\r\n  margin: 0px 15px;\r\n  width: 40px;\r\n  height: 20px;\r\n  border-radius: 10px;\r\n  background-color: #bfc9ca;\r\n  cursor: pointer;\r\n  transition: background-color 0.2s;\r\n}\r\n.gantt-elastic__switch--on {\r\n  background-color: #1ebc61;\r\n}\r\n.gantt-elastic__switch input {\r\n  opacity: 0;\r\n  width: 0;\r\n  height: 0;\r\n  position: absolute;\r\n}\r\n.gantt-elastic__switch::after {\r\n  content: \"\";\r\n  position: absolute;\r\n  top: 3px;\r\n  left: 3px;\r\n  width: 14px;\r\n  height: 14px;\r\n  border-radius: 50%;\r\n  background-color: #fff;\r\n  transition: left 0.2s;\r\n}\r\n.gantt-elastic__switch--on::after {\r\n  left: 23px;\r\n}\r\n</style>\r\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);

/* harmony export */ __webpack_require__.d(__webpack_exports__, [
/* harmony export */   "default", 0, /* export default binding */ __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ ]);


/***/ },

/***/ 937
(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(354);
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* component style */
.vue-slider-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* rail style */
.vue-slider-rail {
  background-color: #ccc;
  border-radius: 15px;
}

/* process style */
.vue-slider-process {
  background-color: #3498db;
  border-radius: 15px;
}

/* mark style */
.vue-slider-mark {
  z-index: 4;
}
.vue-slider-mark:first-child .vue-slider-mark-step, .vue-slider-mark:last-child .vue-slider-mark-step {
  display: none;
}
.vue-slider-mark-step {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.16);
}
.vue-slider-mark-label {
  font-size: 14px;
  white-space: nowrap;
}
/* dot style */
.vue-slider-dot-handle {
  cursor: pointer;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #fff;
  box-sizing: border-box;
  box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);
}
.vue-slider-dot-handle-focus {
  box-shadow: 0px 0px 1px 2px rgba(52, 152, 219, 0.36);
}

.vue-slider-dot-handle-disabled {
  cursor: not-allowed;
  background-color: #ccc;
}

.vue-slider-dot-tooltip-inner {
  font-size: 14px;
  white-space: nowrap;
  padding: 2px 5px;
  min-width: 20px;
  text-align: center;
  color: #fff;
  border-radius: 5px;
  border-color: #3498db;
  background-color: #3498db;
  box-sizing: content-box;
}
.vue-slider-dot-tooltip-inner::after {
  content: "";
  position: absolute;
}
.vue-slider-dot-tooltip-inner-top::after {
  top: 100%;
  left: 50%;
  transform: translate(-50%, 0);
  height: 0;
  width: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 5px;
  border-top-color: inherit;
}
.vue-slider-dot-tooltip-inner-bottom::after {
  bottom: 100%;
  left: 50%;
  transform: translate(-50%, 0);
  height: 0;
  width: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 5px;
  border-bottom-color: inherit;
}
.vue-slider-dot-tooltip-inner-left::after {
  left: 100%;
  top: 50%;
  transform: translate(0, -50%);
  height: 0;
  width: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 5px;
  border-left-color: inherit;
}
.vue-slider-dot-tooltip-inner-right::after {
  right: 100%;
  top: 50%;
  transform: translate(0, -50%);
  height: 0;
  width: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 5px;
  border-right-color: inherit;
}

.vue-slider-dot-tooltip-wrapper {
  opacity: 0;
  transition: all 0.3s;
}
.vue-slider-dot-tooltip-wrapper-show {
  opacity: 1;
}

/*# sourceMappingURL=default.css.map */
`, "",{"version":3,"sources":["webpack://./node_modules/vue-slider-component/lib/theme/default.scss","webpack://./node_modules/vue-slider-component/theme/default.css","webpack://./node_modules/vue-slider-component/lib/styles/_triangle.scss"],"names":[],"mappings":"AA2BA,oBAAA;AACA;EACE,YA1BgB;EA2BhB,mBAAA;AC1BF;;AD6BA,eAAA;AACA;EACE,sBA9BQ;EA+BR,mBA9BiB;ACInB;;AD6BA,kBAAA;AACA;EACE,yBAvCW;EAwCX,mBApCiB;ACUnB;;AD6BA,eAAA;AACA;EACE,UAAA;AC1BF;AD8BI;EACE,aAAA;AC5BN;ADgCW;EACP,WAAA;EACA,YAAA;EACA,kBArCe;EAsCf,qCArCU;ACOd;ADoCW;EACP,eA1CY;EA2CZ,mBAAA;AClCJ;ADyCA,cAAA;AAEW;EACP,eAAA;EACA,WAAA;EACA,YAAA;EACA,kBArEc;EAsEd,sBAxES;EAyET,sBAAA;EACA,mDA5EQ;ACoCZ;AD0Ca;EACP,oDA9EW;ACsCjB;;AD0Ca;EACP,mBAAA;EACA,sBAhFc;ACyCpB;;AD4Ca;EACP,eA7EY;EA8EZ,mBAAA;EACA,gBAlFW;EAmFX,eAlFY;EAmFZ,kBAAA;EACA,WAvFS;EAwFT,kBAvFgB;EAwFhB,qBAtGO;EAuGP,yBAvGO;EAwGP,uBAAA;ACzCN;AC7CE;EACE,WAAA;EACA,kBAAA;AD+CJ;AC3CI;EACE,SAAA;EACA,SAAA;EACA,6BAAA;EA5BJ,SAAA;EACA,QAAA;EAEE,yBAAA;EACA,mBAAA;EACA,iBFaW;EEPT,yBF+F8B;AC3BpC;AC7CI;EACE,YAAA;EACA,SAAA;EACA,6BAAA;EArCJ,SAAA;EACA,QAAA;EAEE,yBAAA;EACA,mBAAA;EACA,iBFaW;EEXT,4BFmG8B;AChBpC;AC/CI;EACE,UAAA;EACA,QAAA;EACA,6BAAA;EA9CJ,SAAA;EACA,QAAA;EAEE,yBAAA;EACA,mBAAA;EACA,iBFaW;EETT,0BFiG8B;ACLpC;ACjDI;EACE,WAAA;EACA,QAAA;EACA,6BAAA;EAvDJ,SAAA;EACA,QAAA;EAEE,yBAAA;EACA,mBAAA;EACA,iBFaW;EELT,2BF6F8B;ACMpC;;ADFW;EACP,UAAA;EACA,oBAAA;ACKJ;ADJa;EACP,UAAA;ACMN;;AAEA,sCAAsC","sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);

/* harmony export */ __webpack_require__.d(__webpack_exports__, [
/* harmony export */   "default", 0, /* export default binding */ __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ ]);


/***/ },

/***/ 314
(module) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ },

/***/ 354
(module) {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ },

/***/ 353
(module) {

!function(t,e){ true?module.exports=e():0}(this,(function(){"use strict";var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",c="month",f="quarter",h="year",d="date",l="Invalid Date",$=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|YYYY|YY|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return"["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},m=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},v={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return(e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return-t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,c),s=n-i<0,u=e.clone().add(r+(s?-1:1),c);return+(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:c,y:h,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:f}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},g="en",D={};D[g]=M;var p="$isDayjsObject",S=function(t){return t instanceof _||!(!t||!t[p])},w=function t(e,n,r){var i;if(!e)return g;if("string"==typeof e){var s=e.toLowerCase();D[s]&&(i=s),n&&(D[s]=n,i=s);var u=e.split("-");if(!i&&u.length>1)return t(u[0])}else{var a=e.name;D[a]=e,i=a}return!r&&i&&(g=i),i||!r&&g},O=function(t,e){if(S(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},b=v;b.l=w,b.i=S,b.w=function(t,e){return O(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=w(t.locale,null,!0),this.parse(t),this.$x=this.$x||t.x||{},this[p]=!0}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(b.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match($);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.init()},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},m.$utils=function(){return b},m.isValid=function(){return!(this.$d.toString()===l)},m.isSame=function(t,e){var n=O(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return O(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<O(t)},m.$g=function(t,e,n){return b.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!b.u(e)||e,f=b.p(t),l=function(t,e){var i=b.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},$=function(t,e){return b.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,v="set"+(this.$u?"UTC":"");switch(f){case h:return r?l(1,0):l(31,11);case c:return r?l(1,M):l(0,M+1);case o:var g=this.$locale().weekStart||0,D=(y<g?y+7:y)-g;return l(r?m-D:m+(6-D),M);case a:case d:return $(v+"Hours",0);case u:return $(v+"Minutes",1);case s:return $(v+"Seconds",2);case i:return $(v+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=b.p(t),f="set"+(this.$u?"UTC":""),l=(n={},n[a]=f+"Date",n[d]=f+"Date",n[c]=f+"Month",n[h]=f+"FullYear",n[u]=f+"Hours",n[s]=f+"Minutes",n[i]=f+"Seconds",n[r]=f+"Milliseconds",n)[o],$=o===a?this.$D+(e-this.$W):e;if(o===c||o===h){var y=this.clone().set(d,1);y.$d[l]($),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d}else l&&this.$d[l]($);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[b.p(t)]()},m.add=function(r,f){var d,l=this;r=Number(r);var $=b.p(f),y=function(t){var e=O(l);return b.w(e.date(e.date()+Math.round(t*r)),l)};if($===c)return this.set(c,this.$M+r);if($===h)return this.set(h,this.$y+r);if($===a)return y(1);if($===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[$]||1,m=this.$d.getTime()+r*M;return b.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||l;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=b.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,c=n.months,f=n.meridiem,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},d=function(t){return b.s(s%12||12,t,"0")},$=f||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r};return r.replace(y,(function(t,r){return r||function(t){switch(t){case"YY":return String(e.$y).slice(-2);case"YYYY":return b.s(e.$y,4,"0");case"M":return a+1;case"MM":return b.s(a+1,2,"0");case"MMM":return h(n.monthsShort,a,c,3);case"MMMM":return h(c,a);case"D":return e.$D;case"DD":return b.s(e.$D,2,"0");case"d":return String(e.$W);case"dd":return h(n.weekdaysMin,e.$W,o,2);case"ddd":return h(n.weekdaysShort,e.$W,o,3);case"dddd":return o[e.$W];case"H":return String(s);case"HH":return b.s(s,2,"0");case"h":return d(1);case"hh":return d(2);case"a":return $(s,u,!0);case"A":return $(s,u,!1);case"m":return String(u);case"mm":return b.s(u,2,"0");case"s":return String(e.$s);case"ss":return b.s(e.$s,2,"0");case"SSS":return b.s(e.$ms,3,"0");case"Z":return i}return null}(t)||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,l){var $,y=this,M=b.p(d),m=O(r),v=(m.utcOffset()-this.utcOffset())*e,g=this-m,D=function(){return b.m(y,m)};switch(M){case h:$=D()/12;break;case c:$=D();break;case f:$=D()/3;break;case o:$=(g-v)/6048e5;break;case a:$=(g-v)/864e5;break;case u:$=g/n;break;case s:$=g/e;break;case i:$=g/t;break;default:$=g}return l?$:b.a($)},m.daysInMonth=function(){return this.endOf(c).$D},m.$locale=function(){return D[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=w(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return b.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),Y=_.prototype;return O.prototype=Y,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",c],["$y",h],["$D",d]].forEach((function(t){Y[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),O.extend=function(t,e){return t.$i||(t(e,_,O),t.$i=!0),O},O.locale=w,O.isDayjs=S,O.unix=function(t){return O(1e3*t)},O.en=D[g],O.Ls=D,O.p={},O}));

/***/ },

/***/ 378
(module, __unused_webpack_exports, __webpack_require__) {

(function(t,e){ true?module.exports=e(__webpack_require__(398)):0})("undefined"!==typeof self?self:this,(function(t){return function(){var e={388:function(t,e){var r,n,i;(function(o,a){n=[],r=a,i="function"===typeof r?r.apply(e,n):r,void 0===i||(t.exports=i)})("undefined"!==typeof self&&self,(function(){function t(){var e=Object.getOwnPropertyDescriptor(document,"currentScript");if(!e&&"currentScript"in document&&document.currentScript)return document.currentScript;if(e&&e.get!==t&&document.currentScript)return document.currentScript;try{throw new Error}catch(f){var r,n,i,o=/.*at [^(]*\((.*):(.+):(.+)\)$/gi,a=/@([^@]*):(\d+):(\d+)\s*$/gi,s=o.exec(f.stack)||a.exec(f.stack),l=s&&s[1]||!1,u=s&&s[2]||!1,c=document.location.href.replace(document.location.hash,""),d=document.getElementsByTagName("script");l===c&&(r=document.documentElement.outerHTML,n=new RegExp("(?:[^\\n]+?\\n){0,"+(u-2)+"}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*","i"),i=r.replace(n,"$1").trim());for(var h=0;h<d.length;h++){if("interactive"===d[h].readyState)return d[h];if(d[h].src===l)return d[h];if(l===c&&d[h].innerHTML&&d[h].innerHTML.trim()===i)return d[h]}return null}}return t}))},905:function(t,e,r){"use strict";r.r(e);var n=r(117),i=r.n(n),o=r(488),a=r.n(o),s=a()(i());s.push([t.id,".vue-slider-dot{position:absolute;-webkit-transition:all 0s;transition:all 0s;z-index:5}.vue-slider-dot:focus{outline:none}.vue-slider-dot-tooltip{position:absolute;visibility:hidden}.vue-slider-dot-hover:hover .vue-slider-dot-tooltip,.vue-slider-dot-tooltip-show{visibility:visible}.vue-slider-dot-tooltip-top{top:-10px;left:50%;-webkit-transform:translate(-50%,-100%);transform:translate(-50%,-100%)}.vue-slider-dot-tooltip-bottom{bottom:-10px;left:50%;-webkit-transform:translate(-50%,100%);transform:translate(-50%,100%)}.vue-slider-dot-tooltip-left{left:-10px;top:50%;-webkit-transform:translate(-100%,-50%);transform:translate(-100%,-50%)}.vue-slider-dot-tooltip-right{right:-10px;top:50%;-webkit-transform:translate(100%,-50%);transform:translate(100%,-50%)}",""]),e["default"]=s},121:function(t,e,r){"use strict";r.r(e);var n=r(117),i=r.n(n),o=r(488),a=r.n(o),s=a()(i());s.push([t.id,".vue-slider-marks{position:relative;width:100%;height:100%}.vue-slider-mark{position:absolute;z-index:1}.vue-slider-ltr .vue-slider-mark,.vue-slider-rtl .vue-slider-mark{width:0;height:100%;top:50%}.vue-slider-ltr .vue-slider-mark-step,.vue-slider-rtl .vue-slider-mark-step{top:0}.vue-slider-ltr .vue-slider-mark-label,.vue-slider-rtl .vue-slider-mark-label{top:100%;margin-top:10px}.vue-slider-ltr .vue-slider-mark{-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.vue-slider-ltr .vue-slider-mark-step{left:0}.vue-slider-ltr .vue-slider-mark-label{left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}.vue-slider-rtl .vue-slider-mark{-webkit-transform:translate(50%,-50%);transform:translate(50%,-50%)}.vue-slider-rtl .vue-slider-mark-step{right:0}.vue-slider-rtl .vue-slider-mark-label{right:50%;-webkit-transform:translateX(50%);transform:translateX(50%)}.vue-slider-btt .vue-slider-mark,.vue-slider-ttb .vue-slider-mark{width:100%;height:0;left:50%}.vue-slider-btt .vue-slider-mark-step,.vue-slider-ttb .vue-slider-mark-step{left:0}.vue-slider-btt .vue-slider-mark-label,.vue-slider-ttb .vue-slider-mark-label{left:100%;margin-left:10px}.vue-slider-btt .vue-slider-mark{-webkit-transform:translate(-50%,50%);transform:translate(-50%,50%)}.vue-slider-btt .vue-slider-mark-step{top:0}.vue-slider-btt .vue-slider-mark-label{top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.vue-slider-ttb .vue-slider-mark{-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.vue-slider-ttb .vue-slider-mark-step{bottom:0}.vue-slider-ttb .vue-slider-mark-label{bottom:50%;-webkit-transform:translateY(50%);transform:translateY(50%)}.vue-slider-mark-label,.vue-slider-mark-step{position:absolute}",""]),e["default"]=s},207:function(t,e,r){"use strict";r.r(e);var n=r(117),i=r.n(n),o=r(488),a=r.n(o),s=a()(i());s.push([t.id,".vue-slider{position:relative;-webkit-box-sizing:content-box;box-sizing:content-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:block;-webkit-tap-highlight-color:rgba(0,0,0,0)}.vue-slider-rail{position:relative;width:100%;height:100%;-webkit-transition-property:width,height,left,right,top,bottom;transition-property:width,height,left,right,top,bottom}.vue-slider-process{position:absolute;z-index:1}",""]),e["default"]=s},488:function(t){"use strict";t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var r="",n="undefined"!==typeof e[5];return e[4]&&(r+="@supports (".concat(e[4],") {")),e[2]&&(r+="@media ".concat(e[2]," {")),n&&(r+="@layer".concat(e[5].length>0?" ".concat(e[5]):""," {")),r+=t(e),n&&(r+="}"),e[2]&&(r+="}"),e[4]&&(r+="}"),r})).join("")},e.i=function(t,r,n,i,o){"string"===typeof t&&(t=[[null,t,void 0]]);var a={};if(n)for(var s=0;s<this.length;s++){var l=this[s][0];null!=l&&(a[l]=!0)}for(var u=0;u<t.length;u++){var c=[].concat(t[u]);n&&a[c[0]]||("undefined"!==typeof o&&("undefined"===typeof c[5]||(c[1]="@layer".concat(c[5].length>0?" ".concat(c[5]):""," {").concat(c[1],"}")),c[5]=o),r&&(c[2]?(c[1]="@media ".concat(c[2]," {").concat(c[1],"}"),c[2]=r):c[2]=r),i&&(c[4]?(c[1]="@supports (".concat(c[4],") {").concat(c[1],"}"),c[4]=i):c[4]="".concat(i)),e.push(c))}},e}},117:function(t){"use strict";t.exports=function(t){return t[1]}},831:function(t,e){"use strict";e.Z=(t,e)=>{const r=t.__vccOpts||t;for(const[n,i]of e)r[n]=i;return r}},466:function(t,e,r){var n=r(905);n.__esModule&&(n=n.default),"string"===typeof n&&(n=[[t.id,n,""]]),n.locals&&(t.exports=n.locals);var i=r(959).Z;i("50bc1720",n,!0,{sourceMap:!1,shadowMode:!1})},18:function(t,e,r){var n=r(121);n.__esModule&&(n=n.default),"string"===typeof n&&(n=[[t.id,n,""]]),n.locals&&(t.exports=n.locals);var i=r(959).Z;i("10aa5f36",n,!0,{sourceMap:!1,shadowMode:!1})},631:function(t,e,r){var n=r(207);n.__esModule&&(n=n.default),"string"===typeof n&&(n=[[t.id,n,""]]),n.locals&&(t.exports=n.locals);var i=r(959).Z;i("1772934e",n,!0,{sourceMap:!1,shadowMode:!1})},959:function(t,e,r){"use strict";function n(t,e){for(var r=[],n={},i=0;i<e.length;i++){var o=e[i],a=o[0],s=o[1],l=o[2],u=o[3],c={id:t+":"+i,css:s,media:l,sourceMap:u};n[a]?n[a].parts.push(c):r.push(n[a]={id:a,parts:[c]})}return r}r.d(e,{Z:function(){return p}});var i="undefined"!==typeof document;if("undefined"!==typeof DEBUG&&DEBUG&&!i)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var o={},a=i&&(document.head||document.getElementsByTagName("head")[0]),s=null,l=0,u=!1,c=function(){},d=null,h="data-vue-ssr-id",f="undefined"!==typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function p(t,e,r,i){u=r,d=i||{};var a=n(t,e);return m(a),function(e){for(var r=[],i=0;i<a.length;i++){var s=a[i],l=o[s.id];l.refs--,r.push(l)}e?(a=n(t,e),m(a)):a=[];for(i=0;i<r.length;i++){l=r[i];if(0===l.refs){for(var u=0;u<l.parts.length;u++)l.parts[u]();delete o[l.id]}}}}function m(t){for(var e=0;e<t.length;e++){var r=t[e],n=o[r.id];if(n){n.refs++;for(var i=0;i<n.parts.length;i++)n.parts[i](r.parts[i]);for(;i<r.parts.length;i++)n.parts.push(y(r.parts[i]));n.parts.length>r.parts.length&&(n.parts.length=r.parts.length)}else{var a=[];for(i=0;i<r.parts.length;i++)a.push(y(r.parts[i]));o[r.id]={id:r.id,refs:1,parts:a}}}}function v(){var t=document.createElement("style");return t.type="text/css",a.appendChild(t),t}function y(t){var e,r,n=document.querySelector("style["+h+'~="'+t.id+'"]');if(n){if(u)return c;n.parentNode.removeChild(n)}if(f){var i=l++;n=s||(s=v()),e=g.bind(null,n,i,!1),r=g.bind(null,n,i,!0)}else n=v(),e=k.bind(null,n),r=function(){n.parentNode.removeChild(n)};return e(t),function(n){if(n){if(n.css===t.css&&n.media===t.media&&n.sourceMap===t.sourceMap)return;e(t=n)}else r()}}var b=function(){var t=[];return function(e,r){return t[e]=r,t.filter(Boolean).join("\n")}}();function g(t,e,r,n){var i=r?"":n.css;if(t.styleSheet)t.styleSheet.cssText=b(e,i);else{var o=document.createTextNode(i),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(o,a[e]):t.appendChild(o)}}function k(t,e){var r=e.css,n=e.media,i=e.sourceMap;if(n&&t.setAttribute("media",n),d.ssrId&&t.setAttribute(h,e.id),i&&(r+="\n/*# sourceURL="+i.sources[0]+" */",r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */"),t.styleSheet)t.styleSheet.cssText=r;else{while(t.firstChild)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(r))}}},927:function(e){"use strict";e.exports=t}},r={};function n(t){var i=r[t];if(void 0!==i)return i.exports;var o=r[t]={id:t,exports:{}};return e[t].call(o.exports,o,o.exports,n),o.exports}!function(){n.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return n.d(e,{a:e}),e}}(),function(){n.d=function(t,e){for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})}}(),function(){n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}}(),function(){n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}}(),function(){n.p=""}();var i={};return function(){"use strict";if(n.d(i,{default:function(){return St}}),"undefined"!==typeof window){var t=window.document.currentScript,e=n(388);t=e(),"currentScript"in document||Object.defineProperty(document,"currentScript",{get:e});var r=t&&t.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);r&&(n.p=r[1])}var o=n(927);function a(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}var s={key:0,class:"vue-slider-marks"};function l(t,e,r,n,i,l){var u=(0,o.resolveComponent)("vue-slider-mark"),c=(0,o.resolveComponent)("vue-slider-dot");return(0,o.openBlock)(),(0,o.createElementBlock)("div",(0,o.mergeProps)({ref:"container",class:t.containerClasses,style:t.containerStyles,onClick:e[2]||(e[2]=function(){return t.clickHandle&&t.clickHandle.apply(t,arguments)}),onTouchstartPassive:e[3]||(e[3]=function(){return t.dragStartOnProcess&&t.dragStartOnProcess.apply(t,arguments)}),onMousedownPassive:e[4]||(e[4]=function(){return t.dragStartOnProcess&&t.dragStartOnProcess.apply(t,arguments)})},t.$attrs),[(0,o.createElementVNode)("div",{class:"vue-slider-rail",style:(0,o.normalizeStyle)(t.railStyle)},[((0,o.openBlock)(!0),(0,o.createElementBlock)(o.Fragment,null,(0,o.renderList)(t.processArray,(function(e,r){return(0,o.renderSlot)(t.$slots,"process",(0,o.normalizeProps)((0,o.guardReactiveProps)(e)),(function(){return[((0,o.openBlock)(),(0,o.createElementBlock)("div",{class:"vue-slider-process",key:"process-".concat(r),style:(0,o.normalizeStyle)(e.style)},null,4))]}))})),256)),t.sliderMarks&&t.control?((0,o.openBlock)(),(0,o.createElementBlock)("div",s,[((0,o.openBlock)(!0),(0,o.createElementBlock)(o.Fragment,null,(0,o.renderList)(t.control.markList,(function(r,n){return(0,o.renderSlot)(t.$slots,"mark",(0,o.normalizeProps)((0,o.guardReactiveProps)(r)),(function(){var i;return[((0,o.openBlock)(),(0,o.createBlock)(u,{key:"mark-".concat(n),mark:r,hideLabel:t.hideLabel,style:(0,o.normalizeStyle)((i={},a(i,t.isHorizontal?"height":"width","100%"),a(i,t.isHorizontal?"width":"height",t.tailSize),a(i,t.mainDirection,"".concat(r.pos,"%")),i)),stepStyle:t.stepStyle,stepActiveStyle:t.stepActiveStyle,labelStyle:t.labelStyle,labelActiveStyle:t.labelActiveStyle,onPressLabel:e[0]||(e[0]=function(e){return t.clickable&&t.setValueByPos(e)})},{step:(0,o.withCtx)((function(){return[(0,o.renderSlot)(t.$slots,"step",(0,o.normalizeProps)((0,o.guardReactiveProps)(r)))]})),label:(0,o.withCtx)((function(){return[(0,o.renderSlot)(t.$slots,"label",(0,o.normalizeProps)((0,o.guardReactiveProps)(r)))]})),_:2},1032,["mark","hideLabel","style","stepStyle","stepActiveStyle","labelStyle","labelActiveStyle"]))]}))})),256))])):(0,o.createCommentVNode)("",!0),((0,o.openBlock)(!0),(0,o.createElementBlock)(o.Fragment,null,(0,o.renderList)(t.dots,(function(r,n){var i;return(0,o.openBlock)(),(0,o.createBlock)(c,(0,o.mergeProps)({ref_for:!0,ref:"dot-".concat(n),key:"dot-".concat(n),value:r.value,disabled:r.disabled,focus:r.focus,"dot-style":[r.style,r.disabled?r.disabledStyle:null,r.focus?r.focusStyle:null],tooltip:r.tooltip||t.tooltip,"tooltip-style":[t.tooltipStyle,r.tooltipStyle,r.disabled?r.tooltipDisabledStyle:null,r.focus?r.tooltipFocusStyle:null],"tooltip-formatter":Array.isArray(t.sliderTooltipFormatter)?t.sliderTooltipFormatter[n]:t.sliderTooltipFormatter,"tooltip-placement":t.tooltipDirections[n],style:[t.dotBaseStyle,(i={},a(i,t.mainDirection,"".concat(r.pos,"%")),a(i,"transition","".concat(t.mainDirection," ").concat(t.animateTime,"s")),i)],onDragStart:function(){return t.dragStart(n)},role:"slider","aria-valuenow":r.value,"aria-valuemin":t.min,"aria-valuemax":t.max,"aria-orientation":t.isHorizontal?"horizontal":"vertical",tabindex:"0",onFocus:function(){return t.focus(r,n)},onBlur:e[1]||(e[1]=function(){return t.blur()})},t.dotAttrs),{dot:(0,o.withCtx)((function(){return[(0,o.renderSlot)(t.$slots,"dot",(0,o.normalizeProps)((0,o.guardReactiveProps)(r)))]})),tooltip:(0,o.withCtx)((function(){return[(0,o.renderSlot)(t.$slots,"tooltip",(0,o.normalizeProps)((0,o.guardReactiveProps)(r)))]})),_:2},1040,["value","disabled","focus","dot-style","tooltip","tooltip-style","tooltip-formatter","tooltip-placement","style","onDragStart","aria-valuenow","aria-valuemin","aria-valuemax","aria-orientation","onFocus"])})),128))],4),(0,o.renderSlot)(t.$slots,"default",{value:t.getValue()})],16)}var u=["aria-valuetext"],c={class:"vue-slider-dot-tooltip-text"};function d(t,e,r,n,i,a){var s;return(0,o.openBlock)(),(0,o.createElementBlock)("div",{ref:"dot",class:(0,o.normalizeClass)(t.dotClasses),"aria-valuetext":null===(s=t.tooltipValue)||void 0===s?void 0:s.toString(),onMousedownPassive:e[0]||(e[0]=function(){return t.dragStart&&t.dragStart.apply(t,arguments)}),onTouchstartPassive:e[1]||(e[1]=function(){return t.dragStart&&t.dragStart.apply(t,arguments)})},[(0,o.renderSlot)(t.$slots,"dot",{},(function(){return[(0,o.createElementVNode)("div",{class:(0,o.normalizeClass)(t.handleClasses),style:(0,o.normalizeStyle)(t.dotStyle)},null,6)]})),"none"!==t.tooltip?((0,o.openBlock)(),(0,o.createElementBlock)("div",{key:0,class:(0,o.normalizeClass)(t.tooltipClasses)},[(0,o.renderSlot)(t.$slots,"tooltip",{},(function(){return[(0,o.createElementVNode)("div",{class:(0,o.normalizeClass)(t.tooltipInnerClasses),style:(0,o.normalizeStyle)(t.tooltipStyle)},[(0,o.createElementVNode)("span",c,(0,o.toDisplayString)(t.tooltipValue),1)],6)]}))],2)):(0,o.createCommentVNode)("",!0)],42,u)}n(466);var h=(0,o.defineComponent)({name:"VueSliderDot",emits:["drag-start"],props:{value:{type:[String,Number],default:0},tooltip:{type:String,required:!0},tooltipPlacement:{type:String,validator:function(t){return["top","right","bottom","left"].indexOf(t)>-1},required:!0},tooltipFormatter:{type:[String,Function]},focus:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},dotStyle:{type:Object},tooltipStyle:{type:Object}},computed:{dotClasses:function(){return["vue-slider-dot",{"vue-slider-dot-hover":"hover"===this.tooltip||"active"===this.tooltip,"vue-slider-dot-disabled":this.disabled,"vue-slider-dot-focus":this.focus}]},handleClasses:function(){return["vue-slider-dot-handle",{"vue-slider-dot-handle-disabled":this.disabled,"vue-slider-dot-handle-focus":this.focus}]},tooltipClasses:function(){return["vue-slider-dot-tooltip",["vue-slider-dot-tooltip-".concat(this.tooltipPlacement)],{"vue-slider-dot-tooltip-show":this.showTooltip}]},tooltipInnerClasses:function(){return["vue-slider-dot-tooltip-inner",["vue-slider-dot-tooltip-inner-".concat(this.tooltipPlacement)],{"vue-slider-dot-tooltip-inner-disabled":this.disabled,"vue-slider-dot-tooltip-inner-focus":this.focus}]},showTooltip:function(){switch(this.tooltip){case"always":return!0;case"none":return!1;case"focus":case"active":return!!this.focus;default:return!1}},tooltipValue:function(){return this.tooltipFormatter?"string"===typeof this.tooltipFormatter?this.tooltipFormatter.replace(/\{value\}/,String(this.value)):this.tooltipFormatter(this.value):this.value}},methods:{dragStart:function(){if(this.disabled)return!1;this.$emit("drag-start")}}}),f=n(831);const p=(0,f.Z)(h,[["render",d]]);var m=p;function v(t,e,r,n,i,a){return(0,o.openBlock)(),(0,o.createElementBlock)("div",{class:(0,o.normalizeClass)(t.marksClasses)},[(0,o.renderSlot)(t.$slots,"step",{},(function(){return[(0,o.createElementVNode)("div",{class:(0,o.normalizeClass)(t.stepClasses),style:(0,o.normalizeStyle)([t.stepStyle,t.mark.style||{},t.mark.active&&t.stepActiveStyle?t.stepActiveStyle:{},t.mark.active&&t.mark.activeStyle?t.mark.activeStyle:{}])},null,6)]})),t.hideLabel?(0,o.createCommentVNode)("",!0):(0,o.renderSlot)(t.$slots,"label",{key:0},(function(){return[(0,o.createElementVNode)("div",{class:(0,o.normalizeClass)(t.labelClasses),style:(0,o.normalizeStyle)([t.labelStyle,t.mark.labelStyle||{},t.mark.active&&t.labelActiveStyle?t.labelActiveStyle:{},t.mark.active&&t.mark.labelActiveStyle?t.mark.labelActiveStyle:{}]),onClick:e[0]||(e[0]=function(){return t.labelClickHandle&&t.labelClickHandle.apply(t,arguments)})},(0,o.toDisplayString)(t.mark.label),7)]}))],2)}n(18);var y=(0,o.defineComponent)({name:"VueSliderMark",emits:["press-label"],props:{mark:{type:Object,required:!0},hideLabel:{type:Boolean},stepStyle:{type:Object,default:function(){return{}}},stepActiveStyle:{type:Object,default:function(){return{}}},labelStyle:{type:Object,default:function(){return{}}},labelActiveStyle:{type:Object,default:function(){return{}}}},computed:{marksClasses:function(){return["vue-slider-mark",{"vue-slider-mark-active":this.mark.active}]},stepClasses:function(){return["vue-slider-mark-step",{"vue-slider-mark-step-active":this.mark.active}]},labelClasses:function(){return["vue-slider-mark-label",{"vue-slider-mark-label-active":this.mark.active}]}},methods:{labelClickHandle:function(t){t.stopPropagation(),this.$emit("press-label",this.mark.pos)}}});const b=(0,f.Z)(y,[["render",v]]);var g,k=b,S=function(t){return"number"===typeof t?"".concat(t,"px"):t},x=function(t){var e=document.documentElement,r=document.body,n=t.getBoundingClientRect(),i={y:n.top+(window.pageYOffset||e.scrollTop)-(e.clientTop||r.clientTop||0),x:n.left+(window.pageXOffset||e.scrollLeft)-(e.clientLeft||r.clientLeft||0)};return i},P=function(t,e,r){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1,i="targetTouches"in t?t.targetTouches[0]:t,o=x(e),a={x:i.pageX-o.x,y:i.pageY-o.y};return{x:r?e.offsetWidth*n-a.x:a.x,y:r?e.offsetHeight*n-a.y:a.y}};(function(t){t[t["PAGE_UP"]=33]="PAGE_UP",t[t["PAGE_DOWN"]=34]="PAGE_DOWN",t[t["END"]=35]="END",t[t["HOME"]=36]="HOME",t[t["LEFT"]=37]="LEFT",t[t["UP"]=38]="UP",t[t["RIGHT"]=39]="RIGHT",t[t["DOWN"]=40]="DOWN"})(g||(g={}));var w=function(t,e){if(e.hook){var r=e.hook(t);if("function"===typeof r)return r;if(!r)return null}switch(t.keyCode){case g.UP:return function(t){return"ttb"===e.direction?t-1:t+1};case g.RIGHT:return function(t){return"rtl"===e.direction?t-1:t+1};case g.DOWN:return function(t){return"ttb"===e.direction?t+1:t-1};case g.LEFT:return function(t){return"rtl"===e.direction?t+1:t-1};case g.END:return function(){return e.max};case g.HOME:return function(){return e.min};case g.PAGE_UP:return function(t){return t+10};case g.PAGE_DOWN:return function(t){return t-10};default:return null}};function O(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function D(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function E(t,e,r){return e&&D(t.prototype,e),r&&D(t,r),Object.defineProperty(t,"prototype",{writable:!1}),t}function R(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}var A,V,j=function(){function t(e){O(this,t),R(this,"num",void 0),this.num=e}return E(t,[{key:"decimal",value:function(t,e){var r=this.num,n=this.getDecimalLen(r),i=this.getDecimalLen(t),o=0;switch(e){case"+":o=this.getExponent(n,i),this.num=(this.safeRoundUp(r,o)+this.safeRoundUp(t,o))/o;break;case"-":o=this.getExponent(n,i),this.num=(this.safeRoundUp(r,o)-this.safeRoundUp(t,o))/o;break;case"*":this.num=this.safeRoundUp(this.safeRoundUp(r,this.getExponent(n)),this.safeRoundUp(t,this.getExponent(i)))/this.getExponent(n+i);break;case"/":o=this.getExponent(n,i),this.num=this.safeRoundUp(r,o)/this.safeRoundUp(t,o);break;case"%":o=this.getExponent(n,i),this.num=this.safeRoundUp(r,o)%this.safeRoundUp(t,o)/o;break}return this}},{key:"plus",value:function(t){return this.decimal(t,"+")}},{key:"minus",value:function(t){return this.decimal(t,"-")}},{key:"multiply",value:function(t){return this.decimal(t,"*")}},{key:"divide",value:function(t){return this.decimal(t,"/")}},{key:"remainder",value:function(t){return this.decimal(t,"%")}},{key:"toNumber",value:function(){return this.num}},{key:"getDecimalLen",value:function(t){var e="".concat(t).split("e");return("".concat(e[0]).split(".")[1]||"").length-(e[1]?+e[1]:0)}},{key:"getExponent",value:function(t,e){return Math.pow(10,void 0!==e?Math.max(t,e):t)}},{key:"safeRoundUp",value:function(t,e){return Math.round(t*e)}}]),t}();function C(t,e){return L(t)||M(t,e)||H(t,e)||B()}function B(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function M(t,e){var r=null==t?null:"undefined"!==typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,i,o=[],a=!0,s=!1;try{for(r=r.call(t);!(a=(n=r.next()).done);a=!0)if(o.push(n.value),e&&o.length===e)break}catch(l){s=!0,i=l}finally{try{a||null==r["return"]||r["return"]()}finally{if(s)throw i}}return o}}function L(t){if(Array.isArray(t))return t}function N(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function z(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?N(Object(r),!0).forEach((function(e){X(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):N(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function I(t){return $(t)||F(t)||H(t)||T()}function T(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function H(t,e){if(t){if("string"===typeof t)return U(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?U(t,e):void 0}}function F(t){if("undefined"!==typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}function $(t){if(Array.isArray(t))return U(t)}function U(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function _(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function W(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function G(t,e,r){return e&&W(t.prototype,e),r&&W(t,r),Object.defineProperty(t,"prototype",{writable:!1}),t}function X(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}(function(t){t[t["VALUE"]=1]="VALUE",t[t["INTERVAL"]=2]="INTERVAL",t[t["MIN"]=3]="MIN",t[t["MAX"]=4]="MAX",t[t["ORDER"]=5]="ORDER"})(V||(V={}));var q=(A={},X(A,V.VALUE,'The type of the "value" is illegal'),X(A,V.INTERVAL,'The prop "interval" is invalid, "(max - min)" must be divisible by "interval"'),X(A,V.MIN,'The "value" must be greater than or equal to the "min".'),X(A,V.MAX,'The "value" must be less than or equal to the "max".'),X(A,V.ORDER,'When "order" is false, the parameters "minRange", "maxRange", "fixed", "enabled" are invalid.'),A),Z=function(){function t(e){_(this,t),X(this,"dotsPos",[]),X(this,"dotsValue",[]),X(this,"data",void 0),X(this,"enableCross",void 0),X(this,"fixed",void 0),X(this,"max",void 0),X(this,"min",void 0),X(this,"interval",void 0),X(this,"minRange",void 0),X(this,"maxRange",void 0),X(this,"order",void 0),X(this,"marks",void 0),X(this,"included",void 0),X(this,"process",void 0),X(this,"adsorb",void 0),X(this,"dotOptions",void 0),X(this,"onError",void 0),X(this,"cacheRangeDir",{}),this.data=e.data,this.max=e.max,this.min=e.min,this.interval=e.interval,this.order=e.order,this.marks=e.marks,this.included=e.included,this.process=e.process,this.adsorb=e.adsorb,this.dotOptions=e.dotOptions,this.onError=e.onError,this.order?(this.minRange=e.minRange||0,this.maxRange=e.maxRange||0,this.enableCross=e.enableCross,this.fixed=e.fixed):((e.minRange||e.maxRange||!e.enableCross||e.fixed)&&this.emitError(V.ORDER),this.minRange=0,this.maxRange=0,this.enableCross=!0,this.fixed=!1),this.setValue(e.value)}return G(t,[{key:"setValue",value:function(t){this.setDotsValue(Array.isArray(t)?I(t):[t],!0)}},{key:"setDotsValue",value:function(t,e){this.dotsValue=t,e&&this.syncDotsPos()}},{key:"setDotsPos",value:function(t){var e=this,r=this.order?I(t).sort((function(t,e){return t-e})):t;this.dotsPos=r,this.setDotsValue(r.map((function(t){return e.getValueByPos(t)})),this.adsorb)}},{key:"getValueByPos",value:function(t){var e=this.parsePos(t);if(this.included){var r=100;this.markList.forEach((function(n){var i=Math.abs(n.pos-t);i<r&&(r=i,e=n.value)}))}return e}},{key:"syncDotsPos",value:function(){var t=this;this.dotsPos=this.dotsValue.map((function(e){return t.parseValue(e)}))}},{key:"markList",get:function(){var t=this;if(!this.marks)return[];var e=function(e,r){var n=t.parseValue(e);return z({pos:n,value:e,label:e,active:t.isActiveByPos(n)},r)};return!0===this.marks?this.getValues().map((function(t){return e(t)})):"[object Object]"===Object.prototype.toString.call(this.marks)?Object.keys(this.marks).sort((function(t,e){return+t-+e})).map((function(r){var n=t.marks[r];return e(r,"string"!==typeof n?n:{label:n})})):Array.isArray(this.marks)?this.marks.map((function(t){return e(t)})):"function"===typeof this.marks?this.getValues().map((function(e){return{value:e,result:t.marks(e)}})).filter((function(t){var e=t.result;return!!e})).map((function(t){var r=t.value,n=t.result;return e(r,n)})):[]}},{key:"getRecentDot",value:function(t){var e=this.dotsPos.map((function(e){return Math.abs(e-t)}));return e.indexOf(Math.min.apply(Math,I(e)))}},{key:"getIndexByValue",value:function(t){return this.data?this.data.indexOf(t):new j(+t).minus(this.min).divide(this.interval).toNumber()}},{key:"getValueByIndex",value:function(t){return t<0?t=0:t>this.total&&(t=this.total),this.data?this.data[t]:new j(t).multiply(this.interval).plus(this.min).toNumber()}},{key:"setDotPos",value:function(t,e){t=this.getValidPos(t,e).pos;var r=t-this.dotsPos[e];if(r){var n=new Array(this.dotsPos.length);this.fixed?n=this.getFixedChangePosArr(r,e):this.minRange||this.maxRange?n=this.getLimitRangeChangePosArr(t,r,e):n[e]=r,this.setDotsPos(this.dotsPos.map((function(t,e){return t+(n[e]||0)})))}}},{key:"getFixedChangePosArr",value:function(t,e){var r=this;return this.dotsPos.forEach((function(n,i){if(i!==e){var o=r.getValidPos(n+t,i),a=o.pos,s=o.inRange;s||(t=Math.min(Math.abs(a-n),Math.abs(t))*(t<0?-1:1))}})),this.dotsPos.map((function(e){return t}))}},{key:"getLimitRangeChangePosArr",value:function(t,e,r){var n=this,i=[{index:r,changePos:e}],o=e;return[this.minRange,this.maxRange].forEach((function(a,s){if(!a)return!1;var l=0===s,u=e>0,c=0;c=l?u?1:-1:u?-1:1;var d=function(t,e){var r=Math.abs(t-e);return l?r<n.minRangeDir:r>n.maxRangeDir},h=r+c,f=n.dotsPos[h],p=t;while(n.isPos(f)&&d(f,p)){var m=n.getValidPos(f+o,h),v=m.pos;i.push({index:h,changePos:v-f}),h+=c,p=v,f=n.dotsPos[h]}})),this.dotsPos.map((function(t,e){var r=i.filter((function(t){return t.index===e}));return r.length?r[0].changePos:0}))}},{key:"isPos",value:function(t){return"number"===typeof t}},{key:"getValidPos",value:function(t,e){var r=this.valuePosRange[e],n=!0;return t<r[0]?(t=r[0],n=!1):t>r[1]&&(t=r[1],n=!1),{pos:t,inRange:n}}},{key:"parseValue",value:function(t){if(this.data)t=this.data.indexOf(t);else if("number"===typeof t||"string"===typeof t){if(t=+t,t<this.min)return this.emitError(V.MIN),0;if(t>this.max)return this.emitError(V.MAX),0;if("number"!==typeof t||t!==t)return this.emitError(V.VALUE),0;t=new j(t).minus(this.min).divide(this.interval).toNumber()}var e=new j(t).multiply(this.gap).toNumber();return e<0?0:e>100?100:e}},{key:"parsePos",value:function(t){var e=Math.round(t/this.gap);return this.getValueByIndex(e)}},{key:"isActiveByPos",value:function(t){return this.processArray.some((function(e){var r=C(e,2),n=r[0],i=r[1];return t>=n&&t<=i}))}},{key:"getValues",value:function(){if(this.data)return this.data;for(var t=[],e=0;e<=this.total;e++)t.push(new j(e).multiply(this.interval).plus(this.min).toNumber());return t}},{key:"getRangeDir",value:function(t){return t?new j(t).divide(new j(this.data?this.data.length-1:this.max).minus(this.data?0:this.min).toNumber()).multiply(100).toNumber():100}},{key:"emitError",value:function(t){this.onError&&this.onError(t,q[t])}},{key:"processArray",get:function(){if(this.process){if("function"===typeof this.process)return this.process(this.dotsPos);if(1===this.dotsPos.length)return[[0,this.dotsPos[0]]];if(this.dotsPos.length>1)return[[Math.min.apply(Math,I(this.dotsPos)),Math.max.apply(Math,I(this.dotsPos))]]}return[]}},{key:"total",get:function(){var t=0;return t=this.data?this.data.length-1:new j(this.max).minus(this.min).divide(this.interval).toNumber(),t-Math.floor(t)!==0?(this.emitError(V.INTERVAL),0):t}},{key:"gap",get:function(){return 100/this.total}},{key:"minRangeDir",get:function(){return this.cacheRangeDir[this.minRange]?this.cacheRangeDir[this.minRange]:this.cacheRangeDir[this.minRange]=this.getRangeDir(this.minRange)}},{key:"maxRangeDir",get:function(){return this.cacheRangeDir[this.maxRange]?this.cacheRangeDir[this.maxRange]:this.cacheRangeDir[this.maxRange]=this.getRangeDir(this.maxRange)}},{key:"getDotRange",value:function(t,e,r){if(!this.dotOptions)return r;var n=Array.isArray(this.dotOptions)?this.dotOptions[t]:this.dotOptions;return n&&void 0!==n[e]?this.parseValue(n[e]):r}},{key:"valuePosRange",get:function(){var t=this,e=this.dotsPos,r=[];return e.forEach((function(n,i){r.push([Math.max(t.minRange?t.minRangeDir*i:0,t.enableCross?0:e[i-1]||0,t.getDotRange(i,"min",0)),Math.min(t.minRange?100-t.minRangeDir*(e.length-1-i):100,t.enableCross?100:e[i+1]||100,t.getDotRange(i,"max",100))])})),r}},{key:"dotsIndex",get:function(){var t=this;return this.dotsValue.map((function(e){return t.getIndexByValue(e)}))}}]),t}();function Y(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function K(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function J(t,e,r){return e&&K(t.prototype,e),r&&K(t,r),Object.defineProperty(t,"prototype",{writable:!1}),t}function Q(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}var tt=function(){function t(e){Y(this,t),Q(this,"map",void 0),Q(this,"states",0),this.map=e}return J(t,[{key:"add",value:function(t){this.states|=t}},{key:"delete",value:function(t){this.states&=~t}},{key:"toggle",value:function(t){this.has(t)?this.delete(t):this.add(t)}},{key:"has",value:function(t){return!!(this.states&t)}}]),t}();n(631);function et(t){return it(t)||nt(t)||dt(t)||rt()}function rt(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function nt(t){if("undefined"!==typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}function it(t){if(Array.isArray(t))return ht(t)}function ot(t){return ot="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},ot(t)}function at(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function st(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?at(Object(r),!0).forEach((function(e){lt(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):at(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function lt(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function ut(t,e){return pt(t)||ft(t,e)||dt(t,e)||ct()}function ct(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function dt(t,e){if(t){if("string"===typeof t)return ht(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?ht(t,e):void 0}}function ht(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function ft(t,e){var r=null==t?null:"undefined"!==typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,i,o=[],a=!0,s=!1;try{for(r=r.call(t);!(a=(n=r.next()).done);a=!0)if(o.push(n.value),e&&o.length===e)break}catch(l){s=!0,i=l}finally{try{a||null==r["return"]||r["return"]()}finally{if(s)throw i}}return o}}function pt(t){if(Array.isArray(t))return t}var mt={None:0,Drag:2,Focus:4},vt=4,yt=(0,o.defineComponent)({name:"VueSlider",components:{VueSliderDot:m,VueSliderMark:k},emits:["change","drag-start","dragging","drag-end","error","update:modelValue"],data:function(){return{control:null,states:new tt(mt),scale:1,focusDotIndex:0}},props:{modelValue:{type:[Number,String,Array],default:0},silent:{type:Boolean,default:!1},direction:{type:String,default:"ltr",validator:function(t){return["ltr","rtl","ttb","btt"].indexOf(t)>-1}},width:{type:[Number,String]},height:{type:[Number,String]},dotSize:{type:[Number,Array],default:14},contained:{type:Boolean,default:!1},min:{type:Number,default:0},max:{type:Number,default:100},interval:{type:Number,default:1},disabled:{type:Boolean,default:!1},clickable:{type:Boolean,default:!0},dragOnClick:{type:Boolean,default:!1},duration:{type:Number,default:.5},data:{type:[Object,Array]},dataValue:{type:String,default:"value"},dataLabel:{type:String,default:"label"},lazy:{type:Boolean,default:!1},tooltip:{type:String,default:"active",validator:function(t){return["none","always","focus","hover","active"].indexOf(t)>-1}},tooltipPlacement:{type:[String,Array],validator:function(t){return(Array.isArray(t)?t:[t]).every((function(t){return["top","right","bottom","left"].indexOf(t)>-1}))}},tooltipFormatter:{type:[String,Array,Function]},useKeyboard:{type:Boolean,default:!0},keydownHook:{type:Function},enableCross:{type:Boolean,default:!0},fixed:{type:Boolean,default:!1},order:{type:Boolean,default:!0},minRange:{type:Number},maxRange:{type:Number},marks:{type:[Boolean,Object,Array,Function],default:!1},process:{type:[Boolean,Function],default:!0},zoom:{type:Number},included:{type:Boolean},adsorb:{type:Boolean},hideLabel:{type:Boolean},dotOptions:{type:[Object,Array]},dotAttrs:{type:Object},railStyle:{type:Object},processStyle:{type:Object},dotStyle:{type:Object},tooltipStyle:{type:Object},stepStyle:{type:Object},stepActiveStyle:{type:Object},labelStyle:{type:Object},labelActiveStyle:{type:Object}},computed:{isHorizontal:function(){return"ltr"===this.direction||"rtl"===this.direction},isReverse:function(){return"rtl"===this.direction||"btt"===this.direction},tailSize:function(){return S((this.isHorizontal?this.height:this.width)||vt)},containerClasses:function(){return["vue-slider",["vue-slider-".concat(this.direction)],{"vue-slider-disabled":this.disabled}]},containerStyles:function(){var t=Array.isArray(this.dotSize)?this.dotSize:[this.dotSize,this.dotSize],e=ut(t,2),r=e[0],n=e[1],i=this.width?S(this.width):this.isHorizontal?"auto":S(vt),o=this.height?S(this.height):this.isHorizontal?S(vt):"auto";return{padding:this.contained?"".concat(n/2,"px ").concat(r/2,"px"):this.isHorizontal?"".concat(n/2,"px 0"):"0 ".concat(r/2,"px"),width:i,height:o}},processArray:function(){var t=this;return this.control.processArray.map((function(e,r){var n,i=ut(e,3),o=i[0],a=i[1],s=i[2];if(o>a){var l=[a,o];o=l[0],a=l[1]}var u=t.isHorizontal?"width":"height";return{start:o,end:a,index:r,style:st(st((n={},lt(n,t.isHorizontal?"height":"width","100%"),lt(n,t.isHorizontal?"top":"left",0),lt(n,t.mainDirection,"".concat(o,"%")),lt(n,u,"".concat(a-o,"%")),lt(n,"transitionProperty","".concat(u,",").concat(t.mainDirection)),lt(n,"transitionDuration","".concat(t.animateTime,"s")),n),t.processStyle),s)}}))},dotBaseStyle:function(){var t,e=Array.isArray(this.dotSize)?this.dotSize:[this.dotSize,this.dotSize],r=ut(e,2),n=r[0],i=r[1];return t=this.isHorizontal?lt({transform:"translate(".concat(this.isReverse?"50%":"-50%",", -50%)"),WebkitTransform:"translate(".concat(this.isReverse?"50%":"-50%",", -50%)"),top:"50%"},"ltr"===this.direction?"left":"right","0"):lt({transform:"translate(-50%, ".concat(this.isReverse?"50%":"-50%",")"),WebkitTransform:"translate(-50%, ".concat(this.isReverse?"50%":"-50%",")"),left:"50%"},"btt"===this.direction?"bottom":"top","0"),st({width:"".concat(n,"px"),height:"".concat(i,"px")},t)},mainDirection:function(){switch(this.direction){case"ltr":return"left";case"rtl":return"right";case"btt":return"bottom";case"ttb":return"top";default:return"left"}},tooltipDirections:function(){var t=this.tooltipPlacement||(this.isHorizontal?"top":"left");return Array.isArray(t)?t:this.dots.map((function(){return t}))},dots:function(){var t=this;return this.control.dotsPos.map((function(e,r){return st({pos:e,index:r,value:t.control.dotsValue[r],focus:t.states.has(mt.Focus)&&t.focusDotIndex===r,disabled:t.disabled,style:t.dotStyle},(Array.isArray(t.dotOptions)?t.dotOptions[r]:t.dotOptions)||{})}))},animateTime:function(){return this.states.has(mt.Drag)?0:this.duration},canSort:function(){return this.order&&!this.minRange&&!this.maxRange&&!this.fixed&&this.enableCross},sliderData:function(){var t=this;return this.isObjectArrayData(this.data)?this.data.map((function(e){return e[t.dataValue]})):this.isObjectData(this.data)?Object.keys(this.data):this.data},sliderMarks:function(){var t=this;return this.marks?this.marks:this.isObjectArrayData(this.data)?function(e){var r={label:e};return t.data.some((function(n){return n[t.dataValue]===e&&(r.label=n[t.dataLabel],!0)})),r}:this.isObjectData(this.data)?this.data:void 0},sliderTooltipFormatter:function(){var t=this;if(this.tooltipFormatter)return this.tooltipFormatter;if(this.isObjectArrayData(this.data))return function(e){var r=""+e;return t.data.some((function(n){return n[t.dataValue]===e&&(r=n[t.dataLabel],!0)})),r};if(this.isObjectData(this.data)){var e=this.data;return function(t){return e[t]}}},isNotSync:function(){var t=this.control.dotsValue;return Array.isArray(this.modelValue)?this.modelValue.length!==t.length||this.modelValue.some((function(e,r){return e!==t[r]})):this.modelValue!==t[0]},dragRange:function(){var t=this.dots[this.focusDotIndex-1],e=this.dots[this.focusDotIndex+1];return[t?t.pos:-1/0,e?e.pos:1/0]}},watch:{modelValue:function(){this.control&&!this.states.has(mt.Drag)&&this.isNotSync&&this.control.setValue(this.modelValue)}},methods:{isObjectData:function(t){return!!t&&"[object Object]"===Object.prototype.toString.call(t)},isObjectArrayData:function(t){return!!t&&Array.isArray(t)&&t.length>0&&"object"===ot(t[0])},bindEvent:function(){document.addEventListener("touchmove",this.dragMove,{passive:!1}),document.addEventListener("touchend",this.dragEnd,{passive:!1}),document.addEventListener("mousedown",this.blurHandle),document.addEventListener("mousemove",this.dragMove),document.addEventListener("mouseup",this.dragEnd),document.addEventListener("mouseleave",this.dragEnd),document.addEventListener("keydown",this.keydownHandle)},unbindEvent:function(){document.removeEventListener("touchmove",this.dragMove),document.removeEventListener("touchend",this.dragEnd),document.removeEventListener("mousedown",this.blurHandle),document.removeEventListener("mousemove",this.dragMove),document.removeEventListener("mouseup",this.dragEnd),document.removeEventListener("mouseleave",this.dragEnd),document.removeEventListener("keydown",this.keydownHandle)},setScale:function(){this.scale=new j(Math.floor(this.isHorizontal?this.$el.offsetWidth:this.$el.offsetHeight)).multiply(this.zoom||1).divide(100).toNumber()},initControl:function(){var t=this;this.control=new Z({value:this.modelValue,data:this.sliderData,enableCross:this.enableCross,fixed:this.fixed,max:this.max,min:this.min,interval:this.interval,minRange:this.minRange,maxRange:this.maxRange,order:this.order,marks:this.sliderMarks,included:this.included,process:this.process,adsorb:this.adsorb,dotOptions:this.dotOptions,onError:this.emitError}),["data","enableCross","fixed","max","min","interval","minRange","maxRange","order","marks","process","adsorb","included","dotOptions"].forEach((function(e){t.$watch(e,(function(r){if("data"===e&&Array.isArray(t.control.data)&&Array.isArray(r)&&t.control.data.length===r.length&&r.every((function(e,r){return e===t.control.data[r]})))return!1;switch(e){case"data":case"dataLabel":case"dataValue":t.control.data=t.sliderData;break;case"mark":t.control.marks=t.sliderMarks;break;default:t.control[e]=r}["data","max","min","interval"].indexOf(e)>-1&&t.control.syncDotsPos()}))}))},syncValueByPos:function(){var t=this.control.dotsValue;if(this.isDiff(t,Array.isArray(this.modelValue)?this.modelValue:[this.modelValue])){var e=1===t.length?t[0]:et(t);this.$emit("change",e,this.focusDotIndex),this.$emit("update:modelValue",e)}},isDiff:function(t,e){return t.length!==e.length||t.some((function(t,r){return t!==e[r]}))},emitError:function(t,e){this.silent||console.error("[VueSlider error]: ".concat(e)),this.$emit("error",t,e)},dragStartOnProcess:function(t){if(this.dragOnClick){this.setScale();var e=this.getPosByEvent(t),r=this.control.getRecentDot(e);if(this.dots[r].disabled)return;this.dragStart(r),this.control.setDotPos(e,this.focusDotIndex),this.lazy||this.syncValueByPos()}},dragStart:function(t){this.focusDotIndex=t,this.setScale(),this.states.add(mt.Drag),this.states.add(mt.Focus),this.$emit("drag-start",this.focusDotIndex)},dragMove:function(t){if(!this.states.has(mt.Drag))return!1;t.preventDefault();var e=this.getPosByEvent(t);this.isCrossDot(e),this.control.setDotPos(e,this.focusDotIndex),this.lazy||this.syncValueByPos();var r=this.control.dotsValue;this.$emit("dragging",1===r.length?r[0]:et(r),this.focusDotIndex)},isCrossDot:function(t){if(this.canSort){var e=this.focusDotIndex,r=t;if(r>this.dragRange[1]?(r=this.dragRange[1],this.focusDotIndex++):r<this.dragRange[0]&&(r=this.dragRange[0],this.focusDotIndex--),e!==this.focusDotIndex){var n=this.$refs["dot-".concat(this.focusDotIndex)];n&&n.$el&&n.$el.focus(),this.control.setDotPos(r,e)}}},dragEnd:function(t){var e=this;if(!this.states.has(mt.Drag))return!1;setTimeout((function(){e.lazy&&e.syncValueByPos(),e.included&&e.isNotSync?e.control.setValue(e.modelValue):e.control.syncDotsPos(),e.states.delete(mt.Drag),e.useKeyboard&&!("targetTouches"in t)||e.states.delete(mt.Focus),e.$emit("drag-end",e.focusDotIndex)}))},blurHandle:function(t){if(!this.states.has(mt.Focus)||!this.$refs.container||this.$refs.container.contains(t.target))return!1;this.states.delete(mt.Focus)},clickHandle:function(t){if(!this.clickable||this.disabled)return!1;if(!this.states.has(mt.Drag)){this.setScale();var e=this.getPosByEvent(t);this.setValueByPos(e)}},focus:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;t.disabled||(this.states.add(mt.Focus),this.focusDotIndex=e)},blur:function(){this.states.delete(mt.Focus)},getValue:function(){var t=this.control.dotsValue;return 1===t.length?t[0]:t},getIndex:function(){var t=this.control.dotsIndex;return 1===t.length?t[0]:t},setValue:function(t){this.control.setValue(Array.isArray(t)?et(t):[t]),this.syncValueByPos()},setIndex:function(t){var e=this,r=Array.isArray(t)?t.map((function(t){return e.control.getValueByIndex(t)})):this.control.getValueByIndex(t);this.setValue(r)},setValueByPos:function(t){var e=this,r=this.control.getRecentDot(t);if(this.disabled||this.dots[r].disabled)return!1;this.focusDotIndex=r,this.control.setDotPos(t,r),this.syncValueByPos(),this.useKeyboard&&this.states.add(mt.Focus),setTimeout((function(){e.included&&e.isNotSync?e.control.setValue(e.modelValue):e.control.syncDotsPos()}))},keydownHandle:function(t){var e=this;if(!this.useKeyboard||!this.states.has(mt.Focus))return!1;var r=this.included&&this.marks,n=w(t,{direction:this.direction,max:r?this.control.markList.length-1:this.control.total,min:0,hook:this.keydownHook});if(n){t.preventDefault();var i=-1,o=0;r?(this.control.markList.some((function(t,r){return t.value===e.control.dotsValue[e.focusDotIndex]&&(i=n(r),!0)})),i<0?i=0:i>this.control.markList.length-1&&(i=this.control.markList.length-1),o=this.control.markList[i].pos):(i=n(this.control.getIndexByValue(this.control.dotsValue[this.focusDotIndex])),o=this.control.parseValue(this.control.getValueByIndex(i))),this.isCrossDot(o),this.control.setDotPos(o,this.focusDotIndex),this.syncValueByPos()}},getPosByEvent:function(t){return P(t,this.$el,this.isReverse,this.zoom)[this.isHorizontal?"x":"y"]/this.scale},renderSlot:function(t,e,r){var n=this.$slots[t];return n?n(e):r}},created:function(){this.initControl()},mounted:function(){this.bindEvent()},beforeUnmount:function(){this.unbindEvent()}});const bt=(0,f.Z)(yt,[["render",l]]);var gt=bt;gt.VueSliderMark=k,gt.VueSliderDot=m;var kt=gt,St=kt}(),i=i["default"],i}()}));
//# sourceMappingURL=vue-slider-component.umd.min.js.map

/***/ },

/***/ 292
(module, __unused_webpack_exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(745);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(534)/* ["default"] */ .A)
var update = add("7dfc2caf", content, false, {});
// Hot Module Replacement
if(false) // removed by dead control flow
{}

/***/ },

/***/ 235
(module, __unused_webpack_exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(411);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(534)/* ["default"] */ .A)
var update = add("41ff4fa8", content, false, {});
// Hot Module Replacement
if(false) // removed by dead control flow
{}

/***/ },

/***/ 670
(module, __unused_webpack_exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(937);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(534)/* ["default"] */ .A)
var update = add("6c84a470", content, false, {});
// Hot Module Replacement
if(false) // removed by dead control flow
{}

/***/ },

/***/ 534
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ addStylesClient)
});

;// ./node_modules/vue-style-loader/lib/listToStyles.js
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}

;// ./node_modules/vue-style-loader/lib/addStylesClient.js
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ },

/***/ 398
(module) {

"use strict";
module.exports = require("Vue");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			const getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter/value functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			if(Array.isArray(definition)) {
/******/ 				var i = 0;
/******/ 				while(i < definition.length) {
/******/ 					var key = definition[i++];
/******/ 					var binding = definition[i++];
/******/ 					if(!__webpack_require__.o(exports, key)) {
/******/ 						if(binding === 0) {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, value: definition[i++] });
/******/ 						} else {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, get: binding });
/******/ 						}
/******/ 					} else if(binding === 0) { i++; }
/******/ 				}
/******/ 			} else {
/******/ 				for(var key in definition) {
/******/ 					if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 						Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/wrap commonjs module */
/******/ 	(() => {
/******/ 		// execute a CommonJS module body with real module/exports objects, returning the final exports
/******/ 		__webpack_require__.cjs = (body) => {
/******/ 			const mod = { exports: {} };
/******/ 			body.call(mod.exports, mod, mod.exports);
/******/ 			return mod.exports;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src_GanttElastic)
});

// UNUSED EXPORTS: mergeDeep, mergeDeepReactive, notEqualDeep

// EXTERNAL MODULE: external "Vue"
var external_Vue_ = __webpack_require__(398);
var external_Vue_default = /*#__PURE__*/__webpack_require__.n(external_Vue_);
;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/GanttElastic.vue?vue&type=template&id=372aea41


function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_gantt_header = (0,external_Vue_.resolveComponent)("gantt-header")
  const _component_main_view = (0,external_Vue_.resolveComponent)("main-view")

  return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
    class: "gantt-elastic",
    style: (0,external_Vue_.normalizeStyle)([{"width":"100%"}, { fontFamily: _ctx.state.dynamicStyle.fontFamily }])
  }, [
    (0,external_Vue_.renderSlot)(_ctx.$slots, "header", {}, () => [
      (0,external_Vue_.createCommentVNode)(" default header when the consumer does not provide one (Vue 3 port: the old\r\n           external gantt-elastic-header UMD is Vue 2 only, so the local Header ships in) "),
      (0,external_Vue_.createVNode)(_component_gantt_header)
    ]),
    (0,external_Vue_.createVNode)(_component_main_view, { ref: "mainView" }, null, 512 /* NEED_PATCH */),
    (0,external_Vue_.renderSlot)(_ctx.$slots, "footer")
  ], 4 /* STYLE */))
}
;// ./src/GanttElastic.vue?vue&type=template&id=372aea41

// EXTERNAL MODULE: ./node_modules/dayjs/dayjs.min.js
var dayjs_min = __webpack_require__(353);
var dayjs_min_default = /*#__PURE__*/__webpack_require__.n(dayjs_min);
;// ./node_modules/mitt/dist/mitt.mjs
/* harmony default export */ function mitt(n){return{all:n=n||new Map,on:function(t,e){var i=n.get(t);i?i.push(e):n.set(t,[e])},off:function(t,e){var i=n.get(t);i&&(e?i.splice(i.indexOf(e)>>>0,1):n.set(t,[]))},emit:function(t,e){var i=n.get(t);i&&i.slice().map(function(n){n(e)}),(i=n.get("*"))&&i.slice().map(function(n){n(t,e)})}}}
//# sourceMappingURL=mitt.mjs.map

;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/MainView.vue?vue&type=template&id=a1e49164


function MainViewvue_type_template_id_a1e49164_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_task_list = (0,external_Vue_.resolveComponent)("task-list")
  const _component_chart = (0,external_Vue_.resolveComponent)("chart")
  const _component_chart_tooltip = (0,external_Vue_.resolveComponent)("chart-tooltip")

  return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
    class: "gantt-elastic__main-view",
    style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['main-view'] })
  }, [
    (0,external_Vue_.createElementVNode)("div", {
      class: "gantt-elastic__main-container-wrapper",
      style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['main-container-wrapper'], height: $options.root.state.options.height + 'px' })
    }, [
      (0,external_Vue_.createElementVNode)("div", {
        class: "gantt-elastic__main-container",
        style: (0,external_Vue_.normalizeStyle)({
          ...$options.root.style['main-container'],
          width: $options.root.state.options.clientWidth + 'px',
          height: $options.root.state.options.height + 'px'
        }),
        ref: "mainView"
      }, [
        (0,external_Vue_.createElementVNode)("div", {
          class: "gantt-elastic__container",
          style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['container'] }),
          onMousemove: _cache[7] || (_cache[7] = (...args) => ($options.mouseMove && $options.mouseMove(...args))),
          onMouseup: _cache[8] || (_cache[8] = (...args) => ($options.mouseUp && $options.mouseUp(...args)))
        }, [
          (0,external_Vue_.withDirectives)((0,external_Vue_.createElementVNode)("div", {
            ref: "taskList",
            class: "gantt-elastic__task-list-container",
            style: (0,external_Vue_.normalizeStyle)({
              ...$options.root.style['task-list-container'],
              width: $options.root.state.options.taskList.finalWidth + 'px',
              height: $options.root.state.options.height + 'px'
            })
          }, [
            (0,external_Vue_.createVNode)(_component_task_list)
          ], 4 /* STYLE */), [
            [external_Vue_.vShow, $options.root.state.options.taskList.display]
          ]),
          (0,external_Vue_.createElementVNode)("div", {
            class: "gantt-elastic__main-view-container",
            style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['main-view-container'] }),
            ref: "chartContainer",
            onMousedown: _cache[0] || (_cache[0] = (...args) => ($options.chartMouseDown && $options.chartMouseDown(...args))),
            onTouchstart: _cache[1] || (_cache[1] = (...args) => ($options.chartMouseDown && $options.chartMouseDown(...args))),
            onMouseup: _cache[2] || (_cache[2] = (...args) => ($options.chartMouseUp && $options.chartMouseUp(...args))),
            onTouchend: _cache[3] || (_cache[3] = (...args) => ($options.chartMouseUp && $options.chartMouseUp(...args))),
            onMousemove: _cache[4] || (_cache[4] = (0,external_Vue_.withModifiers)((...args) => ($options.chartMouseMove && $options.chartMouseMove(...args)), ["prevent"])),
            onTouchmove: _cache[5] || (_cache[5] = (0,external_Vue_.withModifiers)((...args) => ($options.chartMouseMove && $options.chartMouseMove(...args)), ["prevent"])),
            onWheel: _cache[6] || (_cache[6] = (0,external_Vue_.withModifiers)((...args) => ($options.chartWheel && $options.chartWheel(...args)), ["prevent"]))
          }, [
            (0,external_Vue_.createVNode)(_component_chart)
          ], 36 /* STYLE, NEED_HYDRATION */)
        ], 36 /* STYLE, NEED_HYDRATION */)
      ], 4 /* STYLE */),
      (0,external_Vue_.createElementVNode)("div", {
        class: "gantt-elastic__chart-scroll-container gantt-elastic__chart-scroll-container--vertical",
        style: (0,external_Vue_.normalizeStyle)({
          ...$options.root.style['chart-scroll-container'],
          ...$options.root.style['chart-scroll-container--vertical'],
          ...$options.verticalStyle
        }),
        ref: "chartScrollContainerVertical",
        onScroll: _cache[9] || (_cache[9] = (...args) => ($options.onVerticalScroll && $options.onVerticalScroll(...args)))
      }, [
        (0,external_Vue_.createElementVNode)("div", {
          class: "gantt-elastic__chart-scroll--vertical",
          style: (0,external_Vue_.normalizeStyle)({ width: '1px', height: $options.root.state.options.allVisibleTasksHeight + 'px' })
        }, null, 4 /* STYLE */)
      ], 36 /* STYLE, NEED_HYDRATION */)
    ], 4 /* STYLE */),
    (0,external_Vue_.createElementVNode)("div", {
      class: "gantt-elastic__chart-scroll-container gantt-elastic__chart-scroll-container--horizontal",
      style: (0,external_Vue_.normalizeStyle)({
        ...$options.root.style['chart-scroll-container'],
        ...$options.root.style['chart-scroll-container--horizontal'],
        marginLeft: $options.getMarginLeft
      }),
      onScroll: _cache[10] || (_cache[10] = (...args) => ($options.onHorizontalScroll && $options.onHorizontalScroll(...args))),
      ref: "chartScrollContainerHorizontal"
    }, [
      (0,external_Vue_.createElementVNode)("div", {
        class: "gantt-elastic__chart-scroll--horizontal",
        style: (0,external_Vue_.normalizeStyle)({ height: '1px', width: $options.root.state.options.width + 'px' })
      }, null, 4 /* STYLE */)
    ], 36 /* STYLE, NEED_HYDRATION */),
    ($options.root.state.options.chart.tooltip.display)
      ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createBlock)(_component_chart_tooltip, { key: 0 }))
      : (0,external_Vue_.createCommentVNode)("v-if", true)
  ], 4 /* STYLE */))
}
;// ./src/components/MainView.vue?vue&type=template&id=a1e49164

;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/TaskList/TaskList.vue?vue&type=template&id=bc5f0ea4


function TaskListvue_type_template_id_bc5f0ea4_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_task_list_header = (0,external_Vue_.resolveComponent)("task-list-header")
  const _component_task_list_item = (0,external_Vue_.resolveComponent)("task-list-item")

  return (0,external_Vue_.withDirectives)(((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
    class: "gantt-elastic__task-list-wrapper",
    ref: "taskListWrapper",
    style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['task-list-wrapper'], width: '100%', height: '100%' })
  }, [
    (0,external_Vue_.createElementVNode)("div", {
      class: "gantt-elastic__task-list",
      style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['task-list'] }),
      ref: "taskList"
    }, [
      (0,external_Vue_.createVNode)(_component_task_list_header),
      (0,external_Vue_.createElementVNode)("div", {
        class: "gantt-elastic__task-list-items",
        ref: "taskListItems",
        role: "tree",
        "aria-label": "Task list",
        style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['task-list-items'], height: $options.root.state.options.rowsHeight + 'px' })
      }, [
        (0,external_Vue_.createCommentVNode)(" virtualization spacers keep the scroll height stable while only\r\n             rows inside the viewport are mounted (issue #9) "),
        ($options.topSpacer > 0)
          ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
              key: 0,
              class: "gantt-elastic__task-list-spacer",
              style: (0,external_Vue_.normalizeStyle)({ height: $options.topSpacer + 'px' }),
              role: "presentation"
            }, null, 4 /* STYLE */))
          : (0,external_Vue_.createCommentVNode)("v-if", true),
        ((0,external_Vue_.openBlock)(true), (0,external_Vue_.createElementBlock)(external_Vue_.Fragment, null, (0,external_Vue_.renderList)($options.root.renderedTasks, (task) => {
          return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createBlock)(_component_task_list_item, {
            key: task.id,
            task: task
          }, null, 8 /* PROPS */, ["task"]))
        }), 128 /* KEYED_FRAGMENT */)),
        ($options.bottomSpacer > 0)
          ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
              key: 1,
              class: "gantt-elastic__task-list-spacer",
              style: (0,external_Vue_.normalizeStyle)({ height: $options.bottomSpacer + 'px' }),
              role: "presentation"
            }, null, 4 /* STYLE */))
          : (0,external_Vue_.createCommentVNode)("v-if", true)
      ], 4 /* STYLE */)
    ], 4 /* STYLE */)
  ], 4 /* STYLE */)), [
    [external_Vue_.vShow, $options.root.state.options.taskList.display]
  ])
}
;// ./src/components/TaskList/TaskList.vue?vue&type=template&id=bc5f0ea4

;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/TaskList/TaskListHeader.vue?vue&type=template&id=10c6bca6


const _hoisted_1 = ["column"]
const _hoisted_2 = ["column", "aria-label", "aria-valuenow", "onKeydown", "onMousedown", "onDblclick"]

function TaskListHeadervue_type_template_id_10c6bca6_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_task_list_expander = (0,external_Vue_.resolveComponent)("task-list-expander")

  return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
    class: "gantt-elastic__task-list-header",
    style: (0,external_Vue_.normalizeStyle)({
      ...$options.root.style['task-list-header'],
      height: `${$options.root.state.options.calendar.height}px`,
      'margin-bottom': `${$options.root.state.options.calendar.gap}px`
    })
  }, [
    ((0,external_Vue_.openBlock)(true), (0,external_Vue_.createElementBlock)(external_Vue_.Fragment, null, (0,external_Vue_.renderList)($options.root.getTaskListColumns, (column) => {
      return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
        class: "gantt-elastic__task-list-header-column",
        style: (0,external_Vue_.normalizeStyle)({
        ...$options.root.style['task-list-header-column'],
        ...column.style['task-list-header-column'],
        ...$options.getStyle(column)
      }),
        key: column._id
      }, [
        (column.expander)
          ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createBlock)(_component_task_list_expander, {
              key: 0,
              tasks: $options.collapsible,
              options: $options.root.state.options.taskList.expander
            }, null, 8 /* PROPS */, ["tasks", "options"]))
          : (0,external_Vue_.createCommentVNode)("v-if", true),
        (0,external_Vue_.createElementVNode)("div", {
          class: "gantt-elastic__task-list-header-label",
          style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['task-list-header-label'], ...column.style['task-list-header-label'] }),
          column: column,
          onMouseup: _cache[0] || (_cache[0] = (...args) => ($options.resizerMouseUp && $options.resizerMouseUp(...args)))
        }, (0,external_Vue_.toDisplayString)(column.label), 45 /* TEXT, STYLE, PROPS, NEED_HYDRATION */, _hoisted_1),
        (0,external_Vue_.createElementVNode)("div", {
          class: "gantt-elastic__task-list-header-resizer-wrapper",
          style: (0,external_Vue_.normalizeStyle)({
          ...$options.root.style['task-list-header-resizer-wrapper'],
          ...column.style['task-list-header-resizer-wrapper']
        }),
          column: column,
          tabindex: "0",
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": `Resize ${column.label} column`,
          "aria-valuenow": column.width,
          onKeydown: $event => ($options.resizerKeyDown($event, column)),
          onMousedown: $event => ($options.resizerMouseDown($event, column)),
          onDblclick: $event => ($options.resizerReset($event, column))
        }, [
          (0,external_Vue_.createElementVNode)("div", {
            class: "gantt-elastic__task-list-header-resizer",
            style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['task-list-header-resizer'], ...column.style['task-list-header-resizer'] })
          }, [
            (0,external_Vue_.createElementVNode)("div", {
              class: "gantt-elastic__task-list-header-resizer-dot",
              style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['task-list-header-resizer-dot'], ...column.style['task-list-header-resizer-dot'] })
            }, null, 4 /* STYLE */),
            (0,external_Vue_.createElementVNode)("div", {
              class: "gantt-elastic__task-list-header-resizer-dot",
              style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['task-list-header-resizer-dot'], ...column.style['task-list-header-resizer-dot'] })
            }, null, 4 /* STYLE */),
            (0,external_Vue_.createElementVNode)("div", {
              class: "gantt-elastic__task-list-header-resizer-dot",
              style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['task-list-header-resizer-dot'], ...column.style['task-list-header-resizer-dot'] })
            }, null, 4 /* STYLE */)
          ], 4 /* STYLE */)
        ], 44 /* STYLE, PROPS, NEED_HYDRATION */, _hoisted_2)
      ], 4 /* STYLE */))
    }), 128 /* KEYED_FRAGMENT */))
  ], 4 /* STYLE */))
}
;// ./src/components/TaskList/TaskListHeader.vue?vue&type=template&id=10c6bca6

;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Expander.vue?vue&type=template&id=4a103b26


const Expandervue_type_template_id_4a103b26_hoisted_1 = ["width", "height", "aria-expanded", "aria-label"]
const Expandervue_type_template_id_4a103b26_hoisted_2 = ["x", "y", "width", "height"]
const _hoisted_3 = ["x1", "y1", "x2", "y2"]
const _hoisted_4 = ["x1", "y1", "x2", "y2"]

function Expandervue_type_template_id_4a103b26_render(_ctx, _cache, $props, $setup, $data, $options) {
  return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
    class: (0,external_Vue_.normalizeClass)($options.getClassPrefix() + '-wrapper'),
    style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style[$options.getClassPrefix(false) + '-wrapper'], ...$options.style })
  }, [
    ($options.allChildren.length)
      ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("svg", {
          key: 0,
          class: (0,external_Vue_.normalizeClass)($options.getClassPrefix() + '-content'),
          style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style[$options.getClassPrefix(false) + '-content'] }),
          width: $props.options.size,
          height: $props.options.size,
          role: "button",
          tabindex: "0",
          "aria-expanded": !$options.collapsed,
          "aria-label": `Toggle children of ${$props.tasks[0].label}`,
          onClick: _cache[0] || (_cache[0] = (...args) => ($options.toggle && $options.toggle(...args))),
          onKeydown: [
            _cache[1] || (_cache[1] = (0,external_Vue_.withKeys)((0,external_Vue_.withModifiers)((...args) => ($options.toggle && $options.toggle(...args)), ["prevent"]), ["enter"])),
            _cache[2] || (_cache[2] = (0,external_Vue_.withKeys)((0,external_Vue_.withModifiers)((...args) => ($options.toggle && $options.toggle(...args)), ["prevent"]), ["space"]))
          ]
        }, [
          (0,external_Vue_.createElementVNode)("rect", {
            class: (0,external_Vue_.normalizeClass)($options.getClassPrefix() + '-border'),
            style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style[$options.getClassPrefix(false) + '-border'], ...$data.borderStyle }),
            x: $data.border,
            y: $data.border,
            width: $props.options.size - $data.border * 2,
            height: $props.options.size - $data.border * 2,
            rx: "2",
            ry: "2"
          }, null, 14 /* CLASS, STYLE, PROPS */, Expandervue_type_template_id_4a103b26_hoisted_2),
          ($options.allChildren.length)
            ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("line", {
                key: 0,
                class: (0,external_Vue_.normalizeClass)($options.getClassPrefix() + '-line'),
                style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style[$options.getClassPrefix(false) + '-line'] }),
                x1: $data.lineOffset,
                y1: $props.options.size / 2,
                x2: $props.options.size - $data.lineOffset,
                y2: $props.options.size / 2
              }, null, 14 /* CLASS, STYLE, PROPS */, _hoisted_3))
            : (0,external_Vue_.createCommentVNode)("v-if", true),
          ($options.collapsed)
            ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("line", {
                key: 1,
                class: (0,external_Vue_.normalizeClass)($options.getClassPrefix() + '-line'),
                style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style[$options.getClassPrefix(false) + '-line'] }),
                x1: $props.options.size / 2,
                y1: $data.lineOffset,
                x2: $props.options.size / 2,
                y2: $props.options.size - $data.lineOffset
              }, null, 14 /* CLASS, STYLE, PROPS */, _hoisted_4))
            : (0,external_Vue_.createCommentVNode)("v-if", true)
        ], 46 /* CLASS, STYLE, PROPS, NEED_HYDRATION */, Expandervue_type_template_id_4a103b26_hoisted_1))
      : (0,external_Vue_.createCommentVNode)("v-if", true)
  ], 6 /* CLASS, STYLE */))
}
;// ./src/components/Expander.vue?vue&type=template&id=4a103b26

;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Expander.vue?vue&type=script&lang=js

/* harmony default export */ const Expandervue_type_script_lang_js = ({
  name: 'Expander',
  inject: ['root'],
  props: ['tasks', 'options', 'type'],
  data() {
    const border = 0.5;
    return {
      border,
      borderStyle: {
        'stroke-width': border
      },
      lineOffset: 5
    };
  },
  computed: {
    style() {
      if (this.type !== 'taskList') {
        return {};
      }
      const margin = this.root.state.options.taskList.expander.margin;
      const padding = this.tasks[0].parents.length * this.root.state.options.taskList.expander.padding;
      return {
        'padding-left': padding + margin + 'px',
        margin: 'auto 0'
      };
    },
    /**
     * Get all tasks
     *
     * @returns {array}
     */
    allChildren() {
      const children = [];
      this.tasks.forEach(task => {
        task.allChildren.forEach(childId => {
          children.push(childId);
        });
      });
      return children;
    },
    /**
     * Is current expander collapsed?
     *
     * @returns {boolean}
     */
    collapsed() {
      if (this.tasks.length === 0) {
        return false;
      }
      let collapsed = 0;
      for (let i = 0, len = this.tasks.length; i < len; i++) {
        if (this.tasks[i].collapsed) {
          collapsed++;
        }
      }
      return collapsed === this.tasks.length;
    }
  },
  methods: {
    /**
     * Get specific class prefix
     *
     * @returns {string}
     */
    getClassPrefix(full = true) {
      return `${full ? 'gantt-elastic__' : ''}${this.options.type}-expander`;
    },
    /**
     * Toggle expander
     */
    toggle() {
      if (this.tasks.length === 0) {
        return;
      }
      const collapsed = !this.collapsed;
      this.tasks.forEach(task => {
        task.collapsed = collapsed;
      });
    }
  }
});

;// ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper_namespaceObject = /*#__PURE__*/__webpack_require__.cjs(function(module, exports) {
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
// runtime helper for setting properties on components
// in a tree-shakable way
exports.A = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
        target[key] = val;
    }
    return target;
};

});

;// ./src/components/Expander.vue




;
const __exports__ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(Expandervue_type_script_lang_js, [['render',Expandervue_type_template_id_4a103b26_render]])

/* harmony default export */ const Expander = (__exports__);
;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/TaskList/TaskListHeader.vue?vue&type=script&lang=js


/* harmony default export */ const TaskListHeadervue_type_script_lang_js = ({
  name: 'TaskListHeader',
  components: {
    TaskListExpander: Expander
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
});

;// ./src/components/TaskList/TaskListHeader.vue?vue&type=script&lang=js
 
;// ./src/components/TaskList/TaskListHeader.vue




;
const TaskListHeader_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(TaskListHeadervue_type_script_lang_js, [['render',TaskListHeadervue_type_template_id_10c6bca6_render]])

/* harmony default export */ const TaskListHeader = (TaskListHeader_exports_);
;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/TaskList/TaskListItem.vue?vue&type=template&id=b00214be


const TaskListItemvue_type_template_id_b00214be_hoisted_1 = ["aria-level", "aria-expanded", "aria-selected"]

function TaskListItemvue_type_template_id_b00214be_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_task_list_expander = (0,external_Vue_.resolveComponent)("task-list-expander")
  const _component_item_column = (0,external_Vue_.resolveComponent)("item-column")

  return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
    class: (0,external_Vue_.normalizeClass)(["gantt-elastic__task-list-item", {
      'gantt-elastic__task-list-item--selected': $options.root.state.selectedTaskId === $props.task.id,
      'gantt-elastic__task-list-item--hover': $options.root.state.hoveredTaskId === $props.task.id
    }]),
    style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['task-list-item'], ...$options.highlightStyle }),
    role: "treeitem",
    tabindex: "0",
    "aria-level": $props.task.parents.length + 1,
    "aria-expanded": $props.task.allChildren.length > 0 ? !$props.task.collapsed : undefined,
    "aria-selected": $options.root.state.selectedTaskId === $props.task.id,
    onKeydown: _cache[0] || (_cache[0] = (...args) => ($options.onRowKeyDown && $options.onRowKeyDown(...args))),
    onMouseenter: _cache[1] || (_cache[1] = $event => ($options.emitRowEvent('mouseenter', $event))),
    onMouseleave: _cache[2] || (_cache[2] = $event => ($options.emitRowEvent('mouseleave', $event)))
  }, [
    ((0,external_Vue_.openBlock)(true), (0,external_Vue_.createElementBlock)(external_Vue_.Fragment, null, (0,external_Vue_.renderList)($options.columns, (column) => {
      return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createBlock)(_component_item_column, {
        key: column._id,
        column: column,
        task: $props.task
      }, {
        default: (0,external_Vue_.withCtx)(() => [
          (column.expander)
            ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createBlock)(_component_task_list_expander, {
                key: 0,
                tasks: [$props.task],
                options: $options.root.state.options.taskList.expander,
                type: "taskList"
              }, null, 8 /* PROPS */, ["tasks", "options"]))
            : (0,external_Vue_.createCommentVNode)("v-if", true)
        ]),
        _: 2 /* DYNAMIC */
      }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["column", "task"]))
    }), 128 /* KEYED_FRAGMENT */))
  ], 46 /* CLASS, STYLE, PROPS, NEED_HYDRATION */, TaskListItemvue_type_template_id_b00214be_hoisted_1))
}
;// ./src/components/TaskList/TaskListItem.vue?vue&type=template&id=b00214be

;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/TaskList/ItemColumn.vue?vue&type=template&id=dafc94d4


const ItemColumnvue_type_template_id_dafc94d4_hoisted_1 = ["innerHTML"]

function ItemColumnvue_type_template_id_dafc94d4_render(_ctx, _cache, $props, $setup, $data, $options) {
  return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
    class: "gantt-elastic__task-list-item-column",
    style: (0,external_Vue_.normalizeStyle)($options.itemColumnStyle)
  }, [
    (0,external_Vue_.createElementVNode)("div", {
      class: "gantt-elastic__task-list-item-value-wrapper",
      style: (0,external_Vue_.normalizeStyle)($options.wrapperStyle)
    }, [
      (0,external_Vue_.renderSlot)(_ctx.$slots, "default"),
      (0,external_Vue_.createElementVNode)("div", {
        class: "gantt-elastic__task-list-item-value-container",
        style: (0,external_Vue_.normalizeStyle)($options.containerStyle)
      }, [
        (!$options.html)
          ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
              key: 0,
              class: "gantt-elastic__task-list-item-value",
              style: (0,external_Vue_.normalizeStyle)($options.valueStyle),
              onClick: _cache[0] || (_cache[0] = $event => ($options.emitEvent('click', $event))),
              onMouseenter: _cache[1] || (_cache[1] = $event => ($options.emitEvent('mouseenter', $event))),
              onMouseover: _cache[2] || (_cache[2] = $event => ($options.emitEvent('mouseover', $event))),
              onMouseout: _cache[3] || (_cache[3] = $event => ($options.emitEvent('mouseout', $event))),
              onMouseleave: _cache[4] || (_cache[4] = $event => ($options.emitEvent('mouseleave', $event))),
              onMousemove: _cache[5] || (_cache[5] = $event => ($options.emitEvent('mousemove', $event))),
              onMousedown: _cache[6] || (_cache[6] = $event => ($options.emitEvent('mousedown', $event))),
              onMouseup: _cache[7] || (_cache[7] = $event => ($options.emitEvent('mouseup', $event))),
              onMousewheel: _cache[8] || (_cache[8] = $event => ($options.emitEvent('mousewheel', $event))),
              onTouchstart: _cache[9] || (_cache[9] = $event => ($options.emitEvent('touchstart', $event))),
              onTouchmove: _cache[10] || (_cache[10] = $event => ($options.emitEvent('touchmove', $event))),
              onTouchend: _cache[11] || (_cache[11] = $event => ($options.emitEvent('touchend', $event)))
            }, (0,external_Vue_.toDisplayString)($options.value), 37 /* TEXT, STYLE, NEED_HYDRATION */))
          : ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
              key: 1,
              class: "gantt-elastic__task-list-item-value",
              style: (0,external_Vue_.normalizeStyle)($options.valueStyle),
              onClick: _cache[12] || (_cache[12] = $event => ($options.emitEvent('click', $event))),
              onMouseenter: _cache[13] || (_cache[13] = $event => ($options.emitEvent('mouseenter', $event))),
              onMouseover: _cache[14] || (_cache[14] = $event => ($options.emitEvent('mouseover', $event))),
              onMouseout: _cache[15] || (_cache[15] = $event => ($options.emitEvent('mouseout', $event))),
              onMouseleave: _cache[16] || (_cache[16] = $event => ($options.emitEvent('mouseleave', $event))),
              onMousemove: _cache[17] || (_cache[17] = $event => ($options.emitEvent('mousemove', $event))),
              onMousedown: _cache[18] || (_cache[18] = $event => ($options.emitEvent('mousedown', $event))),
              onMouseup: _cache[19] || (_cache[19] = $event => ($options.emitEvent('mouseup', $event))),
              onMousewheel: _cache[20] || (_cache[20] = $event => ($options.emitEvent('mousewheel', $event))),
              onTouchstart: _cache[21] || (_cache[21] = $event => ($options.emitEvent('touchstart', $event))),
              onTouchmove: _cache[22] || (_cache[22] = $event => ($options.emitEvent('touchmove', $event))),
              onTouchend: _cache[23] || (_cache[23] = $event => ($options.emitEvent('touchend', $event))),
              innerHTML: $options.sanitizedValue
            }, null, 44 /* STYLE, PROPS, NEED_HYDRATION */, ItemColumnvue_type_template_id_dafc94d4_hoisted_1))
      ], 4 /* STYLE */)
    ], 4 /* STYLE */)
  ], 4 /* STYLE */))
}
;// ./src/components/TaskList/ItemColumn.vue?vue&type=template&id=dafc94d4

;// ./node_modules/dompurify/dist/purify.es.mjs
/*! @license DOMPurify 3.4.16 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.16/LICENSE */
function _OverloadYield(e, d) {
	this.v = e, this.k = d;
}
function _arrayLikeToArray(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function _arrayWithHoles(r) {
	if (Array.isArray(r)) return r;
}
function _iterableToArrayLimit(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = !0, o = !1;
		try {
			if (i = (t = t.call(r)).next, 0 === l) {
				if (Object(t) !== t) return;
				f = !1;
			} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = !0, n = r;
		} finally {
			try {
				if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
function _slicedToArray(r, e) {
	return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _unsupportedIterableToArray(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
	}
}
function AsyncGenerator(e) {
	var t, n;
	function resume(t, n) {
		try {
			var r = e[t](n), o = r.value, u = o instanceof _OverloadYield;
			Promise.resolve(u ? o.v : o).then(function(n) {
				if (u) {
					var i = "return" === t && o.k ? t : "next";
					if (!o.k || n.done) return resume(i, n);
					n = e[i](n).value;
				}
				settle(!!r.done, n);
			}, function(e) {
				resume("throw", e);
			});
		} catch (e) {
			settle(2, e);
		}
	}
	function settle(e, r) {
		2 === e ? t.reject(r) : t.resolve({
			value: r,
			done: e
		}), (t = t.next) ? resume(t.key, t.arg) : n = null;
	}
	this._invoke = function(e, r) {
		return new Promise(function(o, u) {
			var i = {
				key: e,
				arg: r,
				resolve: o,
				reject: u,
				next: null
			};
			n ? n = n.next = i : (t = n = i, resume(e, r));
		});
	}, "function" != typeof e.return && (this.return = void 0);
}
AsyncGenerator.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function() {
	return this;
}, AsyncGenerator.prototype.next = function(e) {
	return this._invoke("next", e);
}, AsyncGenerator.prototype.throw = function(e) {
	return this._invoke("throw", e);
}, AsyncGenerator.prototype.return = function(e) {
	return this._invoke("return", e);
};
const entries = Object.entries;
const setPrototypeOf = Object.setPrototypeOf;
const isFrozen = Object.isFrozen;
const getPrototypeOf = Object.getPrototypeOf;
const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
let freeze = Object.freeze;
let seal = Object.seal;
let create = Object.create;
let _ref = typeof Reflect !== "undefined" && Reflect;
let apply = _ref.apply;
let construct = _ref.construct;
if (!freeze) freeze = function freeze(x) {
	return x;
};
if (!seal) seal = function seal(x) {
	return x;
};
if (!apply) apply = function apply(func, thisArg) {
	for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
	return func.apply(thisArg, args);
};
if (!construct) construct = function construct(Func) {
	for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
	return new Func(...args);
};
const arrayForEach = unapply(Array.prototype.forEach);
Array.prototype.indexOf;
const arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
const arrayPop = unapply(Array.prototype.pop);
const arrayPush = unapply(Array.prototype.push);
Array.prototype.slice;
const arraySplice = unapply(Array.prototype.splice);
const arrayIsArray = Array.isArray;
const stringToLowerCase = unapply(String.prototype.toLowerCase);
const stringToString = unapply(String.prototype.toString);
const stringMatch = unapply(String.prototype.match);
const stringReplace = unapply(String.prototype.replace);
const stringIndexOf = unapply(String.prototype.indexOf);
const stringTrim = unapply(String.prototype.trim);
const numberToString = unapply(Number.prototype.toString);
const booleanToString = unapply(Boolean.prototype.toString);
const bigintToString = typeof BigInt === "undefined" ? null : unapply(BigInt.prototype.toString);
const symbolToString = typeof Symbol === "undefined" ? null : unapply(Symbol.prototype.toString);
const objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
const objectToString = unapply(Object.prototype.toString);
const regExpTest = unapply(RegExp.prototype.test);
const typeErrorCreate = unconstruct(TypeError);
/**
* Creates a new function that calls the given function with a specified thisArg and arguments.
*
* @param func - The function to be wrapped and called.
* @returns A new function that calls the given function with a specified thisArg and arguments.
*/
function unapply(func) {
	return function(thisArg) {
		if (thisArg instanceof RegExp) thisArg.lastIndex = 0;
		for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) args[_key3 - 1] = arguments[_key3];
		return apply(func, thisArg, args);
	};
}
/**
* Creates a new function that constructs an instance of the given constructor function with the provided arguments.
*
* @param func - The constructor function to be wrapped and called.
* @returns A new function that constructs an instance of the given constructor function with the provided arguments.
*/
function unconstruct(Func) {
	return function() {
		for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) args[_key4] = arguments[_key4];
		return construct(Func, args);
	};
}
/**
* Add properties to a lookup table
*
* @param set - The set to which elements will be added.
* @param array - The array containing elements to be added to the set.
* @param transformCaseFunc - An optional function to transform the case of each element before adding to the set.
* @returns The modified set with added elements.
*/
function addToSet(set, array) {
	let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
	if (setPrototypeOf) setPrototypeOf(set, null);
	if (!arrayIsArray(array)) return set;
	let l = array.length;
	while (l--) {
		let element = array[l];
		if (typeof element === "string") {
			const lcElement = transformCaseFunc(element);
			if (lcElement !== element) {
				if (!isFrozen(array)) array[l] = lcElement;
				element = lcElement;
			}
		}
		set[element] = true;
	}
	return set;
}
/**
* Clean up an array to harden against CSPP
*
* @param array - The array to be cleaned.
* @returns The cleaned version of the array
*/
function cleanArray(array) {
	for (let index = 0; index < array.length; index++) if (!objectHasOwnProperty(array, index)) array[index] = null;
	return array;
}
/**
* Shallow clone an object
*
* @param object - The object to be cloned.
* @returns A new object that copies the original.
*/
function clone(object) {
	const newObject = create(null);
	for (const _ref2 of entries(object)) {
		var _ref3 = _slicedToArray(_ref2, 2);
		const property = _ref3[0];
		const value = _ref3[1];
		if (objectHasOwnProperty(object, property)) {
			if (arrayIsArray(value)) newObject[property] = cleanArray(value);
			else if (value && typeof value === "object" && value.constructor === Object) newObject[property] = clone(value);
			else newObject[property] = value;
		}
	}
	return newObject;
}
/**
* Convert non-node values into strings without depending on direct property access.
*
* @param value - The value to stringify.
* @returns A string representation of the provided value.
*/
function stringifyValue(value) {
	switch (typeof value) {
		case "string": return value;
		case "number": return numberToString(value);
		case "boolean": return booleanToString(value);
		case "bigint": return bigintToString ? bigintToString(value) : "0";
		case "symbol": return symbolToString ? symbolToString(value) : "Symbol()";
		case "undefined": return objectToString(value);
		case "function":
		case "object": {
			if (value === null) return objectToString(value);
			const valueAsRecord = value;
			const valueToString = lookupGetter(valueAsRecord, "toString");
			if (typeof valueToString === "function") {
				const stringified = valueToString(valueAsRecord);
				return typeof stringified === "string" ? stringified : objectToString(stringified);
			}
			return objectToString(value);
		}
		default: return objectToString(value);
	}
}
/**
* This method automatically checks if the prop is function or getter and behaves accordingly.
*
* @param object - The object to look up the getter function in its prototype chain.
* @param prop - The property name for which to find the getter function.
* @returns The getter function found in the prototype chain or a fallback function.
*/
function lookupGetter(object, prop) {
	while (object !== null) {
		const desc = getOwnPropertyDescriptor(object, prop);
		if (desc) {
			if (desc.get) return unapply(desc.get);
			if (typeof desc.value === "function") return unapply(desc.value);
		}
		object = getPrototypeOf(object);
	}
	function fallbackValue() {
		return null;
	}
	return fallbackValue;
}
function isRegex(value) {
	try {
		regExpTest(value, "");
		return true;
	} catch (_unused) {
		return false;
	}
}
const html$1 = freeze([
	"a",
	"abbr",
	"acronym",
	"address",
	"area",
	"article",
	"aside",
	"audio",
	"b",
	"bdi",
	"bdo",
	"big",
	"blink",
	"blockquote",
	"body",
	"br",
	"button",
	"canvas",
	"caption",
	"center",
	"cite",
	"code",
	"col",
	"colgroup",
	"content",
	"data",
	"datalist",
	"dd",
	"decorator",
	"del",
	"details",
	"dfn",
	"dialog",
	"dir",
	"div",
	"dl",
	"dt",
	"element",
	"em",
	"fieldset",
	"figcaption",
	"figure",
	"font",
	"footer",
	"form",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hgroup",
	"hr",
	"html",
	"i",
	"img",
	"input",
	"ins",
	"kbd",
	"label",
	"legend",
	"li",
	"main",
	"map",
	"mark",
	"marquee",
	"menu",
	"menuitem",
	"meter",
	"nav",
	"nobr",
	"ol",
	"optgroup",
	"option",
	"output",
	"p",
	"picture",
	"pre",
	"progress",
	"q",
	"rp",
	"rt",
	"ruby",
	"s",
	"samp",
	"search",
	"section",
	"select",
	"shadow",
	"slot",
	"small",
	"source",
	"spacer",
	"span",
	"strike",
	"strong",
	"style",
	"sub",
	"summary",
	"sup",
	"table",
	"tbody",
	"td",
	"template",
	"textarea",
	"tfoot",
	"th",
	"thead",
	"time",
	"tr",
	"track",
	"tt",
	"u",
	"ul",
	"var",
	"video",
	"wbr"
]);
const svg$1 = freeze([
	"svg",
	"a",
	"altglyph",
	"altglyphdef",
	"altglyphitem",
	"animatecolor",
	"animatemotion",
	"animatetransform",
	"circle",
	"clippath",
	"defs",
	"desc",
	"ellipse",
	"enterkeyhint",
	"exportparts",
	"filter",
	"font",
	"g",
	"glyph",
	"glyphref",
	"hkern",
	"image",
	"inputmode",
	"line",
	"lineargradient",
	"marker",
	"mask",
	"metadata",
	"mpath",
	"part",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"radialgradient",
	"rect",
	"stop",
	"style",
	"switch",
	"symbol",
	"text",
	"textpath",
	"title",
	"tref",
	"tspan",
	"view",
	"vkern"
]);
const svgFilters = freeze([
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence"
]);
const svgDisallowed = freeze([
	"animate",
	"color-profile",
	"cursor",
	"discard",
	"font-face",
	"font-face-format",
	"font-face-name",
	"font-face-src",
	"font-face-uri",
	"foreignobject",
	"hatch",
	"hatchpath",
	"mesh",
	"meshgradient",
	"meshpatch",
	"meshrow",
	"missing-glyph",
	"script",
	"set",
	"solidcolor",
	"unknown",
	"use"
]);
const mathMl$1 = freeze([
	"math",
	"menclose",
	"merror",
	"mfenced",
	"mfrac",
	"mglyph",
	"mi",
	"mlabeledtr",
	"mmultiscripts",
	"mn",
	"mo",
	"mover",
	"mpadded",
	"mphantom",
	"mroot",
	"mrow",
	"ms",
	"mspace",
	"msqrt",
	"mstyle",
	"msub",
	"msup",
	"msubsup",
	"mtable",
	"mtd",
	"mtext",
	"mtr",
	"munder",
	"munderover",
	"mprescripts"
]);
const mathMlDisallowed = freeze([
	"maction",
	"maligngroup",
	"malignmark",
	"mlongdiv",
	"mscarries",
	"mscarry",
	"msgroup",
	"mstack",
	"msline",
	"msrow",
	"semantics",
	"annotation",
	"annotation-xml",
	"mprescripts",
	"none"
]);
const purify_es_text = freeze(["#text"]);
const html = freeze([
	"accept",
	"action",
	"align",
	"alt",
	"autocapitalize",
	"autocomplete",
	"autopictureinpicture",
	"autoplay",
	"background",
	"bgcolor",
	"border",
	"capture",
	"cellpadding",
	"cellspacing",
	"checked",
	"cite",
	"class",
	"clear",
	"color",
	"cols",
	"colspan",
	"command",
	"commandfor",
	"controls",
	"controlslist",
	"coords",
	"crossorigin",
	"datetime",
	"decoding",
	"default",
	"dir",
	"disabled",
	"disablepictureinpicture",
	"disableremoteplayback",
	"download",
	"draggable",
	"enctype",
	"enterkeyhint",
	"exportparts",
	"face",
	"for",
	"headers",
	"height",
	"hidden",
	"high",
	"href",
	"hreflang",
	"id",
	"inert",
	"inputmode",
	"integrity",
	"ismap",
	"kind",
	"label",
	"lang",
	"list",
	"loading",
	"loop",
	"low",
	"max",
	"maxlength",
	"media",
	"method",
	"min",
	"minlength",
	"multiple",
	"muted",
	"name",
	"nonce",
	"noshade",
	"novalidate",
	"nowrap",
	"open",
	"optimum",
	"part",
	"pattern",
	"placeholder",
	"playsinline",
	"popover",
	"popovertarget",
	"popovertargetaction",
	"poster",
	"preload",
	"pubdate",
	"radiogroup",
	"readonly",
	"rel",
	"required",
	"rev",
	"reversed",
	"role",
	"rows",
	"rowspan",
	"spellcheck",
	"scope",
	"selected",
	"shape",
	"size",
	"sizes",
	"slot",
	"span",
	"srclang",
	"start",
	"src",
	"srcset",
	"step",
	"style",
	"summary",
	"tabindex",
	"title",
	"translate",
	"type",
	"usemap",
	"valign",
	"value",
	"width",
	"wrap",
	"xmlns"
]);
const svg = freeze([
	"accent-height",
	"accumulate",
	"additive",
	"alignment-baseline",
	"amplitude",
	"ascent",
	"attributename",
	"attributetype",
	"azimuth",
	"basefrequency",
	"baseline-shift",
	"begin",
	"bias",
	"by",
	"class",
	"clip",
	"clippathunits",
	"clip-path",
	"clip-rule",
	"color",
	"color-interpolation",
	"color-interpolation-filters",
	"color-profile",
	"color-rendering",
	"cx",
	"cy",
	"d",
	"dx",
	"dy",
	"diffuseconstant",
	"direction",
	"display",
	"divisor",
	"dominant-baseline",
	"dur",
	"edgemode",
	"elevation",
	"end",
	"exponent",
	"fill",
	"fill-opacity",
	"fill-rule",
	"filter",
	"filterunits",
	"flood-color",
	"flood-opacity",
	"font-family",
	"font-size",
	"font-size-adjust",
	"font-stretch",
	"font-style",
	"font-variant",
	"font-weight",
	"fx",
	"fy",
	"g1",
	"g2",
	"glyph-name",
	"glyphref",
	"gradientunits",
	"gradienttransform",
	"height",
	"href",
	"id",
	"image-rendering",
	"in",
	"in2",
	"intercept",
	"k",
	"k1",
	"k2",
	"k3",
	"k4",
	"kerning",
	"keypoints",
	"keysplines",
	"keytimes",
	"lang",
	"lengthadjust",
	"letter-spacing",
	"kernelmatrix",
	"kernelunitlength",
	"lighting-color",
	"local",
	"marker-end",
	"marker-mid",
	"marker-start",
	"markerheight",
	"markerunits",
	"markerwidth",
	"maskcontentunits",
	"maskunits",
	"max",
	"mask",
	"mask-type",
	"media",
	"method",
	"mode",
	"min",
	"name",
	"numoctaves",
	"offset",
	"operator",
	"opacity",
	"order",
	"orient",
	"orientation",
	"origin",
	"overflow",
	"paint-order",
	"path",
	"pathlength",
	"patterncontentunits",
	"patterntransform",
	"patternunits",
	"pointer-events",
	"points",
	"preservealpha",
	"preserveaspectratio",
	"primitiveunits",
	"r",
	"rx",
	"ry",
	"radius",
	"refx",
	"refy",
	"repeatcount",
	"repeatdur",
	"restart",
	"result",
	"rotate",
	"scale",
	"seed",
	"shape-rendering",
	"slope",
	"specularconstant",
	"specularexponent",
	"spreadmethod",
	"startoffset",
	"stddeviation",
	"stitchtiles",
	"stop-color",
	"stop-opacity",
	"stroke-dasharray",
	"stroke-dashoffset",
	"stroke-linecap",
	"stroke-linejoin",
	"stroke-miterlimit",
	"stroke-opacity",
	"stroke",
	"stroke-width",
	"style",
	"surfacescale",
	"systemlanguage",
	"tabindex",
	"tablevalues",
	"targetx",
	"targety",
	"transform",
	"transform-origin",
	"text-anchor",
	"text-decoration",
	"text-orientation",
	"text-rendering",
	"textlength",
	"type",
	"u1",
	"u2",
	"unicode",
	"values",
	"vector-effect",
	"viewbox",
	"visibility",
	"version",
	"vert-adv-y",
	"vert-origin-x",
	"vert-origin-y",
	"width",
	"word-spacing",
	"wrap",
	"writing-mode",
	"xchannelselector",
	"ychannelselector",
	"x",
	"x1",
	"x2",
	"xmlns",
	"y",
	"y1",
	"y2",
	"z",
	"zoomandpan"
]);
const mathMl = freeze([
	"accent",
	"accentunder",
	"align",
	"bevelled",
	"close",
	"columnalign",
	"columnlines",
	"columnspacing",
	"columnspan",
	"denomalign",
	"depth",
	"dir",
	"display",
	"displaystyle",
	"encoding",
	"fence",
	"frame",
	"height",
	"href",
	"id",
	"largeop",
	"length",
	"linethickness",
	"lquote",
	"lspace",
	"mathbackground",
	"mathcolor",
	"mathsize",
	"mathvariant",
	"maxsize",
	"minsize",
	"movablelimits",
	"notation",
	"numalign",
	"open",
	"rowalign",
	"rowlines",
	"rowspacing",
	"rowspan",
	"rspace",
	"rquote",
	"scriptlevel",
	"scriptminsize",
	"scriptsizemultiplier",
	"selection",
	"separator",
	"separators",
	"stretchy",
	"subscriptshift",
	"supscriptshift",
	"symmetric",
	"voffset",
	"width",
	"xmlns"
]);
const xml = freeze([
	"xlink:href",
	"xml:id",
	"xlink:title",
	"xml:space",
	"xmlns:xlink"
]);
const MUSTACHE_EXPR = seal(/{{[\w\W]*|^[\w\W]*}}/g);
const ERB_EXPR = seal(/<%[\w\W]*|^[\w\W]*%>/g);
const TMPLIT_EXPR = seal(/\${[\w\W]*/g);
const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
const ARIA_ATTR = seal(/^aria-[\-\w]+$/);
const IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i);
const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
const ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g);
const DOCTYPE_NAME = seal(/^html$/i);
const CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
const ELEMENT_MARKUP_PROBE = seal(/<[/\w!]/g);
const COMMENT_MARKUP_PROBE = seal(/<[/\w]/g);
const FALLBACK_TAG_CLOSE = seal(/<\/no(script|embed|frames)/i);
const SELF_CLOSING_TAG = seal(/\/>/i);
const NODE_TYPE = {
	element: 1,
	attribute: 2,
	text: 3,
	cdataSection: 4,
	entityReference: 5,
	entityNode: 6,
	processingInstruction: 7,
	comment: 8,
	document: 9,
	documentType: 10,
	documentFragment: 11,
	notation: 12
};
const LITERAL_TEXT_ELEMENT_NAMES = [
	"style",
	"script",
	"xmp",
	"iframe",
	"noembed",
	"noframes",
	"plaintext",
	"noscript"
];
const LITERAL_TEXT_ELEMENTS = freeze(addToSet({}, LITERAL_TEXT_ELEMENT_NAMES));
const LITERAL_TEXT_CLOSE = function() {
	const map = {};
	arrayForEach(LITERAL_TEXT_ELEMENT_NAMES, (name) => {
		map[name] = seal(new RegExp("</" + name + "(?=[\\t\\n\\f\\r />])", "i"));
	});
	return freeze(map);
}();
const getGlobal = function getGlobal() {
	return typeof window === "undefined" ? null : window;
};
/**
* Creates a no-op policy for internal use only.
* Don't export this function outside this module!
* @param trustedTypes The policy factory.
* @param purifyHostElement The Script element used to load DOMPurify (to determine policy name suffix).
* @return The policy created (or null, if Trusted Types
* are not supported or creating the policy failed).
*/
const _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, purifyHostElement) {
	if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") return null;
	let suffix = null;
	const ATTR_NAME = "data-tt-policy-suffix";
	if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) suffix = purifyHostElement.getAttribute(ATTR_NAME);
	const policyName = "dompurify" + (suffix ? "#" + suffix : "");
	try {
		return trustedTypes.createPolicy(policyName, {
			createHTML(html) {
				return html;
			},
			createScriptURL(scriptUrl) {
				return scriptUrl;
			}
		});
	} catch (_) {
		console.warn("TrustedTypes policy " + policyName + " could not be created.");
		return null;
	}
};
const _createHooksMap = function _createHooksMap() {
	return {
		afterSanitizeAttributes: [],
		afterSanitizeElements: [],
		afterSanitizeShadowDOM: [],
		beforeSanitizeAttributes: [],
		beforeSanitizeElements: [],
		beforeSanitizeShadowDOM: [],
		uponSanitizeAttribute: [],
		uponSanitizeElement: [],
		uponSanitizeShadowNode: []
	};
};
/**
* Resolve a set-valued configuration option: a fresh set built from
* cfg[key] when it is an own array property (seeded with a clone of
* options.base when given, case-normalized via options.transform),
* the fallback set otherwise.
*
* @param cfg the cloned, prototype-free configuration object
* @param key the configuration property to read
* @param fallback the set to use when the option is absent or not an array
* @param options transform and optional base set to merge into
* @returns the resolved set
*/
const _resolveSetOption = function _resolveSetOption(cfg, key, fallback, options) {
	return objectHasOwnProperty(cfg, key) && arrayIsArray(cfg[key]) ? addToSet(options.base ? clone(options.base) : {}, cfg[key], options.transform) : fallback;
};
/**
* Resolve an object-valued configuration option: a prototype-free clone
* of cfg[key] when it is an own, truthy object property, else a fresh
* fallback built by makeFallback (fresh on every parse, so a previous
* parse can never leak state into the next one).
*
* @param cfg the cloned, prototype-free configuration object
* @param key the configuration property to read
* @param makeFallback builds the fallback value when the option is absent
* @returns the resolved object
*/
const _resolveObjectOption = function _resolveObjectOption(cfg, key, makeFallback) {
	const value = objectHasOwnProperty(cfg, key) ? cfg[key] : void 0;
	return value && typeof value === "object" ? clone(value) : makeFallback();
};
function createDOMPurify() {
	let window = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
	const DOMPurify = (root) => createDOMPurify(root);
	DOMPurify.version = "3.4.16";
	DOMPurify.removed = [];
	if (!window || !window.document || window.document.nodeType !== NODE_TYPE.document || !window.Element) {
		DOMPurify.isSupported = false;
		return DOMPurify;
	}
	let document = window.document;
	const originalDocument = document;
	const currentScript = originalDocument.currentScript;
	window.DocumentFragment;
	const HTMLTemplateElement = window.HTMLTemplateElement, Node = window.Node, Element = window.Element, NodeFilter = window.NodeFilter;
	window.NamedNodeMap === void 0 && (window.NamedNodeMap || window.MozNamedAttrMap);
	window.HTMLFormElement;
	const DOMParser = window.DOMParser, trustedTypes = window.trustedTypes;
	const ElementPrototype = Element.prototype;
	const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
	const remove = lookupGetter(ElementPrototype, "remove");
	const removeAttributeNode = lookupGetter(ElementPrototype, "removeAttributeNode");
	const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
	const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
	const getParentNode = lookupGetter(ElementPrototype, "parentNode");
	const getShadowRoot = lookupGetter(ElementPrototype, "shadowRoot");
	const getAttributes = lookupGetter(ElementPrototype, "attributes");
	const getNodeType = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeType") : null;
	const getNodeName = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeName") : null;
	const getOwnerDocument = Node && Node.prototype ? lookupGetter(Node.prototype, "ownerDocument") : null;
	const _readNodeType = function _readNodeType(node) {
		return getNodeType ? getNodeType(node) : node.nodeType;
	};
	const _readNodeName = function _readNodeName(node) {
		return getNodeName ? getNodeName(node) : node.nodeName;
	};
	if (typeof HTMLTemplateElement === "function") {
		const template = document.createElement("template");
		if (template.content && template.content.ownerDocument) document = template.content.ownerDocument;
	}
	let trustedTypesPolicy;
	let emptyHTML = "";
	let defaultTrustedTypesPolicy;
	let defaultTrustedTypesPolicyResolved = false;
	let IN_TRUSTED_TYPES_POLICY = 0;
	const _assertNotInTrustedTypesPolicy = function _assertNotInTrustedTypesPolicy() {
		if (IN_TRUSTED_TYPES_POLICY > 0) throw typeErrorCreate("A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the \"DOMPurify and Trusted Types\" section of the README.");
	};
	const _createTrustedHTML = function _createTrustedHTML(html) {
		_assertNotInTrustedTypesPolicy();
		IN_TRUSTED_TYPES_POLICY++;
		try {
			return trustedTypesPolicy.createHTML(html);
		} finally {
			IN_TRUSTED_TYPES_POLICY--;
		}
	};
	const _createTrustedScriptURL = function _createTrustedScriptURL(scriptUrl) {
		_assertNotInTrustedTypesPolicy();
		IN_TRUSTED_TYPES_POLICY++;
		try {
			return trustedTypesPolicy.createScriptURL(scriptUrl);
		} finally {
			IN_TRUSTED_TYPES_POLICY--;
		}
	};
	const _getDefaultTrustedTypesPolicy = function _getDefaultTrustedTypesPolicy() {
		if (!defaultTrustedTypesPolicyResolved) {
			defaultTrustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
			defaultTrustedTypesPolicyResolved = true;
		}
		return defaultTrustedTypesPolicy;
	};
	const _document = document, implementation = _document.implementation, createNodeIterator = _document.createNodeIterator, createDocumentFragment = _document.createDocumentFragment, getElementsByTagName = _document.getElementsByTagName;
	const importNode = originalDocument.importNode;
	let hooks = _createHooksMap();
	/**
	* Expose whether this browser supports running the full DOMPurify.
	*/
	DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
	const MUSTACHE_EXPR$1 = MUSTACHE_EXPR, ERB_EXPR$1 = ERB_EXPR, TMPLIT_EXPR$1 = TMPLIT_EXPR, DATA_ATTR$1 = DATA_ATTR, ARIA_ATTR$1 = ARIA_ATTR, IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA, ATTR_WHITESPACE$1 = ATTR_WHITESPACE, CUSTOM_ELEMENT$1 = CUSTOM_ELEMENT;
	let IS_ALLOWED_URI$1 = IS_ALLOWED_URI;
	/**
	* We consider the elements and attributes below to be safe. Ideally
	* don't add any new ones but feel free to remove unwanted ones.
	*/
	let ALLOWED_TAGS = null;
	const DEFAULT_ALLOWED_TAGS = addToSet({}, [
		...html$1,
		...svg$1,
		...svgFilters,
		...mathMl$1,
		...purify_es_text
	]);
	let ALLOWED_ATTR = null;
	const DEFAULT_ALLOWED_ATTR = addToSet({}, [
		...html,
		...svg,
		...mathMl,
		...xml
	]);
	let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
		tagNameCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		},
		attributeNameCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		},
		allowCustomizedBuiltInElements: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: false
		}
	}));
	let FORBID_TAGS = null;
	let FORBID_ATTR = null;
	const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
		tagCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		},
		attributeCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		}
	}));
	let ALLOW_ARIA_ATTR = true;
	let ALLOW_DATA_ATTR = true;
	let ALLOW_UNKNOWN_PROTOCOLS = false;
	let ALLOW_SELF_CLOSE_IN_ATTR = true;
	let SAFE_FOR_TEMPLATES = false;
	let SAFE_FOR_XML = true;
	let WHOLE_DOCUMENT = false;
	let SET_CONFIG = false;
	let SET_CONFIG_ALLOWED_TAGS = null;
	let SET_CONFIG_ALLOWED_ATTR = null;
	let FORCE_BODY = false;
	let RETURN_DOM = false;
	let RETURN_DOM_FRAGMENT = false;
	let RETURN_TRUSTED_TYPE = false;
	let SANITIZE_DOM = true;
	let SANITIZE_NAMED_PROPS = false;
	const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
	let KEEP_CONTENT = true;
	let IN_PLACE = false;
	let USE_PROFILES = {};
	let FORBID_CONTENTS = null;
	const DEFAULT_FORBID_CONTENTS = addToSet({}, [
		"annotation-xml",
		"audio",
		"colgroup",
		"desc",
		"foreignobject",
		"head",
		"iframe",
		"math",
		"mi",
		"mn",
		"mo",
		"ms",
		"mtext",
		"noembed",
		"noframes",
		"noscript",
		"plaintext",
		"script",
		"selectedcontent",
		"style",
		"svg",
		"template",
		"thead",
		"title",
		"video",
		"xmp"
	]);
	let DATA_URI_TAGS = null;
	const DEFAULT_DATA_URI_TAGS = addToSet({}, [
		"audio",
		"video",
		"img",
		"source",
		"image",
		"track"
	]);
	let URI_SAFE_ATTRIBUTES = null;
	const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, [
		"alt",
		"class",
		"for",
		"id",
		"label",
		"name",
		"pattern",
		"placeholder",
		"role",
		"summary",
		"title",
		"value",
		"style",
		"xmlns"
	]);
	const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
	const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
	const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
	let NAMESPACE = HTML_NAMESPACE;
	let IS_EMPTY_INPUT = false;
	let ALLOWED_NAMESPACES = null;
	const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [
		MATHML_NAMESPACE,
		SVG_NAMESPACE,
		HTML_NAMESPACE
	], stringToString);
	const DEFAULT_MATHML_TEXT_INTEGRATION_POINTS = freeze([
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext"
	]);
	let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS);
	const DEFAULT_HTML_INTEGRATION_POINTS = freeze(["annotation-xml"]);
	let HTML_INTEGRATION_POINTS = addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS);
	const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, [
		"title",
		"style",
		"font",
		"a",
		"script"
	]);
	let PARSER_MEDIA_TYPE = null;
	const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
	const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
	let transformCaseFunc = null;
	let CONFIG = null;
	const formElement = document.createElement("form");
	const isRegexOrFunction = function isRegexOrFunction(testValue) {
		return testValue instanceof RegExp || testValue instanceof Function;
	};
	/**
	* _parseConfig
	*
	* @param cfg optional config literal
	*/
	const _parseConfig = function _parseConfig() {
		let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (CONFIG && CONFIG === cfg) return;
		if (!cfg || typeof cfg !== "object") cfg = {};
		cfg = clone(cfg);
		PARSER_MEDIA_TYPE = SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
		transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
		ALLOWED_TAGS = _resolveSetOption(cfg, "ALLOWED_TAGS", DEFAULT_ALLOWED_TAGS, { transform: transformCaseFunc });
		ALLOWED_ATTR = _resolveSetOption(cfg, "ALLOWED_ATTR", DEFAULT_ALLOWED_ATTR, { transform: transformCaseFunc });
		ALLOWED_NAMESPACES = _resolveSetOption(cfg, "ALLOWED_NAMESPACES", DEFAULT_ALLOWED_NAMESPACES, { transform: stringToString });
		URI_SAFE_ATTRIBUTES = _resolveSetOption(cfg, "ADD_URI_SAFE_ATTR", DEFAULT_URI_SAFE_ATTRIBUTES, {
			transform: transformCaseFunc,
			base: DEFAULT_URI_SAFE_ATTRIBUTES
		});
		DATA_URI_TAGS = _resolveSetOption(cfg, "ADD_DATA_URI_TAGS", DEFAULT_DATA_URI_TAGS, {
			transform: transformCaseFunc,
			base: DEFAULT_DATA_URI_TAGS
		});
		FORBID_CONTENTS = _resolveSetOption(cfg, "FORBID_CONTENTS", DEFAULT_FORBID_CONTENTS, { transform: transformCaseFunc });
		FORBID_TAGS = _resolveSetOption(cfg, "FORBID_TAGS", clone({}), { transform: transformCaseFunc });
		FORBID_ATTR = _resolveSetOption(cfg, "FORBID_ATTR", clone({}), { transform: transformCaseFunc });
		USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES && typeof cfg.USE_PROFILES === "object" ? clone(cfg.USE_PROFILES) : cfg.USE_PROFILES : false;
		ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
		ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
		ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
		ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
		SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
		SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
		WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
		RETURN_DOM = cfg.RETURN_DOM || false;
		RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
		RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
		FORCE_BODY = cfg.FORCE_BODY || false;
		SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
		SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
		KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
		IN_PLACE = cfg.IN_PLACE || false;
		IS_ALLOWED_URI$1 = isRegex(cfg.ALLOWED_URI_REGEXP) ? cfg.ALLOWED_URI_REGEXP : IS_ALLOWED_URI;
		NAMESPACE = typeof cfg.NAMESPACE === "string" ? cfg.NAMESPACE : HTML_NAMESPACE;
		MATHML_TEXT_INTEGRATION_POINTS = _resolveObjectOption(cfg, "MATHML_TEXT_INTEGRATION_POINTS", () => addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS));
		HTML_INTEGRATION_POINTS = _resolveObjectOption(cfg, "HTML_INTEGRATION_POINTS", () => addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS));
		const customElementHandling = _resolveObjectOption(cfg, "CUSTOM_ELEMENT_HANDLING", () => create(null));
		CUSTOM_ELEMENT_HANDLING = create(null);
		if (objectHasOwnProperty(customElementHandling, "tagNameCheck") && isRegexOrFunction(customElementHandling.tagNameCheck)) CUSTOM_ELEMENT_HANDLING.tagNameCheck = customElementHandling.tagNameCheck;
		if (objectHasOwnProperty(customElementHandling, "attributeNameCheck") && isRegexOrFunction(customElementHandling.attributeNameCheck)) CUSTOM_ELEMENT_HANDLING.attributeNameCheck = customElementHandling.attributeNameCheck;
		if (objectHasOwnProperty(customElementHandling, "allowCustomizedBuiltInElements") && typeof customElementHandling.allowCustomizedBuiltInElements === "boolean") CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = customElementHandling.allowCustomizedBuiltInElements;
		seal(CUSTOM_ELEMENT_HANDLING);
		if (SAFE_FOR_TEMPLATES) ALLOW_DATA_ATTR = false;
		if (RETURN_DOM_FRAGMENT) RETURN_DOM = true;
		if (USE_PROFILES) {
			ALLOWED_TAGS = addToSet({}, purify_es_text);
			ALLOWED_ATTR = create(null);
			if (USE_PROFILES.html === true) {
				addToSet(ALLOWED_TAGS, html$1);
				addToSet(ALLOWED_ATTR, html);
			}
			if (USE_PROFILES.svg === true) {
				addToSet(ALLOWED_TAGS, svg$1);
				addToSet(ALLOWED_ATTR, svg);
				addToSet(ALLOWED_ATTR, xml);
			}
			if (USE_PROFILES.svgFilters === true) {
				addToSet(ALLOWED_TAGS, svgFilters);
				addToSet(ALLOWED_ATTR, svg);
				addToSet(ALLOWED_ATTR, xml);
			}
			if (USE_PROFILES.mathMl === true) {
				addToSet(ALLOWED_TAGS, mathMl$1);
				addToSet(ALLOWED_ATTR, mathMl);
				addToSet(ALLOWED_ATTR, xml);
			}
		}
		EXTRA_ELEMENT_HANDLING.tagCheck = null;
		EXTRA_ELEMENT_HANDLING.attributeCheck = null;
		if (objectHasOwnProperty(cfg, "ADD_TAGS")) {
			if (typeof cfg.ADD_TAGS === "function") EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
			else if (arrayIsArray(cfg.ADD_TAGS)) {
				if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) ALLOWED_TAGS = clone(ALLOWED_TAGS);
				addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
			}
		}
		if (objectHasOwnProperty(cfg, "ADD_ATTR")) {
			if (typeof cfg.ADD_ATTR === "function") EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
			else if (arrayIsArray(cfg.ADD_ATTR)) {
				if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) ALLOWED_ATTR = clone(ALLOWED_ATTR);
				addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
			}
		}
		if (objectHasOwnProperty(cfg, "ADD_FORBID_CONTENTS") && arrayIsArray(cfg.ADD_FORBID_CONTENTS)) {
			if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) FORBID_CONTENTS = clone(FORBID_CONTENTS);
			addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
		}
		if (KEEP_CONTENT) ALLOWED_TAGS["#text"] = true;
		if (WHOLE_DOCUMENT) addToSet(ALLOWED_TAGS, [
			"html",
			"head",
			"body"
		]);
		if (ALLOWED_TAGS.table) {
			addToSet(ALLOWED_TAGS, ["tbody"]);
			delete FORBID_TAGS.tbody;
		}
		if (cfg.TRUSTED_TYPES_POLICY) {
			if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") throw typeErrorCreate("TRUSTED_TYPES_POLICY configuration option must provide a \"createHTML\" hook.");
			if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") throw typeErrorCreate("TRUSTED_TYPES_POLICY configuration option must provide a \"createScriptURL\" hook.");
			const previousTrustedTypesPolicy = trustedTypesPolicy;
			trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
			try {
				emptyHTML = _createTrustedHTML("");
			} catch (error) {
				trustedTypesPolicy = previousTrustedTypesPolicy;
				throw error;
			}
		} else if (cfg.TRUSTED_TYPES_POLICY === null) {
			trustedTypesPolicy = void 0;
			emptyHTML = "";
		} else {
			if (trustedTypesPolicy === void 0) trustedTypesPolicy = _getDefaultTrustedTypesPolicy();
			if (trustedTypesPolicy && typeof emptyHTML === "string") emptyHTML = _createTrustedHTML("");
		}
		if (freeze) freeze(cfg);
		CONFIG = cfg;
	};
	const ALL_SVG_TAGS = addToSet({}, [
		...svg$1,
		...svgFilters,
		...svgDisallowed
	]);
	const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
	/**
	* Namespace rules for an element in the SVG namespace.
	*
	* @param tagName the element's lowercase tag name
	* @param parent the (possibly simulated) parent node
	* @param parentTagName the parent's lowercase tag name
	* @returns true if a spec-compliant parser could produce this element
	*/
	const _checkSvgNamespace = function _checkSvgNamespace(tagName, parent, parentTagName) {
		if (parent.namespaceURI === HTML_NAMESPACE) return tagName === "svg";
		if (parent.namespaceURI === MATHML_NAMESPACE) return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
		return Boolean(ALL_SVG_TAGS[tagName]);
	};
	/**
	* Namespace rules for an element in the MathML namespace.
	*
	* @param tagName the element's lowercase tag name
	* @param parent the (possibly simulated) parent node
	* @param parentTagName the parent's lowercase tag name
	* @returns true if a spec-compliant parser could produce this element
	*/
	const _checkMathMlNamespace = function _checkMathMlNamespace(tagName, parent, parentTagName) {
		if (parent.namespaceURI === HTML_NAMESPACE) return tagName === "math";
		if (parent.namespaceURI === SVG_NAMESPACE) return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
		return Boolean(ALL_MATHML_TAGS[tagName]);
	};
	/**
	* Namespace rules for an element in the HTML namespace.
	*
	* @param tagName the element's lowercase tag name
	* @param parent the (possibly simulated) parent node
	* @param parentTagName the parent's lowercase tag name
	* @returns true if a spec-compliant parser could produce this element
	*/
	const _checkHtmlNamespace = function _checkHtmlNamespace(tagName, parent, parentTagName) {
		if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) return false;
		if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) return false;
		return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
	};
	/**
	* @param element a DOM element whose namespace is being checked
	* @returns Return false if the element has a
	*  namespace that a spec-compliant parser would never
	*  return. Return true otherwise.
	*/
	const _checkValidNamespace = function _checkValidNamespace(element) {
		let parent = getParentNode(element);
		if (!parent || !parent.tagName) parent = {
			namespaceURI: NAMESPACE,
			tagName: "template"
		};
		const tagName = stringToLowerCase(element.tagName);
		const parentTagName = stringToLowerCase(parent.tagName);
		if (!ALLOWED_NAMESPACES[element.namespaceURI]) return false;
		if (element.namespaceURI === SVG_NAMESPACE) return _checkSvgNamespace(tagName, parent, parentTagName);
		if (element.namespaceURI === MATHML_NAMESPACE) return _checkMathMlNamespace(tagName, parent, parentTagName);
		if (element.namespaceURI === HTML_NAMESPACE) return _checkHtmlNamespace(tagName, parent, parentTagName);
		if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) return true;
		return false;
	};
	/**
	* _forceRemove
	*
	* @param node a DOM node
	*/
	const _forceRemove = function _forceRemove(node) {
		arrayPush(DOMPurify.removed, { element: node });
		try {
			getParentNode(node).removeChild(node);
		} catch (_) {
			remove(node);
			if (!getParentNode(node)) throw typeErrorCreate("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
		}
	};
	/**
	* _stripAttributeNode
	*
	* Remove a single Attr node case/namespace-exactly on an attribute-teardown
	* path. Name-based removeAttribute() ASCII-lowercases its lookup key for an
	* HTML element in an HTML document and so silently misses a case-preserved
	* handler (e.g. `ONERROR` off an XML/XHTML import) - the same defect
	* _removeAttribute() was fixed for, which a name-based call would reintroduce
	* on these IN_PLACE teardown paths. Unlike _removeAttribute this does not
	* record into DOMPurify.removed: the neutralize passes intentionally do not
	* book-keep. A clobbered/detached node falls back to best-effort name-based
	* removal.
	*
	* @param element the element to strip the attribute from
	* @param attribute the Attr node to remove
	* @param name the attribute's name, for the fallback path
	*/
	const _stripAttributeNode = function _stripAttributeNode(element, attribute, name) {
		try {
			removeAttributeNode(element, attribute);
		} catch (_) {
			try {
				element.removeAttribute(name);
			} catch (_) {}
		}
	};
	/**
	* _neutralizeRoot
	*
	* Fail-closed teardown of an in-place root after the sanitize walk aborts
	* (campaign-3 F2). An internal throw mid-walk — e.g. a page-registered
	* custom element's reaction detaches a node so `_forceRemove`'s deliberate
	* parentless guard throws, or any other re-entrant engine mutation — would
	* otherwise leave the caller's *live* tree half-sanitized, with everything
	* after the abort point still carrying its handlers. There is no safe way
	* to resume the walk (the tree mutated under us), so we strip the root bare:
	* remove every child and every attribute, then let the caller's catch see
	* the original error. Clobber-safe (cached `remove`/`childNodes`/`attributes`
	* getters; the root was already clobber-pre-flighted at the IN_PLACE entry).
	*
	* @param root the in-place root to empty
	*/
	const _neutralizeRoot = function _neutralizeRoot(root) {
		_neutralizeSubtree(root);
		const childNodes = getChildNodes(root);
		if (childNodes) {
			const snapshot = [];
			arrayForEach(childNodes, (child) => {
				arrayPush(snapshot, child);
			});
			arrayForEach(snapshot, (child) => {
				try {
					remove(child);
				} catch (_) {}
			});
		}
		const attributes = getAttributes(root);
		if (attributes) for (let i = attributes.length - 1; i >= 0; --i) {
			const attribute = attributes[i];
			const name = attribute && attribute.name;
			if (typeof name === "string") _stripAttributeNode(root, attribute, name);
		}
	};
	/**
	* _removeAttribute
	*
	* Name-based getAttributeNode()/removeAttribute() ASCII-lowercase their
	* lookup key for HTML elements in an HTML document, so they silently miss an
	* attribute whose stored qualified name still contains uppercase ASCII
	* letters. That happens when the node came from a case-preserving source
	* (an XML/XHTML document imported via importNode(), or createAttributeNS()),
	* where e.g. `ONERROR` survives the walk: the policy check lowercases to
	* `onerror` and rejects it, but `removeAttribute('ONERROR')` looks up
	* `onerror` and finds nothing. Remove the exact Attr node instead, which is
	* case- and namespace-exact, and fall back to name-based removal only when
	* the caller could not supply the node.
	*
	* @param name an Attribute name
	* @param element a DOM node
	* @param attr the exact Attr node to remove, when the caller has it
	*/
	const _removeAttribute = function _removeAttribute(name, element, attr) {
		if (!attr) try {
			attr = element.getAttributeNode(name);
		} catch (_) {
			attr = null;
		}
		arrayPush(DOMPurify.removed, {
			attribute: attr || null,
			from: element
		});
		try {
			if (attr) removeAttributeNode(element, attr);
			else element.removeAttribute(name);
		} catch (_) {
			try {
				element.removeAttribute(name);
			} catch (_) {}
		}
		if (name === "is") {
			if (RETURN_DOM || RETURN_DOM_FRAGMENT) try {
				_forceRemove(element);
			} catch (_) {}
			else try {
				element.setAttribute(name, "");
			} catch (_) {}
		}
	};
	/**
	* _stripDisallowedAttributes
	*
	* Removes every attribute the active configuration does not allow from a
	* single element, using the same allowlist as the main attribute pass (so
	* `on*` handlers go, but no `/^on/` blocklist is introduced). Used only to
	* neutralise nodes that are being discarded from an in-place tree.
	*
	* @param element the element to strip
	*/
	const _stripDisallowedAttributes = function _stripDisallowedAttributes(element) {
		const attributes = getAttributes(element);
		if (!attributes) return;
		for (let i = attributes.length - 1; i >= 0; --i) {
			const attribute = attributes[i];
			const name = attribute && attribute.name;
			if (typeof name !== "string" || ALLOWED_ATTR[transformCaseFunc(name)]) continue;
			_stripAttributeNode(element, attribute, name);
		}
	};
	/**
	* _neutralizeSubtree
	*
	* Completes the audit-5 F1 fix across every removal path. The KEEP_CONTENT
	* move-hoist neutralises only disallowed-tag removals; clobber, mXSS-canary,
	* namespace, comment, processing-instruction and KEEP_CONTENT:false removals
	* all drop their subtree wholesale via `_forceRemove`. On the IN_PLACE path
	* those dropped nodes are detached from the caller's LIVE tree but a
	* handler-bearing original among them (an `<img onerror>`/`<video>` that was
	* loading) keeps its queued resource event, which fires in page scope after
	* sanitize returns. This walks a removed subtree and strips every attribute
	* the active configuration does not allow — so `on*` handlers are cancelled
	* through the SAME allowlist that governs kept nodes, not a separate `/^on/`
	* blocklist. Run synchronously before sanitize returns, i.e. before any
	* queued event can fire. Hook-free by design: these nodes leave the output,
	* so firing attribute hooks for them would be surprising. Clobber-safe reads;
	* a doomed clobbered node may shadow `removeAttribute` (its own attributes are
	* irrelevant — it is discarded — while its non-clobbered descendants, e.g.
	* the `<img>`, are reached and scrubbed).
	*
	* @param root the root of a removed subtree to neutralise
	*/
	const _neutralizeSubtree = function _neutralizeSubtree(root) {
		const stack = [root];
		while (stack.length > 0) {
			const node = stack.pop();
			if (_readNodeType(node) === NODE_TYPE.element) _stripDisallowedAttributes(node);
			const childNodes = getChildNodes(node);
			if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push(childNodes[i]);
		}
	};
	/**
	* _neutralizePatchLinkage
	*
	* IN_PLACE entry pre-pass (declarative-partial-updates / streaming
	* hardening, https://github.com/WICG/declarative-partial-updates).
	*
	* The main walk strips patch linkage (`for`/`patchsrc`) and removes range
	* markers (PIs / markup comments) node-by-node, in document order, AS it
	* reaches each node. On a live in-place root that leaves a window: from the
	* moment the root is connected until the walk arrives at a given node, that
	* node's linkage is live. A patch applied on connection/stream can fire as
	* a microtask during the walk and inject or teleport an unsanitized DOM
	* range into a region the iterator has already passed and will not revisit,
	* so the post-return "tree is sanitized" contract is violated. Sweep the
	* whole tree once up front and sever every linkage before the walk begins,
	* closing that window.
	*
	* This CANNOT undo a patch that already fired before sanitize ran — that is
	* the irreducible "do not IN_PLACE a live-connected attacker tree" caveat —
	* but it closes everything from sanitize-start onward. Gated on SAFE_FOR_XML
	* to group with the rest of the declarative-partial-updates handling and
	* stay overridable, consistent with the codebase.
	*
	* Clobber-safe traversal (cached childNodes getter); per-node try/catch so a
	* clobbered root cannot defeat the sweep of its non-clobbered descendants.
	*
	* NOTE (pending real-Chrome confirmation, see test/declarative-patch-probe
	* .html Q1): this mirrors the existing policy of keeping `for` on
	* <label>/<output>. If the shipping feature can drive a patch through a
	* surviving `for`-on-label/output + `id` pair, this pre-pass and the
	* attribute check at _isBasicCustomElement's caller must additionally drop
	* that pair on the IN_PLACE path. Left as-is until the taxonomy is verified.
	*
	* @param root the in-place root to sweep
	*/
	/**
	* Central policy for declarative-partial-updates patch-linkage attributes,
	* shared by the _neutralizePatchLinkage pre-pass and _isValidAttribute so
	* the two sites cannot drift: `patchsrc` always links, `for` links
	* everywhere except on <label>/<output>, and the whole policy is gated on
	* SAFE_FOR_XML (see the rationale block in _isValidAttribute).
	*
	* @param lcName the transformCaseFunc'd attribute name
	* @param lcTag the transformCaseFunc'd tag name of the carrying element
	* @return true if the attribute is patch linkage and must be dropped
	*/
	const _isPatchLinkageAttribute = function _isPatchLinkageAttribute(lcName, lcTag) {
		if (!SAFE_FOR_XML) return false;
		if (lcName === "patchsrc") return true;
		return lcName === "for" && lcTag !== "label" && lcTag !== "output";
	};
	const _neutralizePatchLinkage = function _neutralizePatchLinkage(root) {
		if (!SAFE_FOR_XML) return;
		const stack = [root];
		while (stack.length > 0) {
			const node = stack.pop();
			const nodeType = _readNodeType(node);
			if (nodeType === NODE_TYPE.processingInstruction || nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, node.data)) {
				try {
					remove(node);
				} catch (_) {}
				continue;
			}
			if (nodeType === NODE_TYPE.element) {
				const element = node;
				const lcTag = transformCaseFunc(_readNodeName(node));
				try {
					if (element.hasAttribute && element.hasAttribute("patchsrc")) element.removeAttribute("patchsrc");
					if (element.hasAttribute && element.hasAttribute("for") && _isPatchLinkageAttribute("for", lcTag)) element.removeAttribute("for");
				} catch (_) {}
			}
			const childNodes = getChildNodes(node);
			if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push(childNodes[i]);
		}
	};
	/**
	* _initDocument
	*
	* @param dirty - a string of dirty markup
	* @return a DOM, filled with the dirty markup
	*/
	const _initDocument = function _initDocument(dirty) {
		let doc = null;
		let leadingWhitespace = null;
		if (FORCE_BODY) dirty = "<remove></remove>" + dirty;
		else {
			const matches = stringMatch(dirty, /^[\r\n\t ]+/);
			leadingWhitespace = matches && matches[0];
		}
		if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) dirty = "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head></head><body>" + dirty + "</body></html>";
		const dirtyPayload = trustedTypesPolicy ? _createTrustedHTML(dirty) : dirty;
		if (NAMESPACE === HTML_NAMESPACE) try {
			doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
		} catch (_) {}
		if (!doc || !doc.documentElement) {
			doc = implementation.createDocument(NAMESPACE, "template", null);
			try {
				doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
			} catch (_) {}
		}
		const body = doc.body || doc.documentElement;
		if (dirty && leadingWhitespace) body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
		if (NAMESPACE === HTML_NAMESPACE) return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
		return WHOLE_DOCUMENT ? doc.documentElement : body;
	};
	/**
	* Creates a NodeIterator object that you can use to traverse filtered lists of nodes or elements in a document.
	*
	* @param root The root element or node to start traversing on.
	* @return The created NodeIterator
	*/
	const _createNodeIterator = function _createNodeIterator(root) {
		const doc = getOwnerDocument ? getOwnerDocument(root) : root.ownerDocument;
		return createNodeIterator.call(doc || root, root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION, null);
	};
	/**
	* Replace template expression syntax (mustache, ERB, template
	* literal) with a space; shared by all SAFE_FOR_TEMPLATES scrub
	* sites. Order matters: mustache, then ERB, then template literal.
	*
	* @param value the string to scrub
	* @returns the scrubbed string
	*/
	const _stripTemplateExpressions = function _stripTemplateExpressions(value) {
		value = stringReplace(value, MUSTACHE_EXPR$1, " ");
		value = stringReplace(value, ERB_EXPR$1, " ");
		value = stringReplace(value, TMPLIT_EXPR$1, " ");
		return value;
	};
	/**
	* Strip template-engine expressions ({{...}}, ${...}, <%...%>) from the
	* character data of an element subtree. Used as the final safety net for
	* SAFE_FOR_TEMPLATES on every DOM-returning code path so that expressions
	* which only form after text-node normalization (e.g. fragments split across
	* stripped elements) cannot survive into a template-evaluating framework.
	*
	* Walks text/comment/CDATA/processing-instruction nodes and mutates `.data`
	* in place rather than round-tripping through innerHTML. This preserves
	* descendant node references (important for IN_PLACE callers), avoids a
	* serialize/reparse cycle, and reads literal character data — which means
	* `<%...%>` in text content matches the ERB regex against its real bytes
	* instead of the HTML-entity-escaped form innerHTML would produce.
	*
	* Attribute values are not visited here; SAFE_FOR_TEMPLATES handling for
	* attributes is performed during the per-node `_sanitizeAttributes` pass.
	*
	* @param node The root element whose character data should be scrubbed.
	*/
	const _scrubTemplateExpressions2 = function _scrubTemplateExpressions(node) {
		var _node$querySelectorAl;
		node.normalize();
		const doc = getOwnerDocument ? getOwnerDocument(node) : node.ownerDocument;
		const walker = createNodeIterator.call(doc || node, node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_CDATA_SECTION | NodeFilter.SHOW_PROCESSING_INSTRUCTION, null);
		let currentNode = walker.nextNode();
		while (currentNode) {
			currentNode.data = _stripTemplateExpressions(currentNode.data);
			currentNode = walker.nextNode();
		}
		const templates = (_node$querySelectorAl = node.querySelectorAll) === null || _node$querySelectorAl === void 0 ? void 0 : _node$querySelectorAl.call(node, "template");
		if (templates) arrayForEach(templates, (tmpl) => {
			if (_isDocumentFragment(tmpl.content)) _scrubTemplateExpressions2(tmpl.content);
		});
	};
	/**
	* _isClobbered
	*
	* Detect DOM-clobbering on HTMLFormElement nodes. Form is the only HTML
	* interface with [LegacyOverrideBuiltIns]; a descendant element with a
	* `name` attribute matching a prototype property shadows that property
	* on direct reads. We use this check at the IN_PLACE entry-point and
	* during attribute sanitization to refuse clobbered forms.
	*
	* @param element element to check for clobbering attacks
	* @return true if clobbered, false if safe
	*/
	const _isClobbered = function _isClobbered(element) {
		const realTagName = getNodeName ? getNodeName(element) : null;
		if (typeof realTagName !== "string") return false;
		if (transformCaseFunc(realTagName) !== "form") return false;
		return typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || element.attributes !== getAttributes(element) || typeof element.removeAttribute !== "function" || typeof element.removeAttributeNode !== "function" || typeof element.getAttributeNode !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function" || element.nodeType !== getNodeType(element) || element.childNodes !== getChildNodes(element);
	};
	/**
	* Checks whether the given value is a DocumentFragment from any realm.
	*
	* The realm-independent replacement reads `nodeType` through the cached
	* Node.prototype getter and compares to the DOCUMENT_FRAGMENT_NODE
	* constant (11). nodeType is a numeric value resolved from the node's
	* internal slot, identical across realms for the same kind of node.
	*
	* @param value object to check
	* @return true if value is a DocumentFragment-shaped node from any realm
	*/
	const _isDocumentFragment = function _isDocumentFragment(value) {
		if (!getNodeType || typeof value !== "object" || value === null) return false;
		try {
			return getNodeType(value) === NODE_TYPE.documentFragment;
		} catch (_) {
			return false;
		}
	};
	/**
	* Checks whether the given object is a DOM node, including nodes that
	* originate from a different window/realm (e.g. an iframe's
	* contentDocument). The previous `value instanceof Node` check was
	* realm-bound: nodes from a different window failed it, causing
	* sanitize() to silently stringify them and reset IN_PLACE to false,
	* returning the original node unsanitized. See GHSA-4w3q-35jp-p934.
	*
	* @param value object to check whether it's a DOM node
	* @return true if value is a DOM node from any realm
	*/
	const _isNode = function _isNode(value) {
		if (!getNodeType || typeof value !== "object" || value === null) return false;
		try {
			return typeof getNodeType(value) === "number";
		} catch (_) {
			return false;
		}
	};
	function _executeHooks(hooks, currentNode, data) {
		if (hooks.length === 0) return;
		arrayForEach(hooks, (hook) => {
			hook.call(DOMPurify, currentNode, data, CONFIG);
		});
	}
	/**
	* Structural-threat checks that condemn a node regardless of the
	* allowlists: mXSS via namespace confusion, risky CSS construction,
	* processing instructions, markup-bearing comments. Pure predicate;
	* the caller removes. Check order is load-bearing.
	*
	* @param currentNode the node to inspect
	* @param tagName the node's transformCaseFunc'd tag name
	* @return true if the node must be removed
	*/
	const _isUnsafeNode = function _isUnsafeNode(currentNode, tagName) {
		if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.textContent) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.innerHTML)) return true;
		if (SAFE_FOR_XML && currentNode.namespaceURI === HTML_NAMESPACE && LITERAL_TEXT_ELEMENTS[tagName] && (_isNode(currentNode.firstElementChild) || typeof currentNode.textContent === "string" && regExpTest(LITERAL_TEXT_CLOSE[tagName], currentNode.textContent))) return true;
		if (currentNode.nodeType === NODE_TYPE.processingInstruction) return true;
		if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, currentNode.data)) return true;
		return false;
	};
	/**
	* Evaluate a CUSTOM_ELEMENT_HANDLING check (a RegExp or a predicate
	* function, per the validation in _parseConfig) against a name.
	* Additional arguments are forwarded to predicate functions - the
	* attributeNameCheck predicate receives the tag name as its second
	* argument. A null/absent check never matches.
	*
	* @param check the configured tagNameCheck / attributeNameCheck value
	* @param name the name to test
	* @param args extra arguments forwarded to a predicate function
	* @return true if the check matches the name
	*/
	const _matchesNameCheck = function _matchesNameCheck(check, name) {
		if (check instanceof RegExp) return regExpTest(check, name);
		if (check instanceof Function) {
			for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
			return Boolean(check(name, ...args));
		}
		return false;
	};
	/**
	* Handle a node whose tag is forbidden or not allowlisted: keep
	* allowed custom elements (false return exits _sanitizeElements
	* early - the namespace and fallback-tag removal checks are
	* intentionally skipped for kept custom elements), else hoist
	* content per KEEP_CONTENT and remove.
	*
	* A kept custom element is the ONLY case in which this function
	* returns false, so the caller uses that return value to run the
	* afterSanitizeElements hook on the kept element and keep the
	* element-hook lifecycle consistent with normal allowlisted
	* elements (GHSA-c2j3-45gr-mqc4).
	*
	* @param currentNode the disallowed node
	* @param tagName the node's transformCaseFunc'd tag name
	* @return true if the node was removed, false if kept
	*/
	const _sanitizeDisallowedNode = function _sanitizeDisallowedNode(currentNode, tagName, root) {
		if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName) && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) return false;
		if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
			const parentNode = getParentNode(currentNode);
			const childNodes = getChildNodes(currentNode);
			if (childNodes && parentNode) {
				const childCount = childNodes.length;
				for (let i = childCount - 1; i >= 0; --i) {
					const hoisted = currentNode === root ? cloneNode(childNodes[i], true) : childNodes[i];
					parentNode.insertBefore(hoisted, getNextSibling(currentNode));
				}
			}
		}
		_forceRemove(currentNode);
		return true;
	};
	/**
	* Fork a hook-mutable allowlist off its shared binding the first time a
	* (possibly lazily-installed) uponSanitize* hook is about to see it, so the
	* hook cannot widen the per-instance default or the setConfig binding by
	* reference and leak past the call. Returns the set unchanged once it is
	* already call-local, so repeated calls across elements are idempotent.
	*
	* @param hookList the uponSanitize* hook array for this event
	* @param set the current ALLOWED_TAGS / ALLOWED_ATTR binding
	* @param defaultSet the per-instance DEFAULT_ALLOWED_* constant
	* @param setConfigSet the captured setConfig() binding, or null
	* @return a call-local clone if a hook is present and set is still shared,
	*   else set unchanged
	*/
	const _forkSharedAllowlist = function _forkSharedAllowlist(hookList, set, defaultSet, setConfigSet) {
		if (hookList.length === 0) return set;
		return set === defaultSet || set === setConfigSet ? clone(set) : set;
	};
	/**
	* Shared guard for a node that a hook has detached from the walk tree,
	* used after each element-hook site in _sanitizeElements. Detaching is a
	* long-standing user pattern (issue #469; draw.io-style foreignObject
	* filtering). Per the cached, unclobberable parentNode getter the node is
	* genuinely out of the tree, so it can reach neither the serialized
	* output nor an IN_PLACE live tree; treat it as removed and stop
	* processing it. Without this guard, the unsafe-node / namespace checks
	* would call _forceRemove on a parentless node and hit the REPORT-3
	* fail-closed throw — which exists for nodes DOMPurify wants gone but
	* *cannot* detach (clobbered / parentless roots), the opposite of a node
	* that is already safely gone. The walk root is exempt: a detached
	* IN_PLACE root is legitimate input and must still be fully sanitized,
	* and a kill-decision on it must keep hitting the REPORT-3 throw.
	*
	* Nodes detached by hooks stay the hook's responsibility for placement:
	* they are not recorded in DOMPurify.removed, so the post-walk IN_PLACE
	* pass (which iterates DOMPurify.removed) does not reach them. But a
	* hook-detached subtree can still hold a queued resource-event handler -
	* e.g. an <img onload> that began loading when the caller built the live
	* tree - which fires in page scope after sanitize returns even though the
	* handler never reached the returned tree. That is the audit-5 F1 hazard,
	* and the documented node.remove() hook pattern walks straight into it.
	* So on the IN_PLACE path we neutralize the detached subtree inline,
	* stripping its non-allow-listed attributes before returning, exactly as
	* the post-walk pass does for _forceRemove'd subtrees.
	*
	* @param currentNode the node a hook may have detached
	* @param root the current walk root
	* @return true if the node is detached and now handled, false otherwise
	*/
	const _handleHookDetachedNode = function _handleHookDetachedNode(currentNode, root) {
		if (currentNode === root || getParentNode(currentNode) !== null) return false;
		if (IN_PLACE) _neutralizeSubtree(currentNode);
		return true;
	};
	/**
	* _sanitizeElements
	*
	* @protect nodeName
	* @protect textContent
	* @protect removeChild
	* @param currentNode to check for permission to exist
	* @return true if node was killed, false if left alive
	*/
	const _sanitizeElements = function _sanitizeElements(currentNode, root) {
		_executeHooks(hooks.beforeSanitizeElements, currentNode, null);
		if (_handleHookDetachedNode(currentNode, root)) return true;
		if (_isClobbered(currentNode)) {
			_forceRemove(currentNode);
			return true;
		}
		const tagName = transformCaseFunc(_readNodeName(currentNode));
		ALLOWED_TAGS = _forkSharedAllowlist(hooks.uponSanitizeElement, ALLOWED_TAGS, DEFAULT_ALLOWED_TAGS, SET_CONFIG_ALLOWED_TAGS);
		_executeHooks(hooks.uponSanitizeElement, currentNode, {
			tagName,
			allowedTags: ALLOWED_TAGS
		});
		if (_handleHookDetachedNode(currentNode, root)) return true;
		if (_isUnsafeNode(currentNode, tagName)) {
			_forceRemove(currentNode);
			return true;
		}
		if (FORBID_TAGS[tagName] || !(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && !ALLOWED_TAGS[tagName]) {
			const removed = _sanitizeDisallowedNode(currentNode, tagName, root);
			if (removed === false) {
				_executeHooks(hooks.afterSanitizeElements, currentNode, null);
				if (_handleHookDetachedNode(currentNode, root)) return true;
			}
			return removed;
		}
		if (_readNodeType(currentNode) === NODE_TYPE.element && !_checkValidNamespace(currentNode)) {
			_forceRemove(currentNode);
			return true;
		}
		if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(FALLBACK_TAG_CLOSE, currentNode.innerHTML)) {
			_forceRemove(currentNode);
			return true;
		}
		if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
			const content = _stripTemplateExpressions(currentNode.textContent);
			if (currentNode.textContent !== content) {
				arrayPush(DOMPurify.removed, { element: currentNode.cloneNode() });
				currentNode.textContent = content;
			}
		}
		_executeHooks(hooks.afterSanitizeElements, currentNode, null);
		return _handleHookDetachedNode(currentNode, root);
	};
	/**
	* _isValidAttribute
	*
	* @param lcTag Lowercase tag name of containing element.
	* @param lcName Lowercase attribute name.
	* @param value Attribute value.
	* @return Returns true if `value` is valid, otherwise false.
	*/
	const _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
		if (FORBID_ATTR[lcName]) return false;
		if (_isPatchLinkageAttribute(lcName, lcTag)) return false;
		if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document || value in formElement)) return false;
		const nameIsPermitted = ALLOWED_ATTR[lcName] || EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag);
		if (ALLOW_DATA_ATTR && regExpTest(DATA_ATTR$1, lcName)) return true;
		if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName)) return true;
		if (!nameIsPermitted) return _isBasicCustomElement(lcTag) && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName, lcTag) || lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value);
		if (URI_SAFE_ATTRIBUTES[lcName]) return true;
		if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) return true;
		if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) return true;
		if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) return true;
		return !value;
	};
	const RESERVED_CUSTOM_ELEMENT_NAMES = addToSet({}, [
		"annotation-xml",
		"color-profile",
		"font-face",
		"font-face-format",
		"font-face-name",
		"font-face-src",
		"font-face-uri",
		"missing-glyph"
	]);
	/**
	* _isBasicCustomElement
	* checks if at least one dash is included in tagName, and it's not the first char
	* for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
	*
	* @param tagName name of the tag of the node to sanitize
	* @returns Returns true if the tag name meets the basic criteria for a custom element, otherwise false.
	*/
	const _isBasicCustomElement = function _isBasicCustomElement(tagName) {
		return !RESERVED_CUSTOM_ELEMENT_NAMES[stringToLowerCase(tagName)] && regExpTest(CUSTOM_ELEMENT$1, tagName);
	};
	/**
	* Wrap an attribute value in the matching Trusted Types object when
	* the active policy requires it. Namespaced attributes pass through
	* unchanged (no TT support yet, see
	* https://bugs.chromium.org/p/chromium/issues/detail?id=1305293).
	*
	* @param lcTag lowercase tag name of the containing element
	* @param lcName lowercase attribute name
	* @param namespaceURI the attribute's namespace, if any
	* @param value the attribute value to wrap
	* @return the value, wrapped when Trusted Types demand it
	*/
	const _applyTrustedTypesToAttribute = function _applyTrustedTypesToAttribute(lcTag, lcName, namespaceURI, value) {
		if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function" && !namespaceURI) switch (trustedTypes.getAttributeType(lcTag, lcName)) {
			case "TrustedHTML": return _createTrustedHTML(value);
			case "TrustedScriptURL": return _createTrustedScriptURL(value);
		}
		return value;
	};
	/**
	* Write a modified attribute value back onto the element. On
	* success, re-probe for clobbering introduced by the new value and
	* remove the element when found; otherwise, when this writeback is the
	* recreate half of the SANITIZE_NAMED_PROPS remove-and-recreate, pop the
	* removal entry that path recorded so it does not show as removed. On
	* failure, remove the attribute instead.
	*
	* Returns true only on a clean write (the value was set and the new value
	* introduced no clobbering). The caller uses that, together with its own
	* knowledge of whether this attribute pushed a DOMPurify.removed record, to
	* decide whether to pop that record. The pop must happen ONLY for the
	* named-prop remove-and-recreate; popping on any other value change (trim,
	* template scrubbing, Trusted Types) would consume an unrelated _forceRemove
	* subtree-cleanup record and let that detached subtree keep a live event
	* handler through the IN_PLACE neutralization pass (SO-001).
	*
	* @param currentNode the element carrying the attribute
	* @param name the attribute name as present on the element
	* @param namespaceURI the attribute's namespace, if any
	* @param value the new attribute value
	* @return true if the value was written without introducing clobbering
	*/
	const _setAttributeValue = function _setAttributeValue(currentNode, name, namespaceURI, value) {
		try {
			if (namespaceURI) currentNode.setAttributeNS(namespaceURI, name, value);
			else currentNode.setAttribute(name, value);
			if (_isClobbered(currentNode)) {
				_forceRemove(currentNode);
				return false;
			}
			return true;
		} catch (_) {
			_removeAttribute(name, currentNode);
			return false;
		}
	};
	/**
	* _sanitizeAttributes
	*
	* @protect attributes
	* @protect nodeName
	* @protect removeAttribute
	* @protect setAttribute
	*
	* @param currentNode to sanitize
	* @param root the current walk root
	*/
	const _sanitizeAttributes = function _sanitizeAttributes(currentNode, root) {
		_executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
		if (_handleHookDetachedNode(currentNode, root)) return;
		const attributes = currentNode.attributes;
		if (!attributes || _isClobbered(currentNode)) return;
		ALLOWED_ATTR = _forkSharedAllowlist(hooks.uponSanitizeAttribute, ALLOWED_ATTR, DEFAULT_ALLOWED_ATTR, SET_CONFIG_ALLOWED_ATTR);
		const hookEvent = {
			attrName: "",
			attrValue: "",
			keepAttr: true,
			allowedAttributes: ALLOWED_ATTR,
			forceKeepAttr: void 0
		};
		let l = attributes.length;
		const lcTag = transformCaseFunc(currentNode.nodeName);
		while (l--) {
			const attr = attributes[l];
			const name = attr.name, namespaceURI = attr.namespaceURI, attrValue = attr.value;
			const lcName = transformCaseFunc(name);
			const initValue = attrValue;
			let value = name === "value" ? initValue : stringTrim(initValue);
			let recreatedNamedProp = false;
			hookEvent.attrName = lcName;
			hookEvent.attrValue = value;
			hookEvent.keepAttr = true;
			hookEvent.forceKeepAttr = void 0;
			_executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
			value = hookEvent.attrValue;
			if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name") && stringIndexOf(value, SANITIZE_NAMED_PROPS_PREFIX) !== 0) {
				_removeAttribute(name, currentNode, attr);
				value = SANITIZE_NAMED_PROPS_PREFIX + value;
				recreatedNamedProp = true;
			}
			if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, value)) {
				_removeAttribute(name, currentNode, attr);
				continue;
			}
			if (lcName === "attributename" && stringMatch(value, "href")) {
				_removeAttribute(name, currentNode, attr);
				continue;
			}
			if (hookEvent.forceKeepAttr) continue;
			if (!hookEvent.keepAttr) {
				_removeAttribute(name, currentNode, attr);
				continue;
			}
			if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(SELF_CLOSING_TAG, value)) {
				_removeAttribute(name, currentNode, attr);
				continue;
			}
			if (SAFE_FOR_TEMPLATES) value = _stripTemplateExpressions(value);
			if (!_isValidAttribute(lcTag, lcName, value)) {
				_removeAttribute(name, currentNode, attr);
				continue;
			}
			value = _applyTrustedTypesToAttribute(lcTag, lcName, namespaceURI, value);
			if (value !== initValue) {
				if (_setAttributeValue(currentNode, name, namespaceURI, value) && recreatedNamedProp) arrayPop(DOMPurify.removed);
			}
		}
		_executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
		_handleHookDetachedNode(currentNode, root);
	};
	/**
	* _sanitizeShadowDOM
	*
	* @param fragment to iterate over recursively
	*/
	const _sanitizeShadowDOM2 = function _sanitizeShadowDOM(fragment) {
		let shadowNode = null;
		const shadowIterator = _createNodeIterator(fragment);
		_executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
		while (shadowNode = shadowIterator.nextNode()) {
			_executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
			_sanitizeElements(shadowNode, fragment);
			_sanitizeAttributes(shadowNode, fragment);
			if (_isDocumentFragment(shadowNode.content)) _sanitizeShadowDOM2(shadowNode.content);
			if (_readNodeType(shadowNode) === NODE_TYPE.element) {
				const innerSr = getShadowRoot(shadowNode);
				if (_isDocumentFragment(innerSr)) {
					_sanitizeAttachedShadowRoots(innerSr);
					_sanitizeShadowDOM2(innerSr);
				}
			}
		}
		_executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
	};
	/**
	* _sanitizeAttachedShadowRoots
	*
	* Walks `root` and feeds every attached shadow root we encounter into
	* the existing _sanitizeShadowDOM pipeline. The default node iterator
	* does not descend into shadow trees, so nodes inside an attached
	* shadow root would otherwise be skipped entirely.
	*
	* Two real input paths put attached shadow roots in front of us:
	*   1. IN_PLACE on a DOM node that already has shadow roots attached.
	*   2. DOM-node input where importNode(dirty, true) deep-clones the
	*      shadow root because it was created with `clonable: true`.
	*
	* This pass runs once, up front, so the main iteration loop (and the
	* existing _sanitizeShadowDOM template-content recursion) stay
	* untouched — string-input paths are not affected.
	*
	* @param root the subtree root to walk for attached shadow roots
	*/
	const _sanitizeAttachedShadowRoots = function _sanitizeAttachedShadowRoots(root) {
		const stack = [{
			node: root,
			shadow: null
		}];
		while (stack.length > 0) {
			const item = stack.pop();
			if (item.shadow) {
				_sanitizeShadowDOM2(item.shadow);
				continue;
			}
			const node = item.node;
			const isElement = _readNodeType(node) === NODE_TYPE.element;
			const childNodes = getChildNodes(node);
			if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push({
				node: childNodes[i],
				shadow: null
			});
			if (isElement) {
				const rootName = getNodeName ? getNodeName(node) : null;
				if (typeof rootName === "string" && transformCaseFunc(rootName) === "template") {
					const content = node.content;
					if (_isDocumentFragment(content)) stack.push({
						node: content,
						shadow: null
					});
				}
			}
			if (isElement) {
				const sr = getShadowRoot(node);
				if (_isDocumentFragment(sr)) stack.push({
					node: null,
					shadow: sr
				}, {
					node: sr,
					shadow: null
				});
			}
		}
	};
	DOMPurify.sanitize = function(dirty) {
		let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		let body = null;
		let importedNode = null;
		let currentNode = null;
		let returnNode = null;
		IS_EMPTY_INPUT = !dirty;
		if (IS_EMPTY_INPUT) dirty = "<!-->";
		if (typeof dirty !== "string" && !_isNode(dirty)) {
			dirty = stringifyValue(dirty);
			if (typeof dirty !== "string") throw typeErrorCreate("dirty is not a string, aborting");
		}
		if (!DOMPurify.isSupported) return dirty;
		if (SET_CONFIG) {
			ALLOWED_TAGS = SET_CONFIG_ALLOWED_TAGS;
			ALLOWED_ATTR = SET_CONFIG_ALLOWED_ATTR;
		} else _parseConfig(cfg);
		if (hooks.uponSanitizeElement.length > 0 || hooks.uponSanitizeAttribute.length > 0) ALLOWED_TAGS = clone(ALLOWED_TAGS);
		if (hooks.uponSanitizeAttribute.length > 0) ALLOWED_ATTR = clone(ALLOWED_ATTR);
		DOMPurify.removed = [];
		const inPlace = IN_PLACE && typeof dirty !== "string" && _isNode(dirty);
		if (inPlace) {
			_neutralizePatchLinkage(dirty);
			const nn = _readNodeName(dirty);
			if (typeof nn === "string") {
				const tagName = transformCaseFunc(nn);
				if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
					_neutralizeRoot(dirty);
					throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
				}
			}
			if (_isClobbered(dirty)) {
				_neutralizeRoot(dirty);
				throw typeErrorCreate("root node is clobbered and cannot be sanitized in-place");
			}
			try {
				_sanitizeAttachedShadowRoots(dirty);
			} catch (error) {
				_neutralizeRoot(dirty);
				throw error;
			}
		} else if (_isNode(dirty)) {
			body = _initDocument("<!---->");
			importedNode = body.ownerDocument.importNode(dirty, true);
			if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") body = importedNode;
			else if (importedNode.nodeName === "HTML") body = importedNode;
			else body.appendChild(importedNode);
			_sanitizeAttachedShadowRoots(body);
		} else {
			if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && dirty.indexOf("<") === -1) return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(dirty) : dirty;
			body = _initDocument(dirty);
			if (!body) return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
		}
		if (body && FORCE_BODY) _forceRemove(body.firstChild);
		const walkRoot = inPlace ? dirty : body;
		try {
			const nodeIterator = _createNodeIterator(walkRoot);
			while (currentNode = nodeIterator.nextNode()) {
				_sanitizeElements(currentNode, walkRoot);
				_sanitizeAttributes(currentNode, walkRoot);
				if (_isDocumentFragment(currentNode.content)) _sanitizeShadowDOM2(currentNode.content);
			}
		} catch (error) {
			if (inPlace) {
				_neutralizeRoot(dirty);
				arrayForEach(DOMPurify.removed, (entry) => {
					if (entry.element) _neutralizeSubtree(entry.element);
				});
			}
			throw error;
		}
		if (inPlace) {
			let rootWasRemoved = false;
			arrayForEach(DOMPurify.removed, (entry) => {
				if (entry.element) {
					if (entry.element === dirty) rootWasRemoved = true;
					_neutralizeSubtree(entry.element);
				}
			});
			if (rootWasRemoved) throw typeErrorCreate("a node selected for removal could not be safely returned; refusing to sanitize in place");
			if (SAFE_FOR_TEMPLATES) _scrubTemplateExpressions2(dirty);
			return dirty;
		}
		if (RETURN_DOM) {
			if (SAFE_FOR_TEMPLATES) _scrubTemplateExpressions2(body);
			if (RETURN_DOM_FRAGMENT) {
				returnNode = createDocumentFragment.call(body.ownerDocument);
				while (body.firstChild) returnNode.appendChild(body.firstChild);
			} else returnNode = body;
			if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) returnNode = importNode.call(originalDocument, returnNode, true);
			return returnNode;
		}
		let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
		if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
		if (SAFE_FOR_TEMPLATES) serializedHTML = _stripTemplateExpressions(serializedHTML);
		return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(serializedHTML) : serializedHTML;
	};
	DOMPurify.setConfig = function() {
		let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		_parseConfig(cfg);
		SET_CONFIG = true;
		SET_CONFIG_ALLOWED_TAGS = ALLOWED_TAGS;
		SET_CONFIG_ALLOWED_ATTR = ALLOWED_ATTR;
	};
	DOMPurify.clearConfig = function() {
		CONFIG = null;
		SET_CONFIG = false;
		SET_CONFIG_ALLOWED_TAGS = null;
		SET_CONFIG_ALLOWED_ATTR = null;
		trustedTypesPolicy = defaultTrustedTypesPolicy;
		emptyHTML = "";
	};
	DOMPurify.isValidAttribute = function(tag, attr, value) {
		if (!CONFIG) _parseConfig({});
		const lcTag = transformCaseFunc(tag);
		const lcName = transformCaseFunc(attr);
		return _isValidAttribute(lcTag, lcName, value);
	};
	DOMPurify.addHook = function(entryPoint, hookFunction) {
		if (typeof hookFunction !== "function") return;
		if (!objectHasOwnProperty(hooks, entryPoint)) return;
		arrayPush(hooks[entryPoint], hookFunction);
	};
	DOMPurify.removeHook = function(entryPoint, hookFunction) {
		if (!objectHasOwnProperty(hooks, entryPoint)) return;
		if (hookFunction !== void 0) {
			const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
			return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
		}
		return arrayPop(hooks[entryPoint]);
	};
	DOMPurify.removeHooks = function(entryPoint) {
		if (!objectHasOwnProperty(hooks, entryPoint)) return;
		hooks[entryPoint] = [];
	};
	DOMPurify.removeAllHooks = function() {
		hooks = _createHooksMap();
	};
	return DOMPurify;
}
var purify_default = createDOMPurify();


//# sourceMappingURL=purify.es.mjs.map
;// ./src/html.js
/**
 * @fileoverview HTML sanitization for user-supplied task data
 * @license MIT
 * @package GanttElastic
 */


/**
 * Sanitize untrusted HTML - strips scripts, event handlers and other active
 * content while keeping safe markup (links, emphasis, images, ...).
 * Used wherever a task field or option is rendered through v-html.
 *
 * @param {any} html
 * @returns {string} sanitized html
 */
function sanitizeHtml(html) {
  return purify_default.sanitize(typeof html === 'string' ? html : String(html));
}

;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/TaskList/ItemColumn.vue?vue&type=script&lang=js



/* harmony default export */ const ItemColumnvue_type_script_lang_js = ({
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
});

;// ./src/components/TaskList/ItemColumn.vue?vue&type=script&lang=js
 
;// ./src/components/TaskList/ItemColumn.vue




;
const ItemColumn_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(ItemColumnvue_type_script_lang_js, [['render',ItemColumnvue_type_template_id_dafc94d4_render]])

/* harmony default export */ const ItemColumn = (ItemColumn_exports_);
;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/TaskList/TaskListItem.vue?vue&type=script&lang=js




/* harmony default export */ const TaskListItemvue_type_script_lang_js = ({
  name: 'TaskListItem',
  components: {
    TaskListExpander: Expander,
    ItemColumn: ItemColumn
  },
  inject: ['root'],
  props: ['task'],
  data() {
    return {};
  },
  methods: {
    /**
     * Keyboard interaction on a focused task list row (issue #13):
     * Enter/Space select the task, arrows move between rendered rows,
     * Escape clears the selection
     *
     * @param {event} event
     */
    onRowKeyDown(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.root.selectTask(this.task.id);
      } else if (event.key === 'Escape') {
        this.root.clearSelection();
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const rows = Array.from(document.querySelectorAll('.gantt-elastic__task-list-item'));
        const index = rows.indexOf(event.currentTarget);
        const next = rows[index + (event.key === 'ArrowDown' ? 1 : -1)];
        if (next) {
          next.focus();
        }
      }
    },

    /**
     * Row level hover events (issue #12) - non-bubbling enter/leave on the
     * row root so crossings between columns, values and the expander
     * cannot flicker the highlight
     *
     * @param {string} eventName
     * @param {event} event
     */
    emitRowEvent(eventName, event) {
      this.root.$emitBus.emit(`taskList-row-${eventName}`, { event, data: this.task });
    }
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
});

;// ./src/components/TaskList/TaskListItem.vue?vue&type=script&lang=js
 
;// ./src/components/TaskList/TaskListItem.vue




;
const TaskListItem_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(TaskListItemvue_type_script_lang_js, [['render',TaskListItemvue_type_template_id_b00214be_render]])

/* harmony default export */ const TaskListItem = (TaskListItem_exports_);
;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/TaskList/TaskList.vue?vue&type=script&lang=js



/* harmony default export */ const TaskListvue_type_script_lang_js = ({
  name: 'TaskList',
  components: {
    TaskListHeader: TaskListHeader,
    TaskListItem: TaskListItem
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
});

;// ./src/components/TaskList/TaskList.vue?vue&type=script&lang=js
 
;// ./src/components/TaskList/TaskList.vue




;
const TaskList_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(TaskListvue_type_script_lang_js, [['render',TaskListvue_type_template_id_bc5f0ea4_render]])

/* harmony default export */ const TaskList = (TaskList_exports_);
;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/Chart.vue?vue&type=template&id=1f5b83b1


const Chartvue_type_template_id_1f5b83b1_hoisted_1 = ["width", "height"]
const Chartvue_type_template_id_1f5b83b1_hoisted_2 = ["task", "onMouseenter", "onMouseleave"]

function Chartvue_type_template_id_1f5b83b1_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_calendar = (0,external_Vue_.resolveComponent)("calendar")
  const _component_days_highlight = (0,external_Vue_.resolveComponent)("days-highlight")
  const _component_grid = (0,external_Vue_.resolveComponent)("grid")
  const _component_dependency_lines = (0,external_Vue_.resolveComponent)("dependency-lines")

  return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
    class: "gantt-elastic__chart",
    style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['chart'] }),
    ref: "chart"
  }, [
    (0,external_Vue_.createElementVNode)("div", {
      class: "gantt-elastic__chart-calendar-container",
      ref: "chartCalendarContainer",
      style: (0,external_Vue_.normalizeStyle)({
        ...$options.root.style['chart-calendar-container'],
        height: $options.root.state.options.calendar.height + 'px',
        'margin-bottom': $options.root.state.options.calendar.gap + 'px'
      })
    }, [
      (0,external_Vue_.createVNode)(_component_calendar)
    ], 4 /* STYLE */),
    (0,external_Vue_.createElementVNode)("div", {
      class: "gantt-elastic__chart-graph-container",
      ref: "chartGraphContainer",
      style: (0,external_Vue_.normalizeStyle)({
        ...$options.root.style['chart-graph-container'],
        height: $options.root.state.options.height - $options.root.state.options.calendar.height + 'px'
      })
    }, [
      (0,external_Vue_.createElementVNode)("div", {
        style: (0,external_Vue_.normalizeStyle)({
          ...$options.root.style['chart-area'],
          width: $options.root.state.options.width + 'px',
          height: $options.root.state.options.rowsHeight + 'px'
        })
      }, [
        (0,external_Vue_.createElementVNode)("div", {
          class: "gantt-elastic__chart-graph",
          ref: "chartGraph",
          style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['chart-graph'], height: '100%' })
        }, [
          ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("svg", {
            class: "gantt-elastic__chart-graph-svg",
            style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['chart-graph-svg'] }),
            ref: "chartGraphSvg",
            x: "0",
            y: "0",
            width: $options.root.state.options.width + 'px',
            height: $options.root.state.options.allVisibleTasksHeight + 'px',
            role: "group",
            "aria-label": "Gantt chart timeline",
            xmlns: "http://www.w3.org/2000/svg"
          }, [
            (0,external_Vue_.createVNode)(_component_days_highlight),
            (0,external_Vue_.createVNode)(_component_grid),
            (0,external_Vue_.createVNode)(_component_dependency_lines, {
              tasks: $options.root.visibleTasks
            }, null, 8 /* PROPS */, ["tasks"]),
            ((0,external_Vue_.openBlock)(true), (0,external_Vue_.createElementBlock)(external_Vue_.Fragment, null, (0,external_Vue_.renderList)($options.root.renderedTasks, (task) => {
              return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("g", {
                class: (0,external_Vue_.normalizeClass)(["gantt-elastic__chart-row-wrapper", {
                'gantt-elastic__chart-row--selected': $options.root.state.selectedTaskId === task.id,
                'gantt-elastic__chart-row--hover': $options.root.state.hoveredTaskId === task.id
              }]),
                style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['chart-row-wrapper'], ...$options.highlightStyle(task) }),
                task: task,
                key: task.id,
                onMouseenter: $event => ($options.emitRowEvent('mouseenter', $event, task)),
                onMouseleave: $event => ($options.emitRowEvent('mouseleave', $event, task))
              }, [
                ((0,external_Vue_.openBlock)(), (0,external_Vue_.createBlock)((0,external_Vue_.resolveDynamicComponent)(task.type), { task: task }, null, 8 /* PROPS */, ["task"]))
              ], 46 /* CLASS, STYLE, PROPS, NEED_HYDRATION */, Chartvue_type_template_id_1f5b83b1_hoisted_2))
            }), 128 /* KEYED_FRAGMENT */))
          ], 12 /* STYLE, PROPS */, Chartvue_type_template_id_1f5b83b1_hoisted_1))
        ], 4 /* STYLE */)
      ], 4 /* STYLE */)
    ], 4 /* STYLE */)
  ], 4 /* STYLE */))
}
;// ./src/components/Chart/Chart.vue?vue&type=template&id=1f5b83b1

;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/Grid.vue?vue&type=template&id=d9395a04


const Gridvue_type_template_id_d9395a04_hoisted_1 = ["width", "height"]
const Gridvue_type_template_id_d9395a04_hoisted_2 = ["x1", "y1", "x2", "y2"]
const Gridvue_type_template_id_d9395a04_hoisted_3 = ["x1", "y1", "x2", "y2"]
const Gridvue_type_template_id_d9395a04_hoisted_4 = ["x1", "y1", "x2", "y2"]

function Gridvue_type_template_id_d9395a04_render(_ctx, _cache, $props, $setup, $data, $options) {
  return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("svg", {
    class: "gantt-elastic__grid-lines-wrapper",
    style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['grid-lines-wrapper'] }),
    ref: "chart",
    x: "0",
    y: "0",
    width: $options.root.state.options.width,
    height: $options.root.state.options.allVisibleTasksHeight,
    xmlns: "http://www.w3.org/2000/svg"
  }, [
    (0,external_Vue_.createElementVNode)("g", {
      class: "gantt-elastic__grid-lines",
      style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['grid-lines'] })
    }, [
      ((0,external_Vue_.openBlock)(true), (0,external_Vue_.createElementBlock)(external_Vue_.Fragment, null, (0,external_Vue_.renderList)($options.horizontalLines, (line) => {
        return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("line", {
          class: "gantt-elastic__grid-line-horizontal",
          style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['grid-line-horizontal'] }),
          key: line.key,
          x1: line.x1,
          y1: line.y1,
          x2: line.x2,
          y2: line.y2
        }, null, 12 /* STYLE, PROPS */, Gridvue_type_template_id_d9395a04_hoisted_2))
      }), 128 /* KEYED_FRAGMENT */)),
      ((0,external_Vue_.openBlock)(true), (0,external_Vue_.createElementBlock)(external_Vue_.Fragment, null, (0,external_Vue_.renderList)($options.verticalLines, (line) => {
        return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("line", {
          class: "gantt-elastic__grid-line-vertical",
          style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['grid-line-vertical'] }),
          key: line.key,
          x1: line.x1,
          y1: line.y1,
          x2: line.x2,
          y2: line.y2
        }, null, 12 /* STYLE, PROPS */, Gridvue_type_template_id_d9395a04_hoisted_3))
      }), 128 /* KEYED_FRAGMENT */)),
      ($options.timeLinePosition.visible)
        ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("line", {
            key: 0,
            class: "gantt-elastic__grid-line-time",
            style: (0,external_Vue_.normalizeStyle)($options.timeLineStyle),
            x1: $options.timeLinePosition.x,
            y1: $options.timeLinePosition.y1,
            x2: $options.timeLinePosition.x,
            y2: $options.timeLinePosition.y2
          }, null, 12 /* STYLE, PROPS */, Gridvue_type_template_id_d9395a04_hoisted_4))
        : (0,external_Vue_.createCommentVNode)("v-if", true)
    ], 4 /* STYLE */)
  ], 12 /* STYLE, PROPS */, Gridvue_type_template_id_d9395a04_hoisted_1))
}
;// ./src/components/Chart/Grid.vue?vue&type=template&id=d9395a04

;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/Grid.vue?vue&type=script&lang=js

/* harmony default export */ const Gridvue_type_script_lang_js = ({
  name: 'Grid',
  inject: ['root'],
  data() {
    return {};
  },
  /**
   * Created
   */
  created() {
    this.$set = function(obj, key, val) { obj[key] = val; };
    this.$delete = function(obj, key) { delete obj[key]; };

    this.root.$emitBus.on('recenterPosition', this.recenterPosition);
  },

  /**
   * Mounted
   */
  mounted() {
    this.$nextTick(() => {
      this.$nextTick(() => {
        // because of stupid slider :/
        this.root.scrollToTime(this.timeLinePosition.time);
      });
    });
  },

  beforeUnmount() {
    this.root.$emitBus.off('recenterPosition', this.recenterPosition);
  },

  methods: {
    /**
     * Recenter position - go to current time line
     */
    recenterPosition() {
      this.root.scrollToTime(this.timeLinePosition.time);
    }
  },

  computed: {
    /**
     * Generate vertical lines of the grid
     *
     * @returns {array}
     */
    verticalLines() {
      let lines = [];
      const state = this.root.state;
      state.options.times.steps.forEach(step => {
        if (this.root.isInsideViewPort(step.offset.px, 1)) {
          lines.push({
            key: step.time,
            x1: step.offset.px,
            y1: 0,
            x2: step.offset.px,
            y2:
              state.tasks.length * (state.options.row.height + state.options.chart.grid.horizontal.gap * 2) +
              this.root.style['grid-line-vertical']['stroke-width']
          });
        }
      });
      return lines;
    },

    /**
     * Generate horizontal lines of the grid
     *
     * @returns {array}
     */
    horizontalLines() {
      let lines = [];
      const state = this.root.state.options;
      let tasks = this.root.visibleTasks;
      for (let index = 0, len = tasks.length; index <= len; index++) {
        const y =
          index * (state.row.height + state.chart.grid.horizontal.gap * 2) +
          this.root.style['grid-line-vertical']['stroke-width'] / 2;
        lines.push({
          key: 'hl' + index,
          x1: 0,
          y1: y,
          x2: '100%',
          y2: y
        });
      }
      return lines;
    },

    /**
     * Check if specified line is inside viewport (visible)
     *
     * @returns {function}
     */
    inViewPort() {
      return line => {
        const state = this.root.state.options;
        return line.x1 >= state.scroll.chart.left && line.x1 <= state.scroll.chart.right;
      };
    },

    /**
     * Get current time line position - driven by the root's `now` state,
     * refreshed by the currentTimeLine.updateInterval timer (issue #7)
     *
     * @returns {object}
     */
    timeLinePosition() {
      const now = this.root.state.now;
      const currentOffset = this.root.timeToPixelOffsetX(now);
      const timeLine = {
        x: currentOffset,
        y1: 0,
        y2: '100%',
        dateTime: '',
        time: now,
        visible:
          this.root.state.options.chart.currentTimeLine.display !== false &&
          currentOffset >= 0 &&
          currentOffset <= this.root.state.options.width
      };
      timeLine.dateTime = new Date(now).toLocaleDateString();
      return timeLine;
    },

    /**
     * Current time line style with optional per-option overrides (issue #7)
     *
     * @returns {object}
     */
    timeLineStyle() {
      const style = { ...this.root.style['grid-line-time'] };
      const currentTimeLine = this.root.state.options.chart.currentTimeLine;
      if (currentTimeLine.color) {
        style.stroke = currentTimeLine.color;
      }
      if (currentTimeLine.strokeWidth) {
        style['stroke-width'] = currentTimeLine.strokeWidth;
      }
      return style;
    }
  }
});

;// ./src/components/Chart/Grid.vue




;
const Grid_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(Gridvue_type_script_lang_js, [['render',Gridvue_type_template_id_d9395a04_render]])

/* harmony default export */ const Grid = (Grid_exports_);
;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/DaysHighlight.vue?vue&type=template&id=61bd1087


const DaysHighlightvue_type_template_id_61bd1087_hoisted_1 = ["x", "width"]

function DaysHighlightvue_type_template_id_61bd1087_render(_ctx, _cache, $props, $setup, $data, $options) {
  return ($options.showWorkingDays)
    ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("g", {
        key: 0,
        class: "gantt-elastic__chart-days-highlight-container",
        style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['chart-days-highlight-container'] })
      }, [
        ((0,external_Vue_.openBlock)(true), (0,external_Vue_.createElementBlock)(external_Vue_.Fragment, null, (0,external_Vue_.renderList)($options.workingDays, (day) => {
          return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("rect", {
            class: "gantt-elastic__chart-days-highlight-rect",
            key: $options.getKey(day),
            x: day.offset.px,
            y: "0",
            width: day.width.px,
            height: "100%",
            style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['chart-days-highlight-rect'] })
          }, null, 12 /* STYLE, PROPS */, DaysHighlightvue_type_template_id_61bd1087_hoisted_1))
        }), 128 /* KEYED_FRAGMENT */))
      ], 4 /* STYLE */))
    : (0,external_Vue_.createCommentVNode)("v-if", true)
}
;// ./src/components/Chart/DaysHighlight.vue?vue&type=template&id=61bd1087

;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/DaysHighlight.vue?vue&type=script&lang=js


/* harmony default export */ const DaysHighlightvue_type_script_lang_js = ({
  name: 'DaysHighlight',
  inject: ['root'],
  data() {
    return {};
  },
  methods: {
    /**
     * Get key
     *
     * @param {object} day
     * @returns {string} key ideintifier for loop
     */
    getKey(day) {
      return dayjs_min_default()(day.time).format('YYYY-MM-DD');
    }
  },
  computed: {
    /**
     * Get working days
     *
     * @returns {array}
     */
    workingDays() {
      return this.root.state.options.times.steps.filter(step => {
        return this.root.state.options.calendar.workingDays.indexOf(dayjs_min_default()(step.time).day()) === -1;
      });
    },

    /**
     * Show working days?
     *
     * @returns {bool}
     */
    showWorkingDays() {
      const calendar = this.root.state.options.calendar;
      if (
        typeof calendar.workingDays !== 'undefined' &&
        Array.isArray(calendar.workingDays) &&
        calendar.workingDays.length
      ) {
        return true;
      }
      return false;
    }
  }
});

;// ./src/components/Chart/DaysHighlight.vue?vue&type=script&lang=js
 
;// ./src/components/Chart/DaysHighlight.vue




;
const DaysHighlight_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(DaysHighlightvue_type_script_lang_js, [['render',DaysHighlightvue_type_template_id_61bd1087_render]])

/* harmony default export */ const DaysHighlight = (DaysHighlight_exports_);
;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Calendar/Calendar.vue?vue&type=template&id=fa744c3c


function Calendarvue_type_template_id_fa744c3c_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_calendar_row = (0,external_Vue_.resolveComponent)("calendar-row")

  return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
    class: "gantt-elastic__calendar-wrapper",
    style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['calendar-wrapper'], width: $options.root.state.options.width + 'px' })
  }, [
    (0,external_Vue_.createElementVNode)("div", {
      class: "gantt-elastic__calendar",
      style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['calendar'], width: $options.root.state.options.width + 'px' })
    }, [
      ($options.root.state.options.calendar.month.display)
        ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createBlock)(_component_calendar_row, {
            key: 0,
            items: $options.dates.months,
            which: "month"
          }, null, 8 /* PROPS */, ["items"]))
        : (0,external_Vue_.createCommentVNode)("v-if", true),
      ($options.root.state.options.calendar.day.display)
        ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createBlock)(_component_calendar_row, {
            key: 1,
            items: $options.dates.days,
            which: "day"
          }, null, 8 /* PROPS */, ["items"]))
        : (0,external_Vue_.createCommentVNode)("v-if", true),
      ($options.root.state.options.calendar.hour.display)
        ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createBlock)(_component_calendar_row, {
            key: 2,
            items: $options.dates.hours,
            which: "hour"
          }, null, 8 /* PROPS */, ["items"]))
        : (0,external_Vue_.createCommentVNode)("v-if", true)
    ], 4 /* STYLE */)
  ], 4 /* STYLE */))
}
;// ./src/components/Calendar/Calendar.vue?vue&type=template&id=fa744c3c

;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Calendar/CalendarRow.vue?vue&type=template&id=14d015ce


function CalendarRowvue_type_template_id_14d015ce_render(_ctx, _cache, $props, $setup, $data, $options) {
  return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
    class: (0,external_Vue_.normalizeClass)('gantt-elastic__calendar-row gantt-elastic__calendar-row--' + $props.which),
    style: (0,external_Vue_.normalizeStyle)($options.rowStyle)
  }, [
    ((0,external_Vue_.openBlock)(true), (0,external_Vue_.createElementBlock)(external_Vue_.Fragment, null, (0,external_Vue_.renderList)($props.items, (item, itemIndex) => {
      return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
        key: item.key,
        class: (0,external_Vue_.normalizeClass)('gantt-elastic__calendar-row-rect gantt-elastic__calendar-row-rect--' + $props.which),
        style: (0,external_Vue_.normalizeStyle)($options.rectStyle)
      }, [
        ((0,external_Vue_.openBlock)(true), (0,external_Vue_.createElementBlock)(external_Vue_.Fragment, null, (0,external_Vue_.renderList)(item.children, (child, childIndex) => {
          return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
            class: (0,external_Vue_.normalizeClass)('gantt-elastic__calendar-row-rect-child gantt-elastic__calendar-row-rect-child--' + $props.which),
            key: child.key,
            style: (0,external_Vue_.normalizeStyle)($options.rectChildStyle[itemIndex][childIndex])
          }, [
            (0,external_Vue_.createElementVNode)("div", {
              class: (0,external_Vue_.normalizeClass)('gantt-elastic__calendar-row-text gantt-elastic__calendar-row-text--' + $props.which),
              style: (0,external_Vue_.normalizeStyle)($options.textStyle(child))
            }, (0,external_Vue_.toDisplayString)(child.label), 7 /* TEXT, CLASS, STYLE */)
          ], 6 /* CLASS, STYLE */))
        }), 128 /* KEYED_FRAGMENT */))
      ], 6 /* CLASS, STYLE */))
    }), 128 /* KEYED_FRAGMENT */))
  ], 6 /* CLASS, STYLE */))
}
;// ./src/components/Calendar/CalendarRow.vue?vue&type=template&id=14d015ce

;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Calendar/CalendarRow.vue?vue&type=script&lang=js

/* harmony default export */ const CalendarRowvue_type_script_lang_js = ({
  name: 'CalendarRow',
  inject: ['root'],
  props: ['items', 'which'],
  data() {
    return {};
  },
  methods: {
    /**
     * Get x position
     *
     * @returns {number}
     */
    getTextX(item) {
      let x = item.x + item.width / 2 - item.textWidth / 2;
      if (this.which === 'month' && this.root.isInsideViewPort(item.x, item.width, 0)) {
        let scrollWidth = this.root.state.options.scroll.chart.right - this.root.state.options.scroll.chart.left;
        x = this.root.state.options.scroll.chart.left + scrollWidth / 2 - item.textWidth / 2 + 2;
        if (x + item.textWidth + 2 > item.x + item.width) {
          x = item.x + item.width - item.textWidth - 2;
        } else if (x < item.x) {
          x = item.x + 2;
        }
      }
      return x - item.x;
    }
  },
  computed: {
    rowStyle() {
      return { ...this.root.style['calendar-row'], ...this.root.style['calendar-row--' + this.which] };
    },
    rectStyle() {
      return { ...this.root.style['calendar-row-rect'], ...this.root.style['calendar-row-rect--' + this.which] };
    },
    rectChildStyle() {
      const basicStyle = {
        ...this.root.style['calendar-row-rect-child'],
        ...this.root.style['calendar-row-rect-child--' + this.which]
      };
      const style = [];
      for (let item of this.items) {
        const childrenStyle = [];
        for (let child of item.children) {
          childrenStyle.push({
            ...basicStyle,
            width: child.width + 'px',
            height: child.height + 'px'
          });
        }
        style.push(childrenStyle);
      }
      return style;
    },
    textStyle() {
      const basicStyle = {
        ...this.root.style['calendar-row-text'],
        ...this.root.style['calendar-row-text--' + this.which]
      };
      return child => {
        const style = { ...basicStyle };
        if (this.which === 'month') {
          style.left = this.getTextX(child) + 'px';
        }
        return style;
      };
    }
  }
});

;// ./src/components/Calendar/CalendarRow.vue




;
const CalendarRow_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(CalendarRowvue_type_script_lang_js, [['render',CalendarRowvue_type_template_id_14d015ce_render]])

/* harmony default export */ const CalendarRow = (CalendarRow_exports_);
;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Calendar/Calendar.vue?vue&type=script&lang=js




/* harmony default export */ const Calendarvue_type_script_lang_js = ({
  name: 'Calendar',
  components: {
    CalendarRow: CalendarRow
  },
  inject: ['root'],
  data() {
    return {};
  },

  methods: {
    /**
     * How many hours will fit?
     *
     * @returns {object}
     */
    howManyHoursFit(dayIndex) {
      const stroke = 1;
      const additionalSpace = stroke + 2;
      let fullCellWidth = this.root.state.options.times.steps[dayIndex].width.px;
      let formatNames = Object.keys(this.root.state.options.calendar.hour.format);
      for (let hours = 24; hours > 1; hours = Math.ceil(hours / 2)) {
        for (let formatName of formatNames) {
          if (
            (this.root.state.options.calendar.hour.maxWidths[formatName] + additionalSpace) * hours <= fullCellWidth &&
            hours > 1
          ) {
            return {
              count: hours,
              type: formatName
            };
          }
        }
      }
      return {
        count: 0,
        type: ''
      };
    },

    /**
     * How many days will fit?
     *
     * @returns {object}
     */
    howManyDaysFit() {
      const stroke = 1;
      const additionalSpace = stroke + 2;
      let fullWidth = this.root.state.options.width;
      let formatNames = Object.keys(this.root.state.options.calendar.day.format);
      for (let days = this.root.state.options.times.steps.length; days > 1; days = Math.ceil(days / 2)) {
        for (let formatName of formatNames) {
          if (
            (this.root.state.options.calendar.day.maxWidths[formatName] + additionalSpace) * days <= fullWidth &&
            days > 1
          ) {
            return {
              count: days,
              type: formatName
            };
          }
        }
      }
      return {
        count: 0,
        type: ''
      };
    },

    /**
     * How many months will fit?
     *
     * @returns {object}
     */
    howManyMonthsFit() {
      const stroke = 1;
      const additionalSpace = stroke + 2;
      let fullWidth = this.root.state.options.width;
      let formatNames = Object.keys(this.root.state.options.calendar.month.format);
      let currentMonth = dayjs_min_default()(this.root.state.options.times.firstTime);
      let previousMonth = currentMonth.clone();
      const lastTime = this.root.state.options.times.lastTime;
      let monthsCount = this.root.monthsCount(
        this.root.state.options.times.firstTime,
        this.root.state.options.times.lastTime
      );
      if (monthsCount === 1) {
        for (let formatName of formatNames) {
          if (this.root.state.options.calendar.month.maxWidths[formatName] + additionalSpace <= fullWidth) {
            return {
              count: 1,
              type: formatName
            };
          }
        }
      }
      for (let months = monthsCount; months > 1; months = Math.ceil(months / 2)) {
        for (let formatName of formatNames) {
          if (
            (this.root.state.options.calendar.month.maxWidths[formatName] + additionalSpace) * months <= fullWidth &&
            months > 1
          ) {
            return {
              count: months,
              type: formatName
            };
          }
        }
      }
      return {
        count: 0,
        type: formatNames[0]
      };
    },

    /**
     * Generate hours
     *
     * @returns {array}
     */
    generateHours() {
      let allHours = [];
      if (!this.root.state.options.calendar.hour.display) {
        return allHours;
      }
      const steps = this.root.state.options.times.steps;
      const localeName = this.root.state.options.locale.name;
      for (let hourIndex = 0, len = steps.length; hourIndex < len; hourIndex++) {
        const hoursCount = this.howManyHoursFit(hourIndex);
        if (hoursCount.count === 0) {
          continue;
        }
        const hours = { key: hourIndex + 'step', children: [] };
        const hourStep = 24 / hoursCount.count;
        const hourWidthPx = steps[hourIndex].width.px / hoursCount.count;
        for (let i = 0, len = hoursCount.count; i < len; i++) {
          const hour = i * hourStep;
          let index = hourIndex;
          if (hourIndex > 0) {
            index = hourIndex - Math.floor(hourIndex / 24) * 24;
          }
          let textWidth = 0;
          if (typeof this.root.state.options.calendar.hour.widths[index] !== 'undefined') {
            textWidth = this.root.state.options.calendar.hour.widths[index][hoursCount.type];
          }
          let x = steps[hourIndex].offset.px + hourWidthPx * i;
          hours.children.push({
            index: hourIndex,
            key: 'h' + i,
            x,
            y: this.root.state.options.calendar.day.height + this.root.state.options.calendar.month.height,
            width: hourWidthPx,
            textWidth,
            height: this.root.state.options.calendar.hour.height,
            label: this.root.state.options.calendar.hour.formatted[hoursCount.type][hour]
          });
        }
        allHours.push(hours);
      }
      return allHours;
    },

    /**
     * Generate days
     *
     * @returns {array}
     */
    generateDays() {
      let days = [];
      if (!this.root.state.options.calendar.day.display) {
        return days;
      }
      const daysCount = this.howManyDaysFit();
      if (daysCount.count === 0) {
        return days;
      }
      const steps = this.root.state.options.times.steps;
      const localeName = this.root.state.options.locale.name;
      const dayStep = Math.ceil(steps.length / daysCount.count);
      for (let dayIndex = 0, len = steps.length; dayIndex < len; dayIndex += dayStep) {
        let dayWidthPx = 0;
        // day could be shorter (daylight saving time) so join widths and divide
        for (let currentStep = 0; currentStep < dayStep; currentStep++) {
          if (typeof steps[dayIndex + currentStep] !== 'undefined') {
            dayWidthPx += steps[dayIndex + currentStep].width.px;
          }
        }
        const date = dayjs_min_default()(steps[dayIndex].time);
        let textWidth = 0;
        if (typeof this.root.state.options.calendar.day.widths[dayIndex] !== 'undefined') {
          textWidth = this.root.state.options.calendar.day.widths[dayIndex][daysCount.type];
        }
        let x = steps[dayIndex].offset.px;
        days.push({
          index: dayIndex,
          key: steps[dayIndex].time + 'd',
          x,
          y: this.root.state.options.calendar.month.height,
          width: dayWidthPx,
          textWidth,
          height: this.root.state.options.calendar.day.height,
          label: this.root.state.options.calendar.day.format[daysCount.type](date.locale(localeName))
        });
      }
      return days.map(item => ({
        key: item.key,
        children: [item]
      }));
    },

    /**
     * Generate months
     *
     * @returns {array}
     */
    generateMonths() {
      let months = [];
      if (!this.root.state.options.calendar.month.display) {
        return months;
      }
      const monthsCount = this.howManyMonthsFit();
      if (monthsCount.count === 0) {
        return months;
      }
      const steps = this.root.state.options.times.steps;
      const localeName = this.root.state.options.locale.name;
      let formatNames = Object.keys(this.root.state.options.calendar.month.format);
      let currentDate = dayjs_min_default()(this.root.state.options.times.firstTime);
      for (let monthIndex = 0; monthIndex < monthsCount.count; monthIndex++) {
        let monthWidth = 0;
        let monthOffset = Number.MAX_SAFE_INTEGER;
        let finalDate = dayjs_min_default()(currentDate)
          .add(1, 'month')
          .startOf('month');
        if (finalDate.valueOf() > this.root.state.options.times.lastTime) {
          finalDate = dayjs_min_default()(this.root.state.options.times.lastTime);
        }
        // we must find first and last step to get the offsets / widths
        for (let step = 0, len = this.root.state.options.times.steps.length; step < len; step++) {
          let currentStep = this.root.state.options.times.steps[step];
          if (currentStep.time >= currentDate.valueOf() && currentStep.time < finalDate.valueOf()) {
            monthWidth += currentStep.width.px;
            if (currentStep.offset.px < monthOffset) {
              monthOffset = currentStep.offset.px;
            }
          }
        }
        let label = '';
        let choosenFormatName;
        for (let formatName of formatNames) {
          if (this.root.state.options.calendar.month.maxWidths[formatName] + 2 <= monthWidth) {
            label = this.root.state.options.calendar.month.format[formatName](currentDate.locale(localeName));
            choosenFormatName = formatName;
          }
        }
        let textWidth = 0;
        if (typeof this.root.state.options.calendar.month.widths[monthIndex] !== 'undefined') {
          textWidth = this.root.state.options.calendar.month.widths[monthIndex][choosenFormatName];
        }
        let x = monthOffset;
        months.push({
          index: monthIndex,
          key: monthIndex + 'm',
          x,
          y: 0,
          width: monthWidth,
          textWidth,
          choosenFormatName,
          height: this.root.state.options.calendar.month.height,
          label
        });
        currentDate = currentDate.add(1, 'month').startOf('month');
        if (currentDate.valueOf() > this.root.state.options.times.lastTime) {
          currentDate = dayjs_min_default()(this.root.state.options.times.lastTime);
        }
      }
      return months.map(item => ({
        key: item.key,
        children: [item]
      }));
    },

    /**
     * Sum all calendar rows height and return result
     *
     * @returns {int}
     */
    calculateCalendarDimensions({ hours, days, months }) {
      let height = 0;
      if (this.root.state.options.calendar.hour.display && hours.length > 0) {
        height += this.root.state.options.calendar.hour.height;
      }
      if (this.root.state.options.calendar.day.display && days.length > 0) {
        height += this.root.state.options.calendar.day.height;
      }
      if (this.root.state.options.calendar.month.display && months.length > 0) {
        height += this.root.state.options.calendar.month.height;
      }
      this.root.state.options.calendar.height = height;
    }
  },

  computed: {
    /**
     * Calendar cells per row - pure computed; the resulting dimensions are
     * applied in the watcher below (a computed that mutates reactive state
     * re-triggers itself in Vue 3 - issue #3)
     */
    dates() {
      const hours = this.generateHours();
      const days = this.generateDays();
      const months = this.generateMonths();
      return { hours, days, months };
    }
  },

  watch: {
    dates: {
      immediate: true,
      handler(allDates) {
        this.calculateCalendarDimensions(allDates);
      }
    }
  }
});

;// ./src/components/Calendar/Calendar.vue?vue&type=script&lang=js
 
;// ./src/components/Calendar/Calendar.vue




;
const Calendar_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(Calendarvue_type_script_lang_js, [['render',Calendarvue_type_template_id_fa744c3c_render]])

/* harmony default export */ const Calendar = (Calendar_exports_);
;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/DependencyLines.vue?vue&type=template&id=168a891d


const DependencyLinesvue_type_template_id_168a891d_hoisted_1 = ["task"]
const DependencyLinesvue_type_template_id_168a891d_hoisted_2 = ["task", "d"]

function DependencyLinesvue_type_template_id_168a891d_render(_ctx, _cache, $props, $setup, $data, $options) {
  return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("svg", {
    x: "0",
    y: "0",
    width: "100%",
    height: "100%",
    class: "gantt-elastic__chart-dependency-lines-container",
    style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['chart-dependency-lines-container'] })
  }, [
    ((0,external_Vue_.openBlock)(true), (0,external_Vue_.createElementBlock)(external_Vue_.Fragment, null, (0,external_Vue_.renderList)($options.dependencyTasks, (entry) => {
      return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("g", {
        key: entry.task.id,
        task: entry.task
      }, [
        ((0,external_Vue_.openBlock)(true), (0,external_Vue_.createElementBlock)(external_Vue_.Fragment, null, (0,external_Vue_.renderList)(entry.lines, (line) => {
          return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("path", {
            class: "gantt-elastic__chart-dependency-lines-path",
            style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['chart-dependency-lines-path'], ...entry.task.style['chart-dependency-lines-path'], ...entry.task.style['chart-dependency-lines-path-' + line.task_id] }),
            key: line.task_id,
            task: entry.task,
            d: line.points
          }, null, 12 /* STYLE, PROPS */, DependencyLinesvue_type_template_id_168a891d_hoisted_2))
        }), 128 /* KEYED_FRAGMENT */))
      ], 8 /* PROPS */, DependencyLinesvue_type_template_id_168a891d_hoisted_1))
    }), 128 /* KEYED_FRAGMENT */))
  ], 4 /* STYLE */))
}
;// ./src/components/Chart/DependencyLines.vue?vue&type=template&id=168a891d

;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/DependencyLines.vue?vue&type=script&lang=js

/* harmony default export */ const DependencyLinesvue_type_script_lang_js = ({
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
        .filter(task => Array.isArray(task.dependentOn))
        .map(task => ({
          task,
          lines: task.dependentOn
            .map(id => ({ points: this.getPoints(id, task.id), task_id: id }))
            .filter(line => line.points !== null)
        }))
        .filter(entry => entry.lines.length > 0);
    }
  }
});

;// ./src/components/Chart/DependencyLines.vue




;
const DependencyLines_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(DependencyLinesvue_type_script_lang_js, [['render',DependencyLinesvue_type_template_id_168a891d_render]])

/* harmony default export */ const DependencyLines = (DependencyLines_exports_);
;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/Row/Task.vue?vue&type=template&id=a358480a


const Taskvue_type_template_id_a358480a_hoisted_1 = ["x", "y", "width", "height"]
const Taskvue_type_template_id_a358480a_hoisted_2 = ["x", "y", "width", "height", "viewBox", "aria-label", "aria-pressed"]
const Taskvue_type_template_id_a358480a_hoisted_3 = ["id"]
const Taskvue_type_template_id_a358480a_hoisted_4 = ["points"]
const _hoisted_5 = ["points"]

function Taskvue_type_template_id_a358480a_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_expander = (0,external_Vue_.resolveComponent)("expander")
  const _component_progress_bar = (0,external_Vue_.resolveComponent)("progress-bar")
  const _component_chart_text = (0,external_Vue_.resolveComponent)("chart-text")

  return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("g", {
    class: "gantt-elastic__chart-row-bar-wrapper gantt-elastic__chart-row-task-wrapper",
    style: (0,external_Vue_.normalizeStyle)({
      ...$options.root.style['chart-row-bar-wrapper'],
      ...$options.root.style['chart-row-task-wrapper'],
      ...$props.task.style['chart-row-bar-wrapper']
    })
  }, [
    (_ctx.displayExpander)
      ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("foreignObject", {
          key: 0,
          class: "gantt-elastic__chart-expander gantt-elastic__chart-expander--task",
          style: (0,external_Vue_.normalizeStyle)({
        ...$options.root.style['chart-expander'],
        ...$options.root.style['chart-expander--task'],
        ...$props.task.style['chart-expander']
      }),
          x: $props.task.x - $options.root.state.options.chart.expander.offset - $options.root.state.options.chart.expander.size,
          y: $props.task.y + ($options.root.state.options.row.height - $options.root.state.options.chart.expander.size) / 2,
          width: $options.root.state.options.chart.expander.size,
          height: $options.root.state.options.chart.expander.size
        }, [
          (0,external_Vue_.createVNode)(_component_expander, {
            tasks: [$props.task],
            options: $options.root.state.options.chart.expander,
            type: "chart"
          }, null, 8 /* PROPS */, ["tasks", "options"])
        ], 12 /* STYLE, PROPS */, Taskvue_type_template_id_a358480a_hoisted_1))
      : (0,external_Vue_.createCommentVNode)("v-if", true),
    ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("svg", {
      class: "gantt-elastic__chart-row-bar gantt-elastic__chart-row-task",
      style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['chart-row-bar'], ...$options.root.style['chart-row-task'], ...$props.task.style['chart-row-bar'] }),
      x: $props.task.x,
      y: $props.task.y,
      width: $props.task.width,
      height: $props.task.height,
      viewBox: `0 0 ${$props.task.width} ${$props.task.height}`,
      onClick: _cache[0] || (_cache[0] = $event => (_ctx.emitEvent('click', $event))),
      onMouseenter: _cache[1] || (_cache[1] = $event => (_ctx.emitEvent('mouseenter', $event))),
      onMouseover: _cache[2] || (_cache[2] = $event => (_ctx.emitEvent('mouseover', $event))),
      onMouseout: _cache[3] || (_cache[3] = $event => (_ctx.emitEvent('mouseout', $event))),
      onMouseleave: _cache[4] || (_cache[4] = $event => (_ctx.emitEvent('mouseleave', $event))),
      onMousemove: _cache[5] || (_cache[5] = $event => (_ctx.emitEvent('mousemove', $event))),
      onMousedown: _cache[6] || (_cache[6] = $event => (_ctx.emitEvent('mousedown', $event))),
      onMouseup: _cache[7] || (_cache[7] = $event => (_ctx.emitEvent('mouseup', $event))),
      onMousewheel: _cache[8] || (_cache[8] = $event => (_ctx.emitEvent('mousewheel', $event))),
      onTouchstart: _cache[9] || (_cache[9] = $event => (_ctx.emitEvent('touchstart', $event))),
      onTouchmove: _cache[10] || (_cache[10] = $event => (_ctx.emitEvent('touchmove', $event))),
      onTouchend: _cache[11] || (_cache[11] = $event => (_ctx.emitEvent('touchend', $event))),
      role: "button",
      tabindex: "0",
      "aria-label": _ctx.barAriaLabel,
      "aria-pressed": $options.root.state.selectedTaskId === $props.task.id,
      onKeydown: _cache[12] || (_cache[12] = (...args) => (_ctx.onBarKeyDown && _ctx.onBarKeyDown(...args))),
      xmlns: "http://www.w3.org/2000/svg"
    }, [
      (0,external_Vue_.createElementVNode)("defs", null, [
        (0,external_Vue_.createElementVNode)("clipPath", { id: $options.clipPathId }, [
          (0,external_Vue_.createElementVNode)("polygon", { points: $options.getPoints }, null, 8 /* PROPS */, Taskvue_type_template_id_a358480a_hoisted_4)
        ], 8 /* PROPS */, Taskvue_type_template_id_a358480a_hoisted_3)
      ]),
      (0,external_Vue_.createElementVNode)("polygon", {
        class: "gantt-elastic__chart-row-bar-polygon gantt-elastic__chart-row-task-polygon",
        style: (0,external_Vue_.normalizeStyle)({
          ...$options.root.style['chart-row-bar-polygon'],
          ...$options.root.style['chart-row-task-polygon'],
          ...$props.task.style['base'],
          ...$props.task.style['chart-row-bar-polygon']
        }),
        points: $options.getPoints
      }, null, 12 /* STYLE, PROPS */, _hoisted_5),
      (0,external_Vue_.createVNode)(_component_progress_bar, {
        task: $props.task,
        "clip-path": 'url(#' + $options.clipPathId + ')'
      }, null, 8 /* PROPS */, ["task", "clip-path"])
    ], 44 /* STYLE, PROPS, NEED_HYDRATION */, Taskvue_type_template_id_a358480a_hoisted_2)),
    ($options.root.state.options.chart.text.display)
      ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createBlock)(_component_chart_text, {
          key: 1,
          task: $props.task
        }, null, 8 /* PROPS */, ["task"]))
      : (0,external_Vue_.createCommentVNode)("v-if", true)
  ], 4 /* STYLE */))
}
;// ./src/components/Chart/Row/Task.vue?vue&type=template&id=a358480a

;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/Text.vue?vue&type=template&id=bc0e6756


const Textvue_type_template_id_bc0e6756_hoisted_1 = ["x", "y", "width", "height"]
const Textvue_type_template_id_bc0e6756_hoisted_2 = ["height"]
const Textvue_type_template_id_bc0e6756_hoisted_3 = ["innerHTML"]

function Textvue_type_template_id_bc0e6756_render(_ctx, _cache, $props, $setup, $data, $options) {
  return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("svg", {
    class: "gantt-elastic__chart-row-text-wrapper",
    style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['chart-row-text-wrapper'] }),
    x: $props.task.x + $props.task.width + $options.root.state.options.chart.text.offset,
    y: $props.task.y - $options.root.state.options.chart.grid.horizontal.gap,
    width: $options.getWidth,
    height: $options.getHeight
  }, [
    ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("foreignObject", {
      x: "0",
      y: "0",
      width: "100%",
      height: $options.getHeight
    }, [
      (0,external_Vue_.createElementVNode)("div", {
        xmlns: "http://www.w3.org/1999/xhtml",
        class: "gantt-elastic__chart-row-text",
        style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['chart-row-text'] })
      }, [
        (!$options.html)
          ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
              key: 0,
              class: "gantt-elastic__chart-row-text-content gantt-elastic__chart-row-text-content--text",
              style: (0,external_Vue_.normalizeStyle)({
            ...$options.root.style['chart-row-text-content'],
            ...$options.root.style['chart-row-text-content--text'],
            ...$options.contentStyle
          })
            }, [
              (0,external_Vue_.createElementVNode)("div", null, (0,external_Vue_.toDisplayString)($props.task.label), 1 /* TEXT */)
            ], 4 /* STYLE */))
          : (0,external_Vue_.createCommentVNode)("v-if", true),
        ($options.html)
          ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
              key: 1,
              class: "gantt-elastic__chart-row-text-content gantt-elastic__chart-row-text-content--html",
              style: (0,external_Vue_.normalizeStyle)({
            ...$options.root.style['chart-row-text-content'],
            ...$options.root.style['chart-row-text-content--html'],
            ...$options.contentStyle
          }),
              innerHTML: $options.sanitizedLabel
            }, null, 12 /* STYLE, PROPS */, Textvue_type_template_id_bc0e6756_hoisted_3))
          : (0,external_Vue_.createCommentVNode)("v-if", true)
      ], 4 /* STYLE */)
    ], 8 /* PROPS */, Textvue_type_template_id_bc0e6756_hoisted_2))
  ], 12 /* STYLE, PROPS */, Textvue_type_template_id_bc0e6756_hoisted_1))
}
;// ./src/components/Chart/Text.vue?vue&type=template&id=bc0e6756

;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/Text.vue?vue&type=script&lang=js



/* harmony default export */ const Textvue_type_script_lang_js = ({
  name: 'ChartText',
  inject: ['root'],
  props: ['task'],
  data() {
    return {};
  },
  computed: {
    /**
     * Task label sanitized before v-html injection - the html branch is opt-in
     * (label column with html: true) but the label itself is still untrusted
     *
     * @returns {string}
     */
    sanitizedLabel() {
      return sanitizeHtml(this.task.label);
    },

    /**
     * Get width
     *
     * @returns {number}
     */
    getWidth() {
      const textStyle = this.root.style['chart-row-text'];
      this.root.state.ctx.font = `${textStyle['font-weight']} ${textStyle['font-size']} ${textStyle['font-family']}`;
      const textWidth = this.root.state.ctx.measureText(this.task.label).width;
      return textWidth + this.root.state.options.chart.text.xPadding * 2;
    },

    /**
     * Get height
     *
     * @returns {number}
     */
    getHeight() {
      return this.task.height + this.root.state.options.chart.grid.horizontal.gap * 2;
    },

    /**
     * Get content style
     *
     * @returns {object}
     */
    contentStyle() {
      return { height: '100%', 'line-height': this.getHeight + 'px' };
    },

    /**
     * Should we render text as html?
     *
     * @returns {boolean}
     */
    html() {
      const cols = this.root.state.options.taskList.columns;
      for (let i = 0, len = cols.length; i < len; i++) {
        const col = cols[i];
        if (col.value === 'label' && typeof col.html !== 'undefined' && col.html) {
          return true;
        }
      }
      return false;
    }
  }
});

;// ./src/components/Chart/Text.vue?vue&type=script&lang=js
 
;// ./src/components/Chart/Text.vue




;
const Text_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(Textvue_type_script_lang_js, [['render',Textvue_type_template_id_bc0e6756_render]])

/* harmony default export */ const Text = (Text_exports_);
;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/ProgressBar.vue?vue&type=template&id=6e839ac8


const ProgressBarvue_type_template_id_6e839ac8_hoisted_1 = ["width", "height"]
const ProgressBarvue_type_template_id_6e839ac8_hoisted_2 = ["y2"]
const ProgressBarvue_type_template_id_6e839ac8_hoisted_3 = ["width"]
const ProgressBarvue_type_template_id_6e839ac8_hoisted_4 = { key: 1 }
const ProgressBarvue_type_template_id_6e839ac8_hoisted_5 = ["x", "width"]
const _hoisted_6 = ["d"]

function ProgressBarvue_type_template_id_6e839ac8_render(_ctx, _cache, $props, $setup, $data, $options) {
  return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("g", {
    class: "gantt-elastic__chart-row-progress-bar-wrapper",
    style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['chart-row-progress-bar-wrapper'], ...$props.task.style['chart-row-progress-bar-wrapper'] })
  }, [
    (0,external_Vue_.createElementVNode)("defs", null, [
      (0,external_Vue_.createElementVNode)("pattern", {
        id: "diagonalHatch",
        width: $options.root.state.options.chart.progress.width,
        height: $options.root.state.options.chart.progress.width,
        patternTransform: "rotate(45 0 0)",
        patternUnits: "userSpaceOnUse"
      }, [
        (0,external_Vue_.createElementVNode)("line", {
          class: "chart-row-progress-bar-line",
          style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['chart-row-progress-bar-line'], ...$props.task.style['chart-row-progress-bar-line'] }),
          x1: "0",
          y1: "0",
          x2: "0",
          y2: $options.root.state.options.chart.progress.width
        }, null, 12 /* STYLE, PROPS */, ProgressBarvue_type_template_id_6e839ac8_hoisted_2)
      ], 8 /* PROPS */, ProgressBarvue_type_template_id_6e839ac8_hoisted_1)
    ]),
    ($options.root.state.options.chart.progress.bar)
      ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("rect", {
          key: 0,
          class: "gantt-elastic__chart-row-progress-bar-solid",
          style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['chart-row-progress-bar-solid'], ...$props.task.style['chart-row-progress-bar-solid'] }),
          x: "0",
          y: "0",
          width: $options.getProgressWidth
        }, null, 12 /* STYLE, PROPS */, ProgressBarvue_type_template_id_6e839ac8_hoisted_3))
      : (0,external_Vue_.createCommentVNode)("v-if", true),
    ($options.root.state.options.chart.progress.pattern)
      ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("g", ProgressBarvue_type_template_id_6e839ac8_hoisted_4, [
          (0,external_Vue_.createElementVNode)("rect", {
            class: "gantt-elastic__chart-row-progress-bar-pattern",
            style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['chart-row-progress-bar-pattern'], ...$props.task.style['chart-row-progress-bar-pattern'] }),
            x: $options.getProgressWidth,
            y: "0",
            width: 100 - $props.task.progress + '%',
            height: "100%"
          }, null, 12 /* STYLE, PROPS */, ProgressBarvue_type_template_id_6e839ac8_hoisted_5),
          (0,external_Vue_.createElementVNode)("path", {
            class: "gantt-elastic__chart-row-progress-bar-outline",
            style: (0,external_Vue_.normalizeStyle)({
          ...$options.root.style['chart-row-progress-bar-outline'],
          ...$props.task.style['base'],
          ...$props.task.style['chart-row-progress-bar-outline']
        }),
            d: $options.getLinePoints
          }, null, 12 /* STYLE, PROPS */, _hoisted_6)
        ]))
      : (0,external_Vue_.createCommentVNode)("v-if", true)
  ], 4 /* STYLE */))
}
;// ./src/components/Chart/ProgressBar.vue?vue&type=template&id=6e839ac8

;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/ProgressBar.vue?vue&type=script&lang=js

/* harmony default export */ const ProgressBarvue_type_script_lang_js = ({
  name: 'ProgressBar',
  inject: ['root'],
  props: ['task'],
  data() {
    return {};
  },

  computed: {
    /**
     * Get progress width
     *
     * @returns {string}
     */
    getProgressWidth() {
      return this.task.progress + '%';
    },

    /**
     * Get line points
     *
     * @returns {string}
     */
    getLinePoints() {
      const start = (this.task.width / 100) * this.task.progress;
      return `M ${start} 0 L ${start} ${this.task.height}`;
    },

    /**
     * Get solid style
     *
     * @returns {object}
     */
    getSolidStyle() {
      return Object.assign({}, this.root.state.options.chart.progress.styles.bar.solid, this.task.progressBarStyle.bar);
    },

    /**
     * Get line style
     *
     * @returns {object}
     */
    getLineStyle() {
      return Object.assign(
        {},
        {
          stroke: this.root.state.options.row.styles.bar.stroke + 'a0',
          'stroke-width': this.root.state.options.row.styles.bar['stroke-width'] / 2
        },
        this.task.style
      );
    }
  }
});

;// ./src/components/Chart/ProgressBar.vue




;
const ProgressBar_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(ProgressBarvue_type_script_lang_js, [['render',ProgressBarvue_type_template_id_6e839ac8_render]])

/* harmony default export */ const ProgressBar = (ProgressBar_exports_);
;// ./src/components/Chart/Row/Task.mixin.js
/**
 * @fileoverview Task mixin
 * @license MIT
 * @author Rafal Pospiech <neuronet.io@gmail.com>
 * @package GanttElastic
 */


/* harmony default export */ const Task_mixin = ({
  computed: {
    /**
     * Get view box
     *
     * @returns {string}
     */
    getViewBox() {
      const task = this.task;
      return `0 0 ${task.width} ${task.height}`;
    },

    /**
     * Get group transform
     *
     * @returns {string}
     */
    getGroupTransform() {
      return `translate(${this.task.x} ${this.task.y})`;
    },

    /**
     * Should we display expander?
     *
     * @returns {boolean}
     */
    displayExpander() {
      const expander = this.root.state.options.chart.expander;
      return expander.display || (expander.displayIfTaskListHidden && !this.root.state.options.taskList.display);
    },

    /**
     * Accessible label for the bar: label plus date range (issue #13)
     *
     * @returns {string}
     */
    barAriaLabel() {
      const task = this.task;
      const endTime = typeof task.endTime === 'undefined' ? task.startTime + task.duration : task.endTime;
      const start = dayjs_min_default()(task.startTime).format('YYYY-MM-DD');
      const end = dayjs_min_default()(endTime).format('YYYY-MM-DD');
      return `${task.label}, ${start} - ${end}`;
    }
  },
  methods: {
    /**
     * Emit event
     *
     * @param {string} eventName
     * @param {Event} event
     */
    emitEvent(eventName, event) {
      if (!this.root.state.options.scroll.scrolling) {
        this.root.$emitBus.emit(`chart-${this.task.type}-${eventName}`, { event, data: this.task });
      }
    },

    /**
     * Keyboard interaction on a focused bar (issue #13): Enter/Space activate
     * (same event a click would fire), arrows move between rendered bars,
     * Escape clears the selection
     *
     * @param {event} event
     */
    onBarKeyDown(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.emitEvent('click', event);
      } else if (event.key === 'Escape') {
        this.root.clearSelection();
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const bars = Array.from(document.querySelectorAll('.gantt-elastic__chart-row-bar'));
        const index = bars.indexOf(event.currentTarget);
        const next = bars[index + (event.key === 'ArrowDown' ? 1 : -1)];
        if (next) {
          next.focus();
        }
      }
    }
  }
});

;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/Row/Task.vue?vue&type=script&lang=js





/* harmony default export */ const Taskvue_type_script_lang_js = ({
  name: 'Task',
  components: {
    ChartText: Text,
    ProgressBar: ProgressBar,
    Expander: Expander
  },
  inject: ['root'],
  props: ['task'],
  mixins: [Task_mixin],
  data() {
    return {};
  },
  computed: {
    /**
     * Get clip path id
     *
     * @returns {string}
     */
    clipPathId() {
      return 'gantt-elastic__task-clip-path-' + this.task.id;
    },

    /**
     * Get points
     *
     * @returns {string}
     */
    getPoints() {
      const task = this.task;
      return `0,0 ${task.width},0 ${task.width},${task.height} 0,${task.height}`;
    }
  }
});

;// ./src/components/Chart/Row/Task.vue?vue&type=script&lang=js
 
;// ./src/components/Chart/Row/Task.vue




;
const Task_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(Taskvue_type_script_lang_js, [['render',Taskvue_type_template_id_a358480a_render]])

/* harmony default export */ const Task = (Task_exports_);
;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/Row/Milestone.vue?vue&type=template&id=d073b6ea


const Milestonevue_type_template_id_d073b6ea_hoisted_1 = ["x", "y", "width", "height"]
const Milestonevue_type_template_id_d073b6ea_hoisted_2 = ["x", "y", "width", "height", "viewBox", "aria-label", "aria-pressed"]
const Milestonevue_type_template_id_d073b6ea_hoisted_3 = ["id"]
const Milestonevue_type_template_id_d073b6ea_hoisted_4 = ["points"]
const Milestonevue_type_template_id_d073b6ea_hoisted_5 = ["points"]

function Milestonevue_type_template_id_d073b6ea_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_expander = (0,external_Vue_.resolveComponent)("expander")
  const _component_progress_bar = (0,external_Vue_.resolveComponent)("progress-bar")
  const _component_chart_text = (0,external_Vue_.resolveComponent)("chart-text")

  return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("g", {
    class: "gantt-elastic__chart-row-bar-wrapper gantt-elastic__chart-row-milestone-wrapper",
    style: (0,external_Vue_.normalizeStyle)({
      ...$options.root.style['chart-row-bar-wrapper'],
      ...$options.root.style['chart-row-milestone-wrapper'],
      ...$props.task.style['chart-row-bar-wrapper']
    })
  }, [
    (_ctx.displayExpander)
      ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("foreignObject", {
          key: 0,
          class: "gantt-elastic__chart-expander gantt-elastic__chart-expander--milestone",
          style: (0,external_Vue_.normalizeStyle)({
        ...$options.root.style['chart-expander'],
        ...$options.root.style['chart-expander--milestone'],
        ...$props.task.style['chart-expander']
      }),
          x: $props.task.x - $options.root.state.options.chart.expander.offset - $options.root.state.options.chart.expander.size,
          y: $props.task.y + ($options.root.state.options.row.height - $options.root.state.options.chart.expander.size) / 2,
          width: $options.root.state.options.chart.expander.size,
          height: $options.root.state.options.chart.expander.size
        }, [
          (0,external_Vue_.createVNode)(_component_expander, {
            tasks: [$props.task],
            options: $options.root.state.options.chart.expander,
            type: "chart"
          }, null, 8 /* PROPS */, ["tasks", "options"])
        ], 12 /* STYLE, PROPS */, Milestonevue_type_template_id_d073b6ea_hoisted_1))
      : (0,external_Vue_.createCommentVNode)("v-if", true),
    ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("svg", {
      class: "gantt-elastic__chart-row-bar gantt-elastic__chart-row-milestone",
      style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['chart-row-bar'], ...$options.root.style['chart-row-milestone'], ...$props.task.style['chart-row-bar'] }),
      x: $props.task.x,
      y: $props.task.y,
      width: $props.task.width,
      height: $props.task.height,
      viewBox: `0 0 ${$props.task.width} ${$props.task.height}`,
      onClick: _cache[0] || (_cache[0] = $event => (_ctx.emitEvent('click', $event))),
      onMouseenter: _cache[1] || (_cache[1] = $event => (_ctx.emitEvent('mouseenter', $event))),
      onMouseover: _cache[2] || (_cache[2] = $event => (_ctx.emitEvent('mouseover', $event))),
      onMouseout: _cache[3] || (_cache[3] = $event => (_ctx.emitEvent('mouseout', $event))),
      onMouseleave: _cache[4] || (_cache[4] = $event => (_ctx.emitEvent('mouseleave', $event))),
      onMousemove: _cache[5] || (_cache[5] = $event => (_ctx.emitEvent('mousemove', $event))),
      onMousedown: _cache[6] || (_cache[6] = $event => (_ctx.emitEvent('mousedown', $event))),
      onMouseup: _cache[7] || (_cache[7] = $event => (_ctx.emitEvent('mouseup', $event))),
      onMousewheel: _cache[8] || (_cache[8] = $event => (_ctx.emitEvent('mousewheel', $event))),
      onTouchstart: _cache[9] || (_cache[9] = $event => (_ctx.emitEvent('touchstart', $event))),
      onTouchmove: _cache[10] || (_cache[10] = $event => (_ctx.emitEvent('touchmove', $event))),
      onTouchend: _cache[11] || (_cache[11] = $event => (_ctx.emitEvent('touchend', $event))),
      role: "button",
      tabindex: "0",
      "aria-label": _ctx.barAriaLabel,
      "aria-pressed": $options.root.state.selectedTaskId === $props.task.id,
      onKeydown: _cache[12] || (_cache[12] = (...args) => (_ctx.onBarKeyDown && _ctx.onBarKeyDown(...args))),
      xmlns: "http://www.w3.org/2000/svg"
    }, [
      (0,external_Vue_.createElementVNode)("defs", null, [
        (0,external_Vue_.createElementVNode)("clipPath", { id: $options.clipPathId }, [
          (0,external_Vue_.createElementVNode)("polygon", { points: $options.getPoints }, null, 8 /* PROPS */, Milestonevue_type_template_id_d073b6ea_hoisted_4)
        ], 8 /* PROPS */, Milestonevue_type_template_id_d073b6ea_hoisted_3)
      ]),
      (0,external_Vue_.createElementVNode)("polygon", {
        class: "gantt-elastic__chart-row-bar-polygon gantt-elastic__chart-row-milestone-polygon",
        style: (0,external_Vue_.normalizeStyle)({
          ...$options.root.style['chart-row-bar-polygon'],
          ...$options.root.style['chart-row-milestone-polygon'],
          ...$props.task.style['base'],
          ...$props.task.style['chart-row-bar-polygon']
        }),
        points: $options.getPoints
      }, null, 12 /* STYLE, PROPS */, Milestonevue_type_template_id_d073b6ea_hoisted_5),
      (0,external_Vue_.createVNode)(_component_progress_bar, {
        task: $props.task,
        "clip-path": 'url(#' + $options.clipPathId + ')'
      }, null, 8 /* PROPS */, ["task", "clip-path"])
    ], 44 /* STYLE, PROPS, NEED_HYDRATION */, Milestonevue_type_template_id_d073b6ea_hoisted_2)),
    ($options.root.state.options.chart.text.display)
      ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createBlock)(_component_chart_text, {
          key: 1,
          task: $props.task
        }, null, 8 /* PROPS */, ["task"]))
      : (0,external_Vue_.createCommentVNode)("v-if", true)
  ], 4 /* STYLE */))
}
;// ./src/components/Chart/Row/Milestone.vue?vue&type=template&id=d073b6ea

;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/Row/Milestone.vue?vue&type=script&lang=js





/* harmony default export */ const Milestonevue_type_script_lang_js = ({
  name: 'Milestone',
  components: {
    ChartText: Text,
    ProgressBar: ProgressBar,
    Expander: Expander
  },
  inject: ['root'],
  props: ['task'],
  mixins: [Task_mixin],
  data() {
    return {};
  },
  computed: {
    /**
     * Get clip path id
     *
     * @returns {string}
     */
    clipPathId() {
      return 'gantt-elastic__milestone-clip-path-' + this.task.id;
    },

    /**
     * Get points
     *
     * @returns {string}
     */
    getPoints() {
      const task = this.task;
      const fifty = task.height / 2;
      let offset = fifty;
      if (task.width / 2 - offset < 0) {
        offset = task.width / 2;
      }
      return `0,${fifty}
        ${offset},0
        ${task.width - offset},0
        ${task.width},${fifty}
        ${task.width - offset},${task.height}
        ${offset},${task.height}`;
    }
  }
});

;// ./src/components/Chart/Row/Milestone.vue?vue&type=script&lang=js
 
;// ./src/components/Chart/Row/Milestone.vue




;
const Milestone_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(Milestonevue_type_script_lang_js, [['render',Milestonevue_type_template_id_d073b6ea_render]])

/* harmony default export */ const Milestone = (Milestone_exports_);
;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/Row/Project.vue?vue&type=template&id=1a28b3a0


const Projectvue_type_template_id_1a28b3a0_hoisted_1 = ["x", "y", "width", "height"]
const Projectvue_type_template_id_1a28b3a0_hoisted_2 = ["x", "y", "width", "height", "viewBox", "aria-label", "aria-pressed"]
const Projectvue_type_template_id_1a28b3a0_hoisted_3 = ["id"]
const Projectvue_type_template_id_1a28b3a0_hoisted_4 = ["d"]
const Projectvue_type_template_id_1a28b3a0_hoisted_5 = ["d"]

function Projectvue_type_template_id_1a28b3a0_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_expander = (0,external_Vue_.resolveComponent)("expander")
  const _component_progress_bar = (0,external_Vue_.resolveComponent)("progress-bar")
  const _component_chart_text = (0,external_Vue_.resolveComponent)("chart-text")

  return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("g", {
    class: "gantt-elastic__chart-row-bar-wrapper gantt-elastic__chart-row-project-wrapper",
    style: (0,external_Vue_.normalizeStyle)({
      ...$options.root.style['chart-row-bar-wrapper'],
      ...$options.root.style['chart-row-project-wrapper'],
      ...$props.task.style['chart-row-bar-wrapper']
    })
  }, [
    ($options.displayExpander)
      ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("foreignObject", {
          key: 0,
          class: "gantt-elastic__chart-expander gantt-elastic__chart-expander--project",
          style: (0,external_Vue_.normalizeStyle)({
        ...$options.root.style['chart-expander'],
        ...$options.root.style['chart-expander--project'],
        ...$props.task.style['chart-expander']
      }),
          x: $props.task.x - $options.root.state.options.chart.expander.offset - $options.root.state.options.chart.expander.size,
          y: $props.task.y + ($options.root.state.options.row.height - $options.root.state.options.chart.expander.size) / 2,
          width: $options.root.state.options.chart.expander.size,
          height: $options.root.state.options.chart.expander.size
        }, [
          (0,external_Vue_.createVNode)(_component_expander, {
            tasks: [$props.task],
            options: $options.root.state.options.chart.expander,
            type: "chart"
          }, null, 8 /* PROPS */, ["tasks", "options"])
        ], 12 /* STYLE, PROPS */, Projectvue_type_template_id_1a28b3a0_hoisted_1))
      : (0,external_Vue_.createCommentVNode)("v-if", true),
    ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("svg", {
      class: "gantt-elastic__chart-row-bar gantt-elastic__chart-row-project",
      style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['chart-row-bar'], ...$options.root.style['chart-row-project'], ...$props.task.style['chart-row-bar'] }),
      x: $props.task.x,
      y: $props.task.y,
      width: $props.task.width,
      height: $props.task.height,
      viewBox: `0 0 ${$props.task.width} ${$props.task.height}`,
      onClick: _cache[0] || (_cache[0] = $event => (_ctx.emitEvent('click', $event))),
      onMouseenter: _cache[1] || (_cache[1] = $event => (_ctx.emitEvent('mouseenter', $event))),
      onMouseover: _cache[2] || (_cache[2] = $event => (_ctx.emitEvent('mouseover', $event))),
      onMouseout: _cache[3] || (_cache[3] = $event => (_ctx.emitEvent('mouseout', $event))),
      onMouseleave: _cache[4] || (_cache[4] = $event => (_ctx.emitEvent('mouseleave', $event))),
      onMousemove: _cache[5] || (_cache[5] = $event => (_ctx.emitEvent('mousemove', $event))),
      onMousedown: _cache[6] || (_cache[6] = $event => (_ctx.emitEvent('mousedown', $event))),
      onMouseup: _cache[7] || (_cache[7] = $event => (_ctx.emitEvent('mouseup', $event))),
      onMousewheel: _cache[8] || (_cache[8] = $event => (_ctx.emitEvent('mousewheel', $event))),
      onTouchstart: _cache[9] || (_cache[9] = $event => (_ctx.emitEvent('touchstart', $event))),
      onTouchmove: _cache[10] || (_cache[10] = $event => (_ctx.emitEvent('touchmove', $event))),
      onTouchend: _cache[11] || (_cache[11] = $event => (_ctx.emitEvent('touchend', $event))),
      role: "button",
      tabindex: "0",
      "aria-label": _ctx.barAriaLabel,
      "aria-pressed": $options.root.state.selectedTaskId === $props.task.id,
      onKeydown: _cache[12] || (_cache[12] = (...args) => (_ctx.onBarKeyDown && _ctx.onBarKeyDown(...args))),
      xmlns: "http://www.w3.org/2000/svg"
    }, [
      (0,external_Vue_.createElementVNode)("defs", null, [
        (0,external_Vue_.createElementVNode)("clipPath", { id: $options.clipPathId }, [
          (0,external_Vue_.createElementVNode)("path", { d: $options.getPoints }, null, 8 /* PROPS */, Projectvue_type_template_id_1a28b3a0_hoisted_4)
        ], 8 /* PROPS */, Projectvue_type_template_id_1a28b3a0_hoisted_3)
      ]),
      (0,external_Vue_.createElementVNode)("path", {
        class: "gantt-elastic__chart-row-bar-polygon gantt-elastic__chart-row-project-polygon",
        style: (0,external_Vue_.normalizeStyle)({
          ...$options.root.style['chart-row-bar-polygon'],
          ...$options.root.style['chart-row-project-polygon'],
          ...$props.task.style['base'],
          ...$props.task.style['chart-row-bar-polygon']
        }),
        d: $options.getPoints
      }, null, 12 /* STYLE, PROPS */, Projectvue_type_template_id_1a28b3a0_hoisted_5),
      (0,external_Vue_.createVNode)(_component_progress_bar, {
        task: $props.task,
        "clip-path": 'url(#' + $options.clipPathId + ')'
      }, null, 8 /* PROPS */, ["task", "clip-path"])
    ], 44 /* STYLE, PROPS, NEED_HYDRATION */, Projectvue_type_template_id_1a28b3a0_hoisted_2)),
    ($options.root.state.options.chart.text.display)
      ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createBlock)(_component_chart_text, {
          key: 1,
          task: $props.task
        }, null, 8 /* PROPS */, ["task"]))
      : (0,external_Vue_.createCommentVNode)("v-if", true)
  ], 4 /* STYLE */))
}
;// ./src/components/Chart/Row/Project.vue?vue&type=template&id=1a28b3a0

;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/Row/Project.vue?vue&type=script&lang=js





/* harmony default export */ const Projectvue_type_script_lang_js = ({
  name: 'Project',
  components: {
    ChartText: Text,
    ProgressBar: ProgressBar,
    Expander: Expander
  },
  inject: ['root'],
  props: ['task'],
  mixins: [Task_mixin],
  data() {
    return {};
  },
  computed: {
    /**
     * Get clip path id
     *
     * @returns {string}
     */
    clipPathId() {
      return 'gantt-elastic__project-clip-path-' + this.task.id;
    },

    /**
     * Get points
     *
     * @returns {string}
     */
    getPoints() {
      const task = this.task;
      const bottom = task.height - task.height / 4;
      const corner = task.height / 6;
      const smallCorner = task.height / 8;
      return `M ${smallCorner},0
                L ${task.width - smallCorner} 0
                L ${task.width} ${smallCorner}
                L ${task.width} ${bottom}
                L ${task.width - corner} ${task.height}
                L ${task.width - corner * 2} ${bottom}
                L ${corner * 2} ${bottom}
                L ${corner} ${task.height}
                L 0 ${bottom}
                L 0 ${smallCorner}
                Z
        `;
    },

    /**
     * Should we display expander?
     *
     * @returns {boolean}
     */
    displayExpander() {
      const expander = this.root.state.options.chart.expander;
      return expander.display || (expander.displayIfTaskListHidden && !this.root.state.options.taskList.display);
    }
  }
});

;// ./src/components/Chart/Row/Project.vue?vue&type=script&lang=js
 
;// ./src/components/Chart/Row/Project.vue




;
const Project_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(Projectvue_type_script_lang_js, [['render',Projectvue_type_template_id_1a28b3a0_render]])

/* harmony default export */ const Project = (Project_exports_);
;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/Chart.vue?vue&type=script&lang=js








/* harmony default export */ const Chartvue_type_script_lang_js = ({
  name: 'Chart',
  components: {
    Grid: Grid,
    DependencyLines: DependencyLines,
    Calendar: Calendar,
    Task: Task,
    Milestone: Milestone,
    Project: Project,
    DaysHighlight: DaysHighlight
  },
  inject: ['root'],
  data() {
    return {
      moving: false
    };
  },
  /**
   * Mounted
   */
  mounted() {
    this.root.state.refs.chart = this.$refs.chart;
    this.root.state.refs.chartCalendarContainer = this.$refs.chartCalendarContainer;
    this.root.state.refs.chartGraphContainer = this.$refs.chartGraphContainer;
    this.root.state.refs.chartGraph = this.$refs.chartGraph;
    this.root.state.refs.chartGraphSvg = this.$refs.chartGraphSvg;
  },

  computed: {
    /**
     * Get view box
     *
     * @returns {string}
     */
    getViewBox() {
      return `0 0 ${this.root.state.options.width} ${this.root.state.options.allVisibleTasksHeight}`;
    }
  },
  methods: {
    /**
     * Row level hover events (issue #12) - non-bubbling enter/leave on the
     * row wrapper so child element crossings cannot flicker the highlight
     *
     * @param {string} eventName
     * @param {event} event
     * @param {object} task
     */
    emitRowEvent(eventName, event, task) {
      this.root.$emitBus.emit(`chart-row-${eventName}`, { event, data: task });
    },

    /**
     * Selection / hover highlight style for a task row wrapper (issues #6, #12)
     *
     * @param {object} task
     * @returns {object}
     */
    highlightStyle(task) {
      const style = {};
      if (this.root.state.selectedTaskId === task.id) {
        Object.assign(style, this.root.style['chart-row--selected']);
      } else if (this.root.state.hoveredTaskId === task.id) {
        Object.assign(style, this.root.style['chart-row--hover']);
      }
      return style;
    }
  }
});

;// ./src/components/Chart/Chart.vue?vue&type=script&lang=js
 
;// ./src/components/Chart/Chart.vue




;
const Chart_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(Chartvue_type_script_lang_js, [['render',Chartvue_type_template_id_1f5b83b1_render]])

/* harmony default export */ const Chart = (Chart_exports_);
;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/Tooltip.vue?vue&type=template&id=11592994


function Tooltipvue_type_template_id_11592994_render(_ctx, _cache, $props, $setup, $data, $options) {
  return ($data.visible)
    ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
        key: 0,
        class: "gantt-elastic__chart-tooltip",
        style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['chart-tooltip'], left: $data.x + 'px', top: $data.y + 'px' })
      }, (0,external_Vue_.toDisplayString)($options.content), 5 /* TEXT, STYLE */))
    : (0,external_Vue_.createCommentVNode)("v-if", true)
}
;// ./src/components/Chart/Tooltip.vue?vue&type=template&id=11592994

;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/Tooltip.vue?vue&type=script&lang=js



const BAR_TYPES = ['task', 'milestone', 'project'];

/* harmony default export */ const Tooltipvue_type_script_lang_js = ({
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
      const start = dayjs_min_default()(task.startTime)
        .locale(localeName)
        .format('L LT');
      const end = dayjs_min_default()(endTime)
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
});

;// ./src/components/Chart/Tooltip.vue?vue&type=script&lang=js
 
;// ./src/components/Chart/Tooltip.vue




;
const Tooltip_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(Tooltipvue_type_script_lang_js, [['render',Tooltipvue_type_template_id_11592994_render]])

/* harmony default export */ const Tooltip = (Tooltip_exports_);
;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/MainView.vue?vue&type=script&lang=js





let ignoreScrollEvents = false;

/* harmony default export */ const MainViewvue_type_script_lang_js = ({
  name: 'MainView',
  components: {
    TaskList: TaskList,
    Chart: Chart,
    ChartTooltip: Tooltip
  },
  inject: ['root'],
  data() {
    return {
      defs: '',
      mousePos: {
        x: 0,
        y: 0,
        movementX: 0,
        movementY: 0,
        lastX: 0,
        lastY: 0,
        positiveX: 0,
        positiveY: 0,
        currentX: 0,
        currentY: 0
      }
    };
  },
  /**
   * Mounted
   */
  mounted() {
    this.viewBoxWidth = this.$el.clientWidth;
    this.root.state.refs.mainView = this.$refs.mainView;
    this.root.state.refs.chartContainer = this.$refs.chartContainer;
    this.root.state.refs.taskList = this.$refs.taskList;
    this.root.state.refs.chartScrollContainerHorizontal = this.$refs.chartScrollContainerHorizontal;
    this.root.state.refs.chartScrollContainerVertical = this.$refs.chartScrollContainerVertical;
    document.addEventListener('mouseup', this.chartMouseUp.bind(this));
    document.addEventListener('mousemove', this.chartMouseMove.bind(this));
    document.addEventListener('touchmove', this.chartMouseMove.bind(this));
    document.addEventListener('touchend', this.chartMouseUp.bind(this));
  },
  computed: {
    /**
     * Get margin left
     *
     * @returns {string}
     */
    getMarginLeft() {
      if (!this.root.state.options.taskList.display) {
        return '0px';
      }
      return this.root.state.options.taskList.finalWidth + 'px';
    },

    /**
     * Get vertical style
     *
     * @returns {object}
     */
    verticalStyle() {
      return {
        width: this.root.state.options.scrollBarHeight + 'px',
        height: this.root.state.options.rowsHeight + 'px',
        'margin-top': this.root.state.options.calendar.height + this.root.state.options.calendar.gap + 'px'
      };
    },

    /**
     * Get view box
     *
     * @returns {string}
     */
    getViewBox() {
      if (this.root.state.options.clientWidth) {
        return `0 0 ${this.root.state.options.clientWidth - this.root.state.options.scrollBarHeight} ${
          this.root.state.options.height
        }`;
      }
      return `0 0 0 ${this.root.state.options.height}`;
    }
  },
  methods: {
    /**
     * Emit event when mouse is moving inside main view
     */
    mouseMove(event) {
      this.root.$emitBus.emit('main-view-mousemove', event);
    },

    /**
     * Emit mouseup event inside main view
     */
    mouseUp(event) {
      this.root.$emitBus.emit('main-view-mouseup', event);
    },

    /**
     * Horizontal scroll event handler
     */
    onHorizontalScroll(ev) {
      this.root.$emitBus.emit('chart-scroll-horizontal', ev);
    },

    /**
     * Vertical scroll event handler
     */
    onVerticalScroll(ev) {
      this.root.$emitBus.emit('chart-scroll-vertical', ev);
    },

    /**
     * Mouse wheel event handler
     */
    chartWheel(ev) {
      this.root.$emitBus.emit('chart-wheel', ev);
    },

    /**
     * Chart mousedown event handler
     * Initiates drag scrolling mode; a press on empty chart area clears the selection
     */
    chartMouseDown(ev) {
      // presses on a bar belong to that bar's click event, everything else deselects
      if (
        this.root.state.options.taskSelection.display !== false &&
        (typeof ev.target.closest !== 'function' || !ev.target.closest('.gantt-elastic__chart-row-bar-wrapper'))
      ) {
        this.root.clearSelection();
      }
      if (typeof ev.touches !== 'undefined') {
        this.mousePos.x = this.mousePos.lastX = ev.touches[0].screenX;
        this.mousePos.y = this.mousePos.lastY = ev.touches[0].screenY;
        this.mousePos.movementX = 0;
        this.mousePos.movementY = 0;
        this.mousePos.currentX = this.$refs.chartScrollContainerHorizontal.scrollLeft;
        this.mousePos.currentY = this.$refs.chartScrollContainerVertical.scrollTop;
      }
      this.root.state.options.scroll.scrolling = true;
    },

    /**
     * Chart mouseup event handler
     * Deactivates drag scrolling mode
     */
    chartMouseUp(ev) {
      this.root.state.options.scroll.scrolling = false;
    },

    /**
     * Chart mousemove event handler
     * When in drag scrolling mode this method calculate scroll movement
     */
    chartMouseMove(ev) {
      if (this.root.state.options.scroll.scrolling) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        ev.stopPropagation();
        const touch = typeof ev.touches !== 'undefined';
        let movementX, movementY;
        if (touch) {
          const screenX = ev.touches[0].screenX;
          const screenY = ev.touches[0].screenY;
          movementX = this.mousePos.x - screenX;
          movementY = this.mousePos.y - screenY;
          this.mousePos.lastX = screenX;
          this.mousePos.lastY = screenY;
        } else {
          movementX = ev.movementX;
          movementY = ev.movementY;
        }
        const horizontal = this.$refs.chartScrollContainerHorizontal;
        const vertical = this.$refs.chartScrollContainerVertical;
        let x = 0,
          y = 0;
        if (touch) {
          x = this.mousePos.currentX + movementX * this.root.state.options.scroll.dragXMoveMultiplier;
        } else {
          x = horizontal.scrollLeft - movementX * this.root.state.options.scroll.dragXMoveMultiplier;
        }
        horizontal.scrollLeft = x;
        if (touch) {
          y = this.mousePos.currentY + movementY * this.root.state.options.scroll.dragYMoveMultiplier;
        } else {
          y = vertical.scrollTop - movementY * this.root.state.options.scroll.dragYMoveMultiplier;
        }
        vertical.scrollTop = y;
      }
    }
  },

  /**
   * Before destroy event - clean up
   */
  beforeUnmount() {
    document.removeEventListener('mouseup', this.chartMouseUp);
    document.removeEventListener('mousemove', this.chartMouseMove);
    document.removeEventListener('touchmove', this.chartMouseMove);
    document.removeEventListener('touchend', this.chartMouseUp);
  }
});

;// ./src/components/MainView.vue?vue&type=script&lang=js
 
;// ./src/components/MainView.vue




;
const MainView_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(MainViewvue_type_script_lang_js, [['render',MainViewvue_type_template_id_a1e49164_render]])

/* harmony default export */ const MainView = (MainView_exports_);
;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Header.vue?vue&type=template&id=3d2fc070


const Headervue_type_template_id_3d2fc070_hoisted_1 = ["innerHTML"]

function Headervue_type_template_id_3d2fc070_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_vue_slider = (0,external_Vue_.resolveComponent)("vue-slider")
  const _component_gantt_switch = (0,external_Vue_.resolveComponent)("gantt-switch")

  return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
    class: "gantt-elastic__header",
    style: (0,external_Vue_.normalizeStyle)({ ...$data.style['header'] })
  }, [
    (0,external_Vue_.createElementVNode)("div", {
      class: "gantt-elastic__header-title",
      style: (0,external_Vue_.normalizeStyle)({ ...$data.style['header-title'] })
    }, [
      (!$data.opts.title.html)
        ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
            key: 0,
            class: "gantt-elastic__header-title--text",
            style: (0,external_Vue_.normalizeStyle)({ ...$data.style['header-title--text'] })
          }, (0,external_Vue_.toDisplayString)($data.opts.title.label), 5 /* TEXT, STYLE */))
        : (0,external_Vue_.createCommentVNode)("v-if", true),
      ($data.opts.title.html)
        ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
            key: 1,
            class: "gantt-elastic__header-title--html",
            style: (0,external_Vue_.normalizeStyle)({ ...$data.style['header-title--html'] }),
            innerHTML: $options.sanitizedTitle
          }, null, 12 /* STYLE, PROPS */, Headervue_type_template_id_3d2fc070_hoisted_1))
        : (0,external_Vue_.createCommentVNode)("v-if", true)
    ], 4 /* STYLE */),
    (0,external_Vue_.createElementVNode)("div", {
      class: "gantt-elastic__header-options",
      style: (0,external_Vue_.normalizeStyle)({ ...$data.style['header-options'] })
    }, [
      (0,external_Vue_.createElementVNode)("button", {
        class: "gantt-elastic__header-btn-recenter",
        style: (0,external_Vue_.normalizeStyle)({ ...$data.style['header-btn-recenter'] }),
        onClick: _cache[0] || (_cache[0] = (0,external_Vue_.withModifiers)((...args) => ($options.recenterPosition && $options.recenterPosition(...args)), ["prevent"]))
      }, (0,external_Vue_.toDisplayString)($data.opts.locale.Now), 5 /* TEXT, STYLE */),
      (0,external_Vue_.createElementVNode)("label", {
        class: "gantt-elastic__header-label",
        style: (0,external_Vue_.normalizeStyle)({ ...$data.style['header-label'] })
      }, [
        (0,external_Vue_.createTextVNode)((0,external_Vue_.toDisplayString)($data.opts.locale["X-Scale"]) + " ", 1 /* TEXT */),
        (0,external_Vue_.createElementVNode)("div", {
          class: "gantt-elastic__header-slider-wrapper",
          style: (0,external_Vue_.normalizeStyle)({ ...$data.style['header-slider-wrapper'] })
        }, [
          (0,external_Vue_.createVNode)(_component_vue_slider, {
            class: "gantt-elastic__header-slider",
            tooltip: "none",
            style: (0,external_Vue_.normalizeStyle)({ ...$data.style['header-slider'] }),
            "process-style": { ...$data.style['header-slider--process'] },
            "slider-style": { ...$data.style['header-slider--slider'] },
            modelValue: $options.scale,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => (($options.scale) = $event)),
            max: 24,
            min: 2,
            width: "100px"
          }, null, 8 /* PROPS */, ["style", "process-style", "slider-style", "modelValue"])
        ], 4 /* STYLE */)
      ], 4 /* STYLE */),
      (0,external_Vue_.createElementVNode)("label", {
        class: "gantt-elastic__header-label",
        style: (0,external_Vue_.normalizeStyle)({ ...$data.style['header-label'] })
      }, [
        (0,external_Vue_.createTextVNode)((0,external_Vue_.toDisplayString)($data.opts.locale["Y-Scale"]) + " ", 1 /* TEXT */),
        (0,external_Vue_.createElementVNode)("div", {
          class: "gantt-elastic__header-slider-wrapper",
          style: (0,external_Vue_.normalizeStyle)({ ...$data.style['header-slider-wrapper'] })
        }, [
          (0,external_Vue_.createVNode)(_component_vue_slider, {
            class: "gantt-elastic__header-slider",
            tooltip: "none",
            style: (0,external_Vue_.normalizeStyle)({ ...$data.style['header-slider'] }),
            "process-style": { ...$data.style['header-slider--process'] },
            "slider-style": { ...$data.style['header-slider--slider'] },
            modelValue: $options.height,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => (($options.height) = $event)),
            max: 100,
            min: 7,
            width: "100px"
          }, null, 8 /* PROPS */, ["style", "process-style", "slider-style", "modelValue"])
        ], 4 /* STYLE */)
      ], 4 /* STYLE */),
      (0,external_Vue_.createElementVNode)("label", {
        class: "gantt-elastic__header-label",
        style: (0,external_Vue_.normalizeStyle)({ ...$data.style['header-label'] })
      }, [
        (0,external_Vue_.createTextVNode)((0,external_Vue_.toDisplayString)($data.opts.locale["Before/After"]) + " ", 1 /* TEXT */),
        (0,external_Vue_.createElementVNode)("div", {
          class: "gantt-elastic__header-slider-wrapper",
          style: (0,external_Vue_.normalizeStyle)({ ...$data.style['header-slider-wrapper'] })
        }, [
          (0,external_Vue_.createVNode)(_component_vue_slider, {
            class: "gantt-elastic__header-slider",
            tooltip: "none",
            style: (0,external_Vue_.normalizeStyle)({ ...$data.style['header-slider'] }),
            "process-style": { ...$data.style['header-slider--process'] },
            "slider-style": { ...$data.style['header-slider--slider'] },
            modelValue: $options.scope,
            "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => (($options.scope) = $event)),
            max: 31,
            min: 0,
            width: "100px"
          }, null, 8 /* PROPS */, ["style", "process-style", "slider-style", "modelValue"])
        ], 4 /* STYLE */)
      ], 4 /* STYLE */),
      (0,external_Vue_.createElementVNode)("label", {
        class: "gantt-elastic__header-label",
        style: (0,external_Vue_.normalizeStyle)({ ...$data.style['header-label'] })
      }, [
        (0,external_Vue_.createTextVNode)((0,external_Vue_.toDisplayString)($data.opts.locale["Task list width"]) + " ", 1 /* TEXT */),
        (0,external_Vue_.createElementVNode)("div", {
          class: "gantt-elastic__header-slider-wrapper",
          style: (0,external_Vue_.normalizeStyle)({ ...$data.style['header-slider-wrapper'] })
        }, [
          (0,external_Vue_.createVNode)(_component_vue_slider, {
            class: "gantt-elastic__header-slider",
            tooltip: "none",
            style: (0,external_Vue_.normalizeStyle)({ ...$data.style['header-slider'] }),
            "process-style": { ...$data.style['header-slider--process'] },
            "slider-style": { ...$data.style['header-slider--slider'] },
            modelValue: $options.divider,
            "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => (($options.divider) = $event)),
            max: 100,
            min: 0,
            width: "100px"
          }, null, 8 /* PROPS */, ["style", "process-style", "slider-style", "modelValue"])
        ], 4 /* STYLE */)
      ], 4 /* STYLE */),
      (0,external_Vue_.createElementVNode)("label", {
        class: "gantt-elastic__header-task-list-switch--wrapper",
        style: (0,external_Vue_.normalizeStyle)({ ...$data.style['header-task-list-switch--label'] })
      }, [
        (0,external_Vue_.createVNode)(_component_gantt_switch, {
          class: "gantt-elastic__header-task-list-switch",
          style: (0,external_Vue_.normalizeStyle)({ ...$data.style['header-task-list-switch'] }),
          value: $options.root.state.options.taskList.display,
          label: $data.opts.locale['Display task list'],
          onInput: _cache[5] || (_cache[5] = value => ($options.root.state.options.taskList.display = value))
        }, null, 8 /* PROPS */, ["style", "value", "label"]),
        (0,external_Vue_.createTextVNode)(" " + (0,external_Vue_.toDisplayString)($data.opts.locale["Display task list"]), 1 /* TEXT */)
      ], 4 /* STYLE */)
    ], 4 /* STYLE */)
  ], 4 /* STYLE */))
}
;// ./src/components/Header.vue?vue&type=template&id=3d2fc070

// EXTERNAL MODULE: ./node_modules/vue-slider-component/dist/vue-slider-component.umd.min.js
var vue_slider_component_umd_min = __webpack_require__(378);
var vue_slider_component_umd_min_default = /*#__PURE__*/__webpack_require__.n(vue_slider_component_umd_min);
// EXTERNAL MODULE: ./node_modules/vue-slider-component/theme/default.css
var theme_default = __webpack_require__(670);
;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Header.vue?vue&type=script&lang=js






// tiny inline on/off switch - replaces the Vue 2 only vue-switches dependency
const GanttSwitch = {
  name: "GanttSwitch",
  props: {
    value: { type: Boolean, default: false },
    label: { type: String, default: "" }
  },
  emits: ["input"],
  methods: {
    toggle(event) {
      this.$emit("input", event.target.checked);
    }
  },
  render() {
    return (0,external_Vue_.h)("label", { class: ["gantt-elastic__switch", this.value ? "gantt-elastic__switch--on" : "gantt-elastic__switch--off"] }, [
      (0,external_Vue_.h)("input", { type: "checkbox", checked: this.value, onChange: this.toggle, "aria-label": this.label })
    ]);
  }
};

const defaultStyle = {
  header: {
    margin: "0px auto",
    background: "#f3f5f747",
    padding: "10px",
    overflow: "hidden",
    clear: "both",
    display: "flex",
    "justify-content": "space-between"
  },
  "header-title": { float: "left" },
  "header-options": { float: "right" },
  "header-title--text": {
    "font-size": "20px",
    "vertical-align": "middle",
    "font-weight": "400",
    "line-height": "35px",
    "padding-left": "22px",
    "letter-spacing": "1px"
  },
  "header-title--html": {
    "font-size": "20px",
    "vertical-align": "middle",
    "font-weight": "400",
    "line-height": "35px",
    "padding-left": "22px",
    "letter-spacing": "1px"
  },
  "header-btn-recenter": {
    background: "#95A5A6",
    border: "none",
    outline: "none",
    cursor: "pointer",
    color: "white",
    "border-radius": "3px",
    "margin-right": "27px",
    "font-size": "16px",
    padding: "8px 12px"
  },
  "header-slider": {
    "box-sizing": "content-box"
  },
  "header-slider-wrapper": {
    display: "inline-block",
    "vertical-align": "middle"
  },
  "header-slider--slider": { "box-sizing": "content-box" },
  "header-slider--process": { "box-sizing": "content-box" },
  "header-task-list-switch--label": { "box-sizing": "content-box" },
  "header-task-list-switch": {
    margin: "0px 15px",
    "vertical-align": "middle"
  },
  "header-label": {}
};
const defaultOptions = {
  title: {
    label: "gantt-elastic",
    html: false
  },
  locale: {
    Now: "Now",
    "X-Scale": "Zoom-X",
    "Y-Scale": "Zoom-Y",
    "Task list width": "Task list",
    "Before/After": "Expand",
    "Display task list": "Show task list"
  }
};
/* harmony default export */ const Headervue_type_script_lang_js = ({
  name: "GanttHeader",
  components: {
    vueSlider: (vue_slider_component_umd_min_default()),
    GanttSwitch
  },
  props: ["options", "dynamicStyle"],
  inject: ["root"],
  data() {
    return {
      scaleTimeoutId: null,
      firstScale: false,
      localScale: 0,
      localHeight: 0,
      localBefore: 0,
      localPercent: 0,
      sliderOptions: {
        xScale: {
          value: 0
        }
      },
      style: {},
      opts: {}
    };
  },
  created() {
    this.$set = function(obj, key, val) { obj[key] = val; };
    this.$delete = function(obj, key) { delete obj[key]; };

    this.localScale = this.root.state.options.times.timeZoom;
    this.localHeight = this.root.state.options.row.height;
    this.localBefore = this.root.state.options.scope.before;
    this.localPercent = this.root.state.options.taskList.percent;
    this.sliderOptions.xScale.value = this.root.state.options.times.timeZoom;
    this.style = this.root.mergeDeep({}, defaultStyle, this.dynamicStyle);
    // the integrated header (rendered when the consumer overrides no header slot)
    // gets no props - read title and locale from the gantt options instead, so
    // options.title.html and translated labels actually take effect
    const rootOptions = this.root.state.options;
    const sources = [defaultOptions];
    if (rootOptions.title) {
      sources.push({ title: rootOptions.title });
    }
    if (rootOptions.locale) {
      sources.push({ locale: rootOptions.locale });
    }
    if (this.options) {
      sources.push(this.options);
    }
    this.opts = this.root.mergeDeep({}, ...sources);
  },
  methods: {
    getImage() {
      this.root.getImage("image/png").then(imgB64 => {
        const link = document.createElement("a");
        link.href = imgB64;
        link.download = "gantt-elastic.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
    recenterPosition() {
      this.root.$emitBus.emit("recenterPosition");
    },
    setScale(value) {
      if (this.scaleTimeoutId !== null) {
        clearTimeout(this.scaleTimeoutId);
        this.scaleTimeoutId = null;
      }
      // debouncing
      if (this.firstScale) {
        this.scaleTimeoutId = setTimeout(() => {
          this.root.$emitBus.emit("times-timeZoom-change", value);
          this.scaleTimeoutId = null;
        }, 50);
      } else {
        this.root.$emitBus.emit("times-timeZoom-change", value);
        this.firstScale = true;
      }
    }
  },
  computed: {
    /**
     * Header title sanitized before v-html injection - html rendering is
     * opt-in via options.title.html but the label itself is untrusted input
     * @returns {string}
     */
    sanitizedTitle() {
      return sanitizeHtml(this.opts.title.label);
    },
    /**
     * If there is a component slot specified for header
     * @returns {bool}
     */
    beforeOptionsIsComponent() {
      const headerSlot = this.options.slots.header;
      if (
        typeof headerSlot.beforeOptions === "object" &&
        !Array.isArray(headerSlot.beforeOptions)
      ) {
        return true;
      }
      return false;
    },
    /**
     * If there is a slot with beforeOptions html content
     * @returns {bool}
     */
    beforeOptionsIsHtml() {
      if (typeof this.options.slots.header.beforeOptions === "string") {
        return true;
      }
      return false;
    },
    scale: {
      get() {
        return this.localScale;
      },
      set(value) {
        this.localScale = Number(value);
        this.setScale(this.localScale);
      }
    },
    height: {
      get() {
        return this.localHeight;
      },
      set(value) {
        this.localHeight = Number(value);
        this.root.$emitBus.emit("row-height-change", Number(value));
      }
    },
    scope: {
      get() {
        return this.localBefore;
      },
      set(value) {
        this.localBefore = Number(value);
        this.root.$emitBus.emit("scope-change", Number(value));
      }
    },
    divider: {
      get() {
        return this.localPercent;
      },
      set(value) {
        this.localPercent = Number(value);
        this.root.$emitBus.emit("taskList-width-change", Number(value));
      }
    }
  }
});

;// ./src/components/Header.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Header.vue?vue&type=style&index=0&id=3d2fc070&lang=css
var Headervue_type_style_index_0_id_3d2fc070_lang_css = __webpack_require__(235);
;// ./src/components/Header.vue?vue&type=style&index=0&id=3d2fc070&lang=css

;// ./src/components/Header.vue




;


const Header_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(Headervue_type_script_lang_js, [['render',Headervue_type_template_id_3d2fc070_render]])

/* harmony default export */ const Header = (Header_exports_);
;// ./src/style.js
/**
 * @fileoverview Styles for gantt-elastic
 * @license MIT
 * @author Rafal Pospiech <neuronet.io@gmail.com>
 * @package GanttElastic
 */

function getStyle(
  fontSize = '12px',
  fontFamily = "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
) {
  return {
    fontSize,
    fontFamily,
    'main-view': {
      background: '#FFFFFF'
    },
    'main-container-wrapper': {
      overflow: 'hidden',
      'border-top': '1px solid #eee',
      'border-bottom': '1px solid #eee'
    },
    'main-container': {
      float: 'left',
      'max-width': '100%'
    },
    'main-view-container': {},
    container: {
      display: 'flex',
      'max-width': '100%',
      height: '100%'
    },
    'calendar-wrapper': {
      'user-select': 'none'
    },
    calendar: {
      width: '100%',
      background: '#f3f5f7',
      display: 'block'
    },
    'calendar-row': {
      display: 'flex',
      'justify-content': 'space-evenly'
    },
    'calendar-row--month': {},
    'calendar-row--day': {},
    'calendar-row--hour': {
      'border-bottom': '1px solid #eee'
    },
    'calendar-row-rect': {
      background: 'transparent',
      display: 'flex'
    },
    'calendar-row-rect--month': {},
    'calendar-row-rect--day': {},
    'calendar-row-rect--hour': {},
    'calendar-row-rect-child': {
      display: 'block',
      'border-right-width': '1px', // Calendar
      'border-right-color': '#dadada',
      'border-right-style': 'solid',
      position: 'relative'
    },
    'calendar-row-rect-child--month': {},
    'calendar-row-rect-child--day': { 'text-align': 'center' },
    'calendar-row-rect-child--hour': { 'text-align': 'center' },
    'calendar-row-text': {
      'font-family': fontFamily, // GanttElastic
      'font-size': fontSize, //GanttElastic
      color: '#606060',
      display: 'inline-block',
      position: 'relative'
    },
    'calendar-row-text--month': {},
    'calendar-row-text--day': {},
    'calendar-row-text--hour': {},
    'task-list-wrapper': {},
    'task-list': { background: 'transparent', 'border-color': '#eee' },
    'task-list-header': {
      display: 'flex',
      'user-select': 'none',
      'vertical-align': 'middle',
      'border-bottom': '1px solid #eee',
      'border-left': '1px solid #eee'
    },
    'task-list-header-column': {
      'border-left': '1px solid #00000050',
      'box-sizing': 'border-box',
      display: 'flex',
      background: '#f3f5f7',
      'border-color': 'transparent'
    },
    'task-list-expander-wrapper': {
      display: 'inline-flex',
      'flex-shrink': '0',
      'box-sizing': 'border-box',
      margin: '0 0 0 10px'
    },
    'task-list-expander-content': {
      display: 'inline-flex',
      cursor: 'pointer',
      margin: 'auto 0px',
      'box-sizing': 'border-box',
      'user-select': 'none'
    },
    'task-list-expander-line': {
      fill: 'transparent',
      stroke: '#000000',
      'stroke-width': '1',
      'stroke-linecap': 'round'
    },
    'task-list-expander-border': {
      fill: '#ffffffa0',
      stroke: '#000000A0'
    },
    'chart-expander-wrapper': {
      display: 'block',
      'line-height': '1',
      'box-sizing': 'border-box',
      margin: '0'
    },
    'chart-expander-content': {
      display: 'inline-flex',
      cursor: 'pointer',
      margin: 'auto 0px',
      'box-sizing': 'border-box',
      'user-select': 'none'
    },
    'chart-expander-line': {
      fill: 'transparent',
      stroke: '#000000',
      'stroke-width': '1',
      'stroke-linecap': 'round'
    },
    'chart-expander-border': {
      fill: '#ffffffa0',
      stroke: '#000000A0'
    },
    'task-list-container': {},
    'task-list-header-label': {
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      'font-family': fontFamily,
      'font-size': fontSize,
      'box-sizing': 'border-box',
      margin: 'auto 6px',
      'flex-grow': '1',
      'vertical-align': 'middle'
    },
    'task-list-header-resizer-wrapper': {
      background: 'transparent',
      height: '100%',
      width: '6px',
      cursor: 'col-resize',
      display: 'inline-flex',
      'vertical-align': 'center'
    },
    'task-list-header-resizer': { margin: 'auto 0px' },
    'task-list-header-resizer-dot': {
      width: '3px',
      height: '3px',
      background: '#ddd',
      'border-radius': '100%',
      margin: '4px 0px'
    },
    'task-list-items': {
      overflow: 'hidden'
    },
    'task-list-item': {
      'border-top': '1px solid #eee',
      'border-right': '1px solid #eee',
      'box-sizing': 'border-box',
      display: 'flex',
      background: 'transparent'
    },
    'task-list-item--selected': {
      background: '#e8f3fb'
    },
    'task-list-item--hover': {
      background: '#f5f5f5'
    },
    'task-list-item-column': {
      display: 'inline-flex',
      'flex-shrink': '0',
      'border-left': '1px solid #00000050',
      'box-sizing': 'border-box',
      'border-color': '#eee'
    },
    'task-list-item-value-wrapper': {
      overflow: 'hidden',
      display: 'flex',
      width: '100%'
    },
    'task-list-item-value-container': {
      margin: 'auto 0px',
      overflow: 'hidden'
    },
    'task-list-item-value': {
      display: 'block',
      'flex-shrink': '100',
      'font-family': fontFamily,
      'font-size': fontSize,
      'margin-top': 'auto',
      'margin-bottom': 'auto',
      'margin-left': '6px', // TaskList
      'margin-right': '6px',
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      'line-height': '1.5em',
      'word-break': 'keep-all',
      'white-space': 'nowrap',
      color: '#606060',
      background: '#FFFFFF'
    },
    'grid-lines': {},
    'grid-line-horizontal': {
      stroke: '#00000010',
      'stroke-width': 1
    },
    'grid-line-vertical': {
      stroke: '#00000010',
      'stroke-width': 1
    },
    'grid-line-time': {
      stroke: '#FF000080',
      'stroke-width': 1
    },
    chart: {
      'user-select': 'none',
      overflow: 'hidden'
    },
    'chart-calendar-container': {
      'user-select': 'none',
      overflow: 'hidden',
      'max-width': '100%',
      'border-right': '1px solid #eee'
    },
    'chart-graph-container': {
      'user-select': 'none',
      overflow: 'hidden',
      'max-width': '100%',
      'border-right': '1px solid #eee'
    },
    'chart-area': {},
    'chart-graph': {
      overflow: 'hidden'
    },
    'chart-row-text-wrapper': {},
    'chart-row-text': {
      background: '#ffffffa0',
      'border-radius': '10px',
      'font-family': fontFamily,
      'font-size': fontSize,
      'font-weight': 'normal',
      color: '#000000a0',
      height: '100%',
      display: 'inline-block'
    },
    'chart-row-text-content': {
      padding: '0px 6px'
    },
    'chart-row-text-content--text': {},
    'chart-row-text-content--html': {},
    'chart-row-wrapper': {},
    'chart-row--selected': {
      filter: 'drop-shadow(0px 0px 3px #2C80BC)'
    },
    'chart-row--hover': {
      filter: 'brightness(0.96)'
    },
    'chart-row-bar-wrapper': {},
    'chart-row-bar': {},
    'chart-row-bar-polygon': {
      stroke: '#E74C3C',
      'stroke-width': 1,
      fill: '#F75C4C'
    },
    'chart-row-project-wrapper': {},
    'chart-row-project': {},
    'chart-row-project-polygon': {},
    'chart-row-milestone-wrapper': {},
    'chart-row-milestone': {},
    'chart-row-milestone-polygon': {},
    'chart-row-task-wrapper': {},
    'chart-row-task': {},
    'chart-row-task-polygon': {},
    'chart-row-progress-bar-wrapper': {},
    'chart-row-progress-bar': {},
    'chart-row-progress-bar-line': {
      stroke: '#ffffff25',
      'stroke-width': 20
    },
    'chart-row-progress-bar-solid': {
      fill: '#0EAC51',
      height: '20%'
    },
    'chart-row-progress-bar-pattern': {
      fill: 'url(#diagonalHatch)',
      transform: 'translateY(0.1) scaleY(0.8)'
    },
    'chart-row-progress-bar-outline': {
      stroke: '#E74C3C',
      'stroke-width': 1
    },
    'chart-dependency-lines-wrapper': {},
    'chart-dependency-lines-path': {
      fill: 'transparent',
      stroke: '#FFa00090',
      'stroke-width': 2
    },
    'chart-scroll-container': {},
    'chart-scroll-container--horizontal': {
      overflow: 'auto',
      'max-width': '100%'
    },
    'chart-scroll-container--vertical': {
      'overflow-y': 'auto',
      'overflow-x': 'hidden',
      'max-height': '100%',
      float: 'right'
    },
    'chart-days-highlight-rect': {
      fill: '#f3f5f780'
    },
    'chart-tooltip': {
      position: 'fixed',
      'pointer-events': 'none',
      background: '#ffffff',
      border: '1px solid #d0d0d0',
      'border-radius': '4px',
      padding: '6px 10px',
      'font-family': fontFamily,
      'font-size': fontSize,
      color: '#333333',
      'box-shadow': '0 2px 8px rgba(0, 0, 0, 0.15)',
      'z-index': 1000,
      'white-space': 'pre-line'
    },
    'slot-header-beforeOptions': {
      display: 'inline-block'
    }
  };
}

;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/GanttElastic.vue?vue&type=script&lang=js








const ctx = document.createElement('canvas').getContext('2d');

/**
 * Native ResizeObserver with a window-resize fallback for environments that
 * predate it - the resize-observer-polyfill dependency was dropped (issue #14)
 */
class ResizeObserverFallback {
  constructor(callback) {
    this.callback = callback;
    this.windowListener = () => this.callback([], this);
  }
  observe() {
    window.addEventListener('resize', this.windowListener);
  }
  unobserve() {
    window.removeEventListener('resize', this.windowListener);
  }
  disconnect() {
    this.unobserve();
  }
}
const ResizeObserverImpl =
  typeof window !== 'undefined' && typeof window.ResizeObserver !== 'undefined'
    ? window.ResizeObserver
    : ResizeObserverFallback;
let VueInst = (external_Vue_default());
function initVue() {
  if (typeof Vue !== 'undefined' && typeof VueInst === 'undefined') {
    VueInst = Vue;
  }
}
initVue();

let hourWidthCache = null;

/**
 * Helper function to fill out empty options in user settings
 *
 * @param {object} userOptions - initial user options that will merge with those below
 * @returns {object} merged options
 */
function getOptions(userOptions) {
  let localeName = 'en';
  if (typeof userOptions.locale !== 'undefined' && typeof userOptions.locale.name !== 'undefined') {
    localeName = userOptions.locale.name;
  }
  return {
    slots: {
      header: {}
    },
    taskMapping: {
      //*
      id: 'id',
      start: 'start',
      label: 'label',
      duration: 'duration',
      progress: 'progress',
      type: 'type',
      style: 'style',
      collapsed: 'collapsed'
    },
    width: 0,
    height: 0,
    clientWidth: 0,
    outerHeight: 0,
    rowsHeight: 0,
    allVisibleTasksHeight: 0,
    scroll: {
      scrolling: false,
      dragXMoveMultiplier: 3, //*
      dragYMoveMultiplier: 2, //*
      top: 0,
      taskList: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      chart: {
        left: 0,
        right: 0,
        percent: 0,
        timePercent: 0,
        top: 0,
        bottom: 0,
        time: 0,
        timeCenter: 0,
        dateTime: {
          left: '',
          right: ''
        }
      }
    },
    scope: {
      //*
      before: 1,
      after: 1
    },
    times: {
      timeScale: 60 * 1000,
      timeZoom: 17, //*
      timePerPixel: 0,
      firstTime: null,
      lastTime: null,
      firstTaskTime: 0,
      lastTaskTime: 0,
      totalViewDurationMs: 0,
      totalViewDurationPx: 0,
      stepDuration: 'day',
      steps: []
    },
    row: {
      height: 24 //*
    },
    maxRows: 20, //*
    maxHeight: 0, //*
    taskSelection: {
      display: true //*
    },
    chart: {
      grid: {
        horizontal: {
          gap: 6 //*
        }
      },
      progress: {
        width: 20, //*
        height: 6, //*
        pattern: true,
        bar: false
      },
      text: {
        offset: 4, //*
        xPadding: 10, //*
        display: true //*
      },
      expander: {
        type: 'chart',
        display: false, //*
        displayIfTaskListHidden: true, //*
        offset: 4, //*
        size: 18
      },
      tooltip: {
        display: true, //*
        format: null //* custom format(task) returning the tooltip text
      },
      currentTimeLine: {
        display: true, //*
        color: '', //* optional stroke color override
        strokeWidth: 0, //* optional stroke width override
        updateInterval: 60000 //* ms between "now" refreshes
      }
    },
    taskList: {
      display: true, //*
      resizeAfterThreshold: true, //*
      widthThreshold: 75, //*
      columns: [
        //*
        {
          id: 0,
          label: 'ID',
          value: 'id',
          width: 40
        }
      ],
      percent: 100, //*
      width: 0,
      finalWidth: 0,
      widthFromPercentage: 0,
      minWidth: 18,
      persistColumnWidths: false, //* persist runtime column widths to localStorage
      persistKey: 'default', //* storage key suffix when persistColumnWidths is on
      expander: {
        type: 'task-list',
        size: 16,
        columnWidth: 24,
        padding: 16,
        margin: 10,
        straight: false
      }
    },
    calendar: {
      workingDays: [1, 2, 3, 4, 5], //*
      gap: 6, //*
      height: 0,
      strokeWidth: 1,
      hour: {
        height: 20, //*
        display: true, //*
        widths: [],
        maxWidths: { short: 0, medium: 0, long: 0 },
        formatted: {
          long: [],
          medium: [],
          short: []
        },
        format: {
          //*
          long(date) {
            return date.format('HH:mm');
          },
          medium(date) {
            return date.format('HH:mm');
          },
          short(date) {
            return date.format('HH');
          }
        }
      },
      day: {
        height: 20, //*
        display: true, //*
        widths: [],
        maxWidths: { short: 0, medium: 0, long: 0 },
        format: {
          long(date) {
            return date.format('DD dddd');
          },
          medium(date) {
            return date.format('DD ddd');
          },
          short(date) {
            return date.format('DD');
          }
        }
      },
      month: {
        height: 20, //*
        display: true, //*
        widths: [],
        maxWidths: { short: 0, medium: 0, long: 0 },
        format: {
          //*
          short(date) {
            return date.format('MM');
          },
          medium(date) {
            return date.format("MMM 'YY");
          },
          long(date) {
            return date.format('MMMM YYYY');
          }
        }
      }
    },
    locale: {
      //*
      name: 'en',
      weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
      weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
      weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
      months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
      monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
      weekStart: 1,
      relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years'
      },
      formats: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd, D MMMM YYYY HH:mm'
      },
      ordinal: n => {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return `[${n}${s[(v - 20) % 10] || s[v] || s[0]}]`;
      }
    }
  };
}

/**
 * Prepare style
 *
 * @returns {object}
 */
function prepareStyle(userStyle) {
  let fontSize = '12px';
  let fontFamily; // getStyle() supplies the default system stack, no body inheritance
  if (typeof userStyle !== 'undefined') {
    if (typeof userStyle.fontSize !== 'undefined') {
      fontSize = userStyle.fontSize;
    }
    if (typeof userStyle.fontFamily !== 'undefined') {
      fontFamily = userStyle.fontFamily;
    }
  }
  return getStyle(fontSize, fontFamily);
}

/**
 * Helper function to determine if specified variable is an object
 *
 * @param {any} item
 *
 * @returns {boolean}
 */
function isObject(item) {
  return (
    item &&
    typeof item === 'object' &&
    !Array.isArray(item) &&
    !(item instanceof HTMLElement) &&
    !(item instanceof CanvasRenderingContext2D) &&
    typeof item !== 'function'
  );
}

/**
 * Helper function which will merge objects recursively - creating brand new one - like clone
 *
 * @param {object} target
 * @params {object} sources
 *
 * @returns {object}
 */
function mergeDeep(target, ...sources) {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (typeof target[key] === 'undefined') {
          target[key] = {};
        }
        target[key] = mergeDeep(target[key], source[key]);
      } else if (Array.isArray(source[key])) {
        target[key] = [];
        for (let item of source[key]) {
          if (isObject(item)) {
            target[key].push(mergeDeep({}, item));
            continue;
          }
          target[key].push(item);
        }
      } else {
        target[key] = source[key];
      }
    }
  }
  return mergeDeep(target, ...sources);
}

/**
 * Detect if object or array is observable
 *
 * @param {object|array} obj
 *
 * @returns {boolean}
 */
function isObservable(obj) {
  return typeof obj === 'object' && obj.hasOwnProperty('__ob__');
}

/**
 * Same as above but with reactivity in mind
 *
 * @param {object} target
 * @params {object} sources
 *
 * @returns {object}
 */
function mergeDeepReactive(component, target, ...sources) {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (typeof target[key] === 'undefined') {
          component.$set(target, key, {});
        }
        mergeDeepReactive(component, target[key], source[key]);
      } else if (Array.isArray(source[key])) {
        component.$set(target, key, source[key]);
      } else if (typeof source[key] === 'function') {
        if (source[key].toString().indexOf('[native code]') === -1) {
          target[key] = source[key];
        }
      } else {
        component.$set(target, key, source[key]);
      }
    }
  }
  return mergeDeepReactive(component, target, ...sources);
}
/**
 * Check if objects or arrays are equal by comparing nested values
 *
 * @param {object|array} left
 * @param {object|array} right
 *
 * @returns {boolean}
 */
function notEqualDeep(left, right, cache = [], path = '') {
  if (typeof right !== typeof left) {
    return { left, right, what: path + '.typeof' };
  } else if (Array.isArray(left) && !Array.isArray(right)) {
    return { left, right, what: path + '.isArray' };
  } else if (Array.isArray(right) && !Array.isArray(left)) {
    return { left, right, what: path + '.isArray' };
  } else if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) {
      return { left, right, what: path + '.length' };
    }
    let what;
    for (let index = 0, len = left.length; index < len; index++) {
      if ((what = notEqualDeep(left[index], right[index], cache, path + '.' + index))) {
        return what;
      }
    }
  } else if (isObject(left) && !isObject(right)) {
    return { left, right, what: path + '.isObject' };
  } else if (isObject(right) && !isObject(left)) {
    return { left, right, what: path + '.isObject' };
  } else if (isObject(left) && isObject(right)) {
    for (let key in left) {
      if (!left.hasOwnProperty(key) || !left.propertyIsEnumerable(key)) {
        continue;
      }
      if (!right.hasOwnProperty(key)) {
        return { left, right, what: path + '.' + key };
      }
      let what;
      if ((what = notEqualDeep(left[key], right[key], cache, path + '.' + key))) {
        return what;
      }
    }
  } else if (left !== right) {
    return { left, right, what: path + '. !==' };
  }
  return false;
}

/**
 * GanttElastic
 * Main vue component
 */
const GanttElastic = {
  name: 'GanttElastic',
  components: {
    MainView: MainView,
    GanttHeader: Header
  },
  props: ['tasks', 'options', 'dynamicStyle'],
  provide() {
    const provider = {};
    const self = this;
    Object.defineProperty(provider, 'root', {
      enumerable: true,
      get: () => self
    });
    return provider;
  },
  data() {
    return {
      state: {
        tasks: [],
        options: {
          scrollBarHeight: 0,
          allVisibleTasksHeight: 0,
          outerHeight: 0,
          scroll: {
            left: 0,
            top: 0
          }
        },
        dynamicStyle: {},
        selectedTaskId: null,
        hoveredTaskId: null,
        now: Date.now(),
        nowTimer: null,
        refs: {},
        tasksById: {},
        taskTree: {},
        ctx,
        emitTasksChanges: true, // some operations may pause emitting changes to parent component
        emitOptionsChanges: true, // some operations may pause emitting changes to parent component
        resizeObserver: null,
        unwatchTasks: null,
        unwatchOptions: null,
        unwatchStyle: null,
        unwatchVisibleTasksGeometry: null,
        initialized: false,
        unwatchOutputTasks: null,
        unwatchOutputOptions: null,
        unwatchOutputStyle: null
      }
    };
  },
  methods: {
    mergeDeep,
    mergeDeepReactive,

    /**
     * Calculate height of scrollbar in current browser
     *
     * @returns {number}
     */
    getScrollBarHeight() {
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.height = '100px';
      outer.style.msOverflowStyle = 'scrollbar';
      document.body.appendChild(outer);
      var noScroll = outer.offsetHeight;
      outer.style.overflow = 'scroll';
      var inner = document.createElement('div');
      inner.style.height = '100%';
      outer.appendChild(inner);
      var withScroll = inner.offsetHeight;
      outer.parentNode.removeChild(outer);
      const height = noScroll - withScroll;
      this.style['chart-scroll-container--vertical']['margin-left'] = `-${height}px`;
      return (this.state.options.scrollBarHeight = height);
    },

    /**
     * Fill out empty task properties and make it reactive
     *
     * @param {array} tasks
     */
    fillTasks(tasks) {
      for (let task of tasks) {
        if (typeof task.x === 'undefined') {
          task.x = 0;
        }
        if (typeof task.y === 'undefined') {
          task.y = 0;
        }
        if (typeof task.width === 'undefined') {
          task.width = 0;
        }
        if (typeof task.height === 'undefined') {
          task.height = 0;
        }
        if (typeof task.mouseOver === 'undefined') {
          task.mouseOver = false;
        }
        if (typeof task.collapsed === 'undefined') {
          task.collapsed = false;
        }
        if (typeof task.dependentOn === 'undefined') {
          task.dependentOn = [];
        }
        if (typeof task.parentId === 'undefined') {
          task.parentId = null;
        }
        if (typeof task.style === 'undefined') {
          task.style = {};
        }
        if (typeof task.children === 'undefined') {
          task.children = [];
        }
        if (typeof task.allChildren === 'undefined') {
          task.allChildren = [];
        }
        if (typeof task.parents === 'undefined') {
          task.parents = [];
        }
        if (typeof task.parent === 'undefined') {
          task.parent = null;
        }
        if (typeof task.startTime === 'undefined') {
          task.startTime = dayjs_min_default()(task.start).valueOf();
        }
        if (typeof task.endTime === 'undefined' && task.hasOwnProperty('end')) {
          task.endTime = dayjs_min_default()(task.end).valueOf();
        } else if (typeof task.endTime === 'undefined' && task.hasOwnProperty('duration')) {
          task.endTime = task.startTime + task.duration;
        }
        if (typeof task.duration === 'undefined' && task.hasOwnProperty('endTime')) {
          task.duration = task.endTime - task.startTime;
        }
        // a task with neither end nor duration would produce NaN geometry
        // (width, prepareDates' lastTaskTime) further down the pipeline
        if (typeof task.duration === 'undefined') {
          task.duration = 0;
        }
      }
      return tasks;
    },

    /**
     * Map tasks
     *
     * @param {Array} tasks
     * @param {Object} options
     */
    mapTasks(tasks, options) {
      // do not mutate the reactive props array - replacing its entries
      // would re-trigger the deep tasks watcher on every setup (infinite loop in Vue 3)
      return tasks.map(task => ({
        ...task,
        id: task[options.taskMapping.id],
        start: task[options.taskMapping.start],
        label: task[options.taskMapping.label],
        duration: task[options.taskMapping.duration],
        progress: task[options.taskMapping.progress],
        type: task[options.taskMapping.type],
        style: task[options.taskMapping.style],
        collapsed: task[options.taskMapping.collapsed]
      }));
    },

    /**
     * Initialize component
     */
    initialize(itsUpdate = '') {
      // on re-initialization (tasks/options prop changed at runtime) user-modified
      // runtime values must survive: collapsed flags toggled via the expander and
      // times.timeZoom changed through the header slider or directly on state
      const reinit = this.state.initialized === true;
      const prevTasksById = reinit ? this.state.tasksById : null;
      let options = mergeDeep({}, this.state.options, getOptions(this.options), this.options);
      if (reinit && typeof this.options.times === 'undefined') {
        options.times.timeZoom = this.state.options.times.timeZoom;
      }
      let tasks = this.mapTasks(this.tasks, options);
      if (Object.keys(this.state.dynamicStyle).length === 0) {
        this.initializeStyle();
      }
      dayjs_min_default().locale(options.locale, null, true);
      dayjs_min_default().locale(options.locale.name);
      if (typeof options.taskList === 'undefined') {
        options.taskList = {};
      }
      options.taskList.columns = options.taskList.columns.map((column, index) => {
        column.thresholdPercent = 100;
        column.widthFromPercentage = 0;
        column.finalWidth = 0;
        if (typeof column.height === 'undefined') {
          column.height = 0;
        }
        if (typeof column.style === 'undefined') {
          column.style = {};
        }
        column._id = `${index}-${column.label}`;
        // width as configured by the user options - double-click on the column
        // resizer resets to this (issue #11)
        column._initialWidth = column.width;
        return column;
      });
      this.state.options = options;
      tasks = this.fillTasks(tasks);
      if (reinit && prevTasksById) {
        for (let task of tasks) {
          const prev = prevTasksById[task.id];
          if (prev && typeof prev.collapsed !== 'undefined') {
            task.collapsed = prev.collapsed;
          }
        }
      }
      this.state.tasksById = this.resetTaskTree(tasks);
      this.state.taskTree = this.makeTaskTree(this.state.rootTask, tasks);
      this.state.tasks = this.state.taskTree.allChildren.map(childId => this.getTask(childId));
      this.calculateTaskListColumnsDimensions();
      this.state.options.scrollBarHeight = this.getScrollBarHeight();
      this.state.options.outerHeight = this.state.options.height + this.state.options.scrollBarHeight;
      this.state.initialized = true;
      this.globalOnResize();
    },

    /**
     * Initialize style
     */
    initializeStyle() {
      this.state.dynamicStyle = mergeDeep({}, prepareStyle(this.dynamicStyle), this.dynamicStyle);
    },

    /**
     * Get calendar rows outer height
     *
     * @returns {int}
     */
    getCalendarHeight() {
      return this.state.options.calendar.height + this.state.options.calendar.strokeWidth;
    },

    /**
     * Get maximal level of nested task children
     *
     * @returns {int}
     */
    getMaximalLevel() {
      let maximalLevel = 0;
      this.state.tasks.forEach(task => {
        if (task.parents.length > maximalLevel) {
          maximalLevel = task.parents.length;
        }
      });
      return maximalLevel - 1;
    },

    /**
     * Get maximal expander width - to calculate straight task list text
     *
     * @returns {int}
     */
    getMaximalExpanderWidth() {
      return (
        this.getMaximalLevel() * this.state.options.taskList.expander.padding +
        this.state.options.taskList.expander.margin
      );
    },

    /**
     * Synchronize scrollTop property when row height is changed
     */
    syncScrollTop() {
      if (
        this.state.refs.taskListItems &&
        this.state.refs.chartGraph.scrollTop !== this.state.refs.taskListItems.scrollTop
      ) {
        this.state.options.scroll.top = this.state.refs.taskListItems.scrollTop = this.state.refs.chartScrollContainerVertical.scrollTop = this.state.refs.chartGraph.scrollTop;
      }
    },

    /**
     * Calculate task list columns dimensions
     */
    calculateTaskListColumnsDimensions() {
      let final = 0;
      let percentage = 0;
      for (let column of this.state.options.taskList.columns) {
        if (column.expander) {
          column.widthFromPercentage =
            ((this.getMaximalExpanderWidth() + column.width) / 100) * this.state.options.taskList.percent;
        } else {
          column.widthFromPercentage = (column.width / 100) * this.state.options.taskList.percent;
        }
        percentage += column.widthFromPercentage;
        column.finalWidth = (column.thresholdPercent * column.widthFromPercentage) / 100;
        final += column.finalWidth;
        column.height = this.getTaskHeight() - this.style['grid-line-horizontal']['stroke-width'];
      }
      this.state.options.taskList.widthFromPercentage = percentage;
      this.state.options.taskList.finalWidth = final;
    },

    /**
     * Reset task tree - which is used to create tree like structure inside task list
     */
    resetTaskTree(tasks) {
      this.$set(this.state, 'rootTask', {
        id: null,
        label: 'root',
        children: [],
        allChildren: [],
        parents: [],
        parent: null,
        __root: true
      });
      const tasksById = {};
      for (let i = 0, len = tasks.length; i < len; i++) {
        let current = tasks[i];
        current.children = [];
        current.allChildren = [];
        current.parent = null;
        current.parents = [];
        tasksById[current.id] = current;
      }
      return tasksById;
    },

    /**
     * Make task tree, after reset - look above
     *
     * @param {object} task
     * @returns {object} tasks with children and parents
     */
    makeTaskTree(task, tasks) {
      for (let i = 0, len = tasks.length; i < len; i++) {
        let current = tasks[i];
        if (current.parentId === task.id) {
          if (task.parents.length) {
            task.parents.forEach(parent => current.parents.push(parent));
          }
          if (!task.propertyIsEnumerable('__root')) {
            current.parents.push(task.id);
            current.parent = task.id;
          } else {
            current.parents = [];
            current.parent = null;
          }
          current = this.makeTaskTree(current, tasks);
          task.allChildren.push(current.id);
          task.children.push(current.id);
          current.allChildren.forEach(childId => task.allChildren.push(childId));
        }
      }
      return task;
    },

    /**
     * Get task by id
     *
     * @param {any} taskId
     * @returns {object|null} task
     */
    getTask(taskId) {
      if (typeof this.state.tasksById[taskId] !== 'undefined') {
        return this.state.tasksById[taskId];
      }
      return null;
    },

    /**
     * Get children tasks for specified taskId
     *
     * @param {any} taskId
     * @returns {array} children
     */
    getChildren(taskId) {
      return this.state.tasks.filter(task => task.parent === taskId);
    },

    /**
     * Is task visible
     *
     * @param {Number|String|Task} task
     */
    isTaskVisible(task) {
      if (typeof task === 'number' || typeof task === 'string') {
        task = this.getTask(task);
      }
      for (let i = 0, len = task.parents.length; i < len; i++) {
        if (this.getTask(task.parents[i]).collapsed) {
          return false;
        }
      }
      return true;
    },

    /**
     * Get svg
     *
     * @returns {string} html svg image of gantt
     */
    getSVG() {
      return this.state.options.mainView.outerHTML;
    },

    /**
     * Get image
     *
     * @param {string} type image format
     * @returns {Promise} when resolved returns base64 image string of gantt
     */
    getImage(type = 'image/png') {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = this.state.options.mainView.clientWidth;
          canvas.height = this.state.options.rowsHeight;
          canvas.getContext('2d').drawImage(img, 0, 0);
          resolve(canvas.toDataURL(type));
        };
        img.src = 'data:image/svg+xml,' + encodeURIComponent(this.getSVG());
      });
    },

    /**
     * Get gantt total height
     *
     * @returns {number}
     */
    getHeight(visibleTasks, outer = false) {
      let height =
        visibleTasks.length * (this.state.options.row.height + this.state.options.chart.grid.horizontal.gap * 2) +
        this.state.options.calendar.height +
        this.state.options.calendar.strokeWidth +
        this.state.options.calendar.gap;
      if (outer) {
        height += this.state.options.scrollBarHeight;
      }
      return height;
    },

    /**
     * Get one task height
     *
     * @returns {number}
     */
    getTaskHeight(withStroke = false) {
      if (withStroke) {
        return (
          this.state.options.row.height +
          this.state.options.chart.grid.horizontal.gap * 2 +
          this.style['grid-line-horizontal']['stroke-width']
        );
      }
      return this.state.options.row.height + this.state.options.chart.grid.horizontal.gap * 2;
    },

    /**
     * Get specified tasks height
     *
     * @returns {number}
     */
    getTasksHeight(visibleTasks) {
      return visibleTasks.length * this.getTaskHeight();
    },

    /**
     * Convert time (in milliseconds) to pixel offset inside chart
     *
     * @param {int} ms
     * @returns {number}
     */
    timeToPixelOffsetX(ms) {
      let x = ms - this.state.options.times.firstTime;
      if (!x) {
        return 0;
      }
      // timePerPixel is 0 until recalculateTimes() runs - never divide into Infinity
      return this.state.options.times.timePerPixel > 0 ? x / this.state.options.times.timePerPixel : 0;
    },

    /**
     * Convert pixel offset inside chart to corresponding time offset in milliseconds
     *
     * @param {number} pixelOffsetX
     * @returns {int} milliseconds
     */
    pixelOffsetXToTime(pixelOffsetX) {
      let offset = pixelOffsetX + this.style['grid-line-vertical']['stroke-width'] / 2;
      return offset * this.state.options.times.timePerPixel + this.state.options.times.firstTime;
    },

    /**
     * Determine if element is inside current view port
     *
     * @param {number} x - element placement
     * @param {number} width - element width
     * @param {int} buffer - or threshold, if element is outside viewport but offset from view port is below this value return true
     * @returns {boolean}
     */
    isInsideViewPort(x, width, buffer = 5000) {
      return (
        (x + width + buffer >= this.state.options.scroll.chart.left &&
          x - buffer <= this.state.options.scroll.chart.right) ||
        (x - buffer <= this.state.options.scroll.chart.left &&
          x + width + buffer >= this.state.options.scroll.chart.right)
      );
    },

    /**
     * Chart scroll event handler
     *
     * @param {event} ev
     */
    onScrollChart(ev) {
      this._onScrollChart(
        this.state.refs.chartScrollContainerHorizontal.scrollLeft,
        this.state.refs.chartScrollContainerVertical.scrollTop
      );
    },

    /**
     * After same as above but with different arguments - normalized
     *
     * @param {number} left
     * @param {number} top
     */
    _onScrollChart(left, top) {
      if (this.state.options.scroll.chart.left === left && this.state.options.scroll.chart.top === top) {
        return;
      }
      const chartContainerWidth = this.state.refs.chartContainer.clientWidth;
      this.state.options.scroll.chart.left = left;
      this.state.options.scroll.chart.right = left + chartContainerWidth;
      this.state.options.scroll.chart.percent = (left / this.state.options.times.totalViewDurationPx) * 100;
      this.state.options.scroll.chart.top = top;
      this.state.options.scroll.chart.time = this.pixelOffsetXToTime(left);
      this.state.options.scroll.chart.timeCenter = this.pixelOffsetXToTime(left + chartContainerWidth / 2);
      this.state.options.scroll.chart.dateTime.left = dayjs_min_default()(this.state.options.scroll.chart.time).valueOf();
      this.state.options.scroll.chart.dateTime.right = dayjs_min_default()(
        this.pixelOffsetXToTime(left + this.state.refs.chart.clientWidth)
      ).valueOf();
      this.scrollTo(left, top);
    },

    /**
     * Scroll current chart to specified time (in milliseconds)
     *
     * @param {int} time
     */
    scrollToTime(time) {
      let pos = this.timeToPixelOffsetX(time);
      const chartContainerWidth = this.state.refs.chartContainer.clientWidth;
      pos = pos - chartContainerWidth / 2;
      if (pos > this.state.options.width) {
        pos = this.state.options.width - chartContainerWidth;
      }
      this.scrollTo(pos);
    },

    /**
     * Scroll chart or task list to specified pixel values
     *
     * @param {number|null} left
     * @param {number|null} top
     */
    scrollTo(left = null, top = null) {
      if (left !== null) {
        this.state.refs.chartCalendarContainer.scrollLeft = left;
        this.state.refs.chartGraphContainer.scrollLeft = left;
        this.state.refs.chartScrollContainerHorizontal.scrollLeft = left;
        this.state.options.scroll.left = left;
      }
      if (top !== null) {
        this.state.refs.chartScrollContainerVertical.scrollTop = top;
        this.state.refs.chartGraph.scrollTop = top;
        this.state.refs.taskListItems.scrollTop = top;
        this.state.options.scroll.top = top;
        this.syncScrollTop();
      }
    },

    /**
     * After some actions like time zoom change we need to recompensate scroll position
     * so as a result everything will be in same place
     */
    fixScrollPos() {
      this.scrollToTime(this.state.options.scroll.chart.timeCenter);
    },

    /**
     * Mouse wheel event handler
     */
    onWheelChart(ev) {
      if (!ev.shiftKey && ev.deltaX === 0) {
        let top = this.state.options.scroll.top + ev.deltaY;
        const chartClientHeight = this.state.options.rowsHeight;
        const scrollHeight = this.state.refs.chartGraph.scrollHeight - chartClientHeight;
        if (top < 0) {
          top = 0;
        } else if (top > scrollHeight) {
          top = scrollHeight;
        }
        this.scrollTo(null, top);
      } else if (ev.shiftKey && ev.deltaX === 0) {
        let left = this.state.options.scroll.left + ev.deltaY;
        const chartClientWidth = this.state.refs.chartScrollContainerHorizontal.clientWidth;
        const scrollWidth = this.state.refs.chartScrollContainerHorizontal.scrollWidth - chartClientWidth;
        if (left < 0) {
          left = 0;
        } else if (left > scrollWidth) {
          left = scrollWidth;
        }
        this.scrollTo(left);
      } else {
        let left = this.state.options.scroll.left + ev.deltaX;
        const chartClientWidth = this.state.refs.chartScrollContainerHorizontal.clientWidth;
        const scrollWidth = this.state.refs.chartScrollContainerHorizontal.scrollWidth - chartClientWidth;
        if (left < 0) {
          left = 0;
        } else if (left > scrollWidth) {
          left = scrollWidth;
        }
        this.scrollTo(left);
      }
    },

    /**
     * Time zoom change event handler
     */
    onTimeZoomChange(timeZoom) {
      this.state.options.times.timeZoom = timeZoom;
      this.recalculateTimes();
      this.calculateSteps();
      this.fixScrollPos();
    },

    /**
     * Row height change event handler
     */
    onRowHeightChange(height) {
      this.state.options.row.height = height;
      this.calculateTaskListColumnsDimensions();
      this.syncScrollTop();
    },

    /**
     * Scope change event handler
     */
    onScopeChange(value) {
      this.state.options.scope.before = value;
      this.state.options.scope.after = value;
      this.initTimes();
      this.calculateSteps();
      this.computeCalendarWidths();
      this.fixScrollPos();
    },

    /**
     * Task list width change event handler
     */
    onTaskListWidthChange(value) {
      this.state.options.taskList.percent = value;
      this.calculateTaskListColumnsDimensions();
      this.fixScrollPos();
    },

    /**
     * Task list column width change event handler
     */
    onTaskListColumnWidthChange() {
      this.calculateTaskListColumnsDimensions();
      this.fixScrollPos();
    },

    /**
     * Select a task - highlights its chart bar and task list row
     *
     * @param {any} taskId
     */
    selectTask(taskId) {
      if (this.state.options.taskSelection.display === false || this.getTask(taskId) === null) {
        return;
      }
      this.state.selectedTaskId = taskId;
      this.$emit('task-selected', this.getTask(taskId));
      this.$emitBus.emit('task-selected', this.getTask(taskId));
    },

    /**
     * Clear the current task selection
     */
    clearSelection() {
      if (this.state.selectedTaskId === null) {
        return;
      }
      this.state.selectedTaskId = null;
      this.$emit('task-selected', null);
      this.$emitBus.emit('task-selected', null);
    },

    /**
     * Calculate geometry (width, height, x, y) of a single visible task
     * Shared by the visibleTasks watcher and updateTask()
     *
     * @param {object} task
     * @param {number} index row index inside visibleTasks
     */
    calculateTaskGeometry(task, index) {
      task.width =
        task.duration / this.state.options.times.timePerPixel - this.style['grid-line-vertical']['stroke-width'];
      // NaN (missing duration) / Infinity (timePerPixel still 0) must never
      // reach the SVG attributes - issue #2 first-paint regression net
      if (!Number.isFinite(task.width) || task.width < 0) {
        task.width = 0;
      }
      task.height = this.state.options.row.height;
      task.x = this.timeToPixelOffsetX(task.startTime);
      task.y =
        (this.state.options.row.height + this.state.options.chart.grid.horizontal.gap * 2) * index +
        this.state.options.chart.grid.horizontal.gap;
    },

    /**
     * Update a single task in place - the O(changed) alternative to mutating
     * the tasks prop, which a deep watcher answers with a full rebuild.
     * The patch is applied to the state task only; owners stay current through
     * the tasks-changed event (mirroring onto the props task would fire the
     * props watcher, whose array-order comparison treats any mutation as
     * drift and triggers exactly the rebuild this API avoids).
     * A patch moving the task outside the rendered time window falls back to
     * a full setup() because the chart range itself must be recalculated -
     * in that case the returned task is the freshly rebuilt state task.
     *
     * @param {any} taskId
     * @param {object} patch task fields to change
     * @returns {object|null} the updated state task
     */
    updateTask(taskId, patch) {
      const task = this.getTask(taskId);
      if (task === null || !isObject(patch)) {
        return null;
      }
      Object.assign(task, patch);
      if (
        typeof patch.start !== 'undefined' ||
        typeof patch.end !== 'undefined' ||
        typeof patch.startTime !== 'undefined' ||
        typeof patch.endTime !== 'undefined' ||
        typeof patch.duration !== 'undefined'
      ) {
        const prevStartTime = task.startTime;
        if (typeof patch.start !== 'undefined') {
          task.startTime = dayjs_min_default()(task.start).valueOf();
        }
        if (typeof patch.end !== 'undefined') {
          task.endTime = dayjs_min_default()(task.end).valueOf();
        }
        if (typeof patch.startTime !== 'undefined') {
          task.startTime = patch.startTime;
        }
        if (typeof patch.endTime !== 'undefined') {
          task.endTime = patch.endTime;
        }
        if (
          (typeof patch.start !== 'undefined' || typeof patch.startTime !== 'undefined') &&
          typeof patch.end === 'undefined' &&
          typeof patch.endTime === 'undefined' &&
          typeof prevStartTime !== 'undefined' &&
          typeof task.endTime !== 'undefined'
        ) {
          // the start moved without a new end - shift the end to keep the duration
          task.endTime = task.startTime + (task.endTime - prevStartTime);
        }
        if (typeof patch.duration !== 'undefined') {
          task.endTime = task.startTime + task.duration;
        } else if (typeof task.endTime !== 'undefined') {
          task.duration = task.endTime - task.startTime;
        }
        const endTime = typeof task.endTime !== 'undefined' ? task.endTime : task.startTime + task.duration;
        if (task.startTime < this.state.options.times.firstTime || endTime > this.state.options.times.lastTime) {
          this.setup('updateTask');
          return this.getTask(taskId);
        }
      }
      const index = this.visibleTasks.indexOf(task);
      if (index !== -1) {
        this.calculateTaskGeometry(task, index);
      }
      return task;
    },

    /**
     * (Re)start the "now" refresh timer for the current-time line (issue #7).
     * Public so consumers can restart it after changing updateInterval.
     */
    startNowTimer() {
      if (this.state.nowTimer !== null) {
        clearInterval(this.state.nowTimer);
        this.state.nowTimer = null;
      }
      if (this.state.options.chart.currentTimeLine.display !== false) {
        const updateInterval = this.state.options.chart.currentTimeLine.updateInterval || 60000;
        this.state.nowTimer = setInterval(() => {
          this.state.now = Date.now();
        }, updateInterval);
      }
    },

    /**
     * Listen to specified event names
     */
    initializeEvents() {
      this.$emitBus.on('chart-scroll-horizontal', this.onScrollChart);
      this.$emitBus.on('chart-scroll-vertical', this.onScrollChart);
      this.$emitBus.on('chart-wheel', this.onWheelChart);
      this.$emitBus.on('times-timeZoom-change', this.onTimeZoomChange);
      this.$emitBus.on('row-height-change', this.onRowHeightChange);
      this.$emitBus.on('scope-change', this.onScopeChange);
      this.$emitBus.on('taskList-width-change', this.onTaskListWidthChange);
      this.$emitBus.on('taskList-column-width-change', this.onTaskListColumnWidthChange);
      // clicking a bar or a task list cell selects the task (issue #6)
      for (let type of ['task', 'milestone', 'project']) {
        this.$emitBus.on(`chart-${type}-click`, ({ data }) => this.selectTask(data.id));
        this.$emitBus.on(`taskList-${type}-click`, ({ data }) => this.selectTask(data.id));
      }
      // hovering a row highlights it in both the chart and the task list
      // (issue #12). Row level enter/leave only - mouseenter/mouseleave do not
      // bubble, so crossings between a row's children (progress bar, expander,
      // links) cannot flicker the highlight. Bar and cell level events stay
      // available on the bus for consumers.
      for (let source of ['chart-row', 'taskList-row']) {
        this.$emitBus.on(`${source}-mouseenter`, ({ data }) => {
          this.state.hoveredTaskId = data.id;
        });
        this.$emitBus.on(`${source}-mouseleave`, ({ data }) => {
          if (this.state.hoveredTaskId === data.id) {
            this.state.hoveredTaskId = null;
          }
        });
      }
    },

    /**
     * When some action was performed (scale change for example) - recalculate time variables
     */
    recalculateTimes() {
      let max = this.state.options.times.timeScale * 60;
      let min = this.state.options.times.timeScale;
      let steps = max / min;
      let percent = this.state.options.times.timeZoom / 100;
      this.state.options.times.timePerPixel =
        this.state.options.times.timeScale * steps * percent + Math.pow(2, this.state.options.times.timeZoom);
      this.state.options.times.totalViewDurationMs = dayjs_min_default()(this.state.options.times.lastTime).diff(
        this.state.options.times.firstTime,
        'milliseconds'
      );
      this.state.options.times.totalViewDurationPx =
        this.state.options.times.totalViewDurationMs / this.state.options.times.timePerPixel;
      this.state.options.width =
        this.state.options.times.totalViewDurationPx + this.style['grid-line-vertical']['stroke-width'];
    },

    /**
     * Initialize time variables
     */
    initTimes() {
      this.state.options.times.firstTime = dayjs_min_default()(this.state.options.times.firstTaskTime)
        .locale(this.state.options.locale.name)
        .startOf('day')
        .subtract(this.state.options.scope.before, 'days')
        .startOf('day')
        .valueOf();
      this.state.options.times.lastTime = dayjs_min_default()(this.state.options.times.lastTaskTime)
        .locale(this.state.options.locale.name)
        .endOf('day')
        .add(this.state.options.scope.after, 'days')
        .endOf('day')
        .valueOf();
      this.recalculateTimes();
    },

    /**
     * Calculate steps
     * Steps are days by default
     * Each step contain information about time offset and pixel offset of this time inside gantt chart
     */
    calculateSteps() {
      const steps = [];
      const lastMs = dayjs_min_default()(this.state.options.times.lastTime).valueOf();
      const currentDate = dayjs_min_default()(this.state.options.times.firstTime);
      steps.push({
        time: currentDate.valueOf(),
        offset: {
          ms: 0,
          px: 0
        }
      });
      for (
        let currentDate = dayjs_min_default()(this.state.options.times.firstTime)
          .add(1, this.state.options.times.stepDuration)
          .startOf('day');
        currentDate.valueOf() <= lastMs;
        currentDate = currentDate.add(1, this.state.options.times.stepDuration).startOf('day')
      ) {
        const offsetMs = currentDate.diff(this.state.options.times.firstTime, 'milliseconds');
        const offsetPx = offsetMs / this.state.options.times.timePerPixel;
        const step = {
          time: currentDate.valueOf(),
          offset: {
            ms: offsetMs,
            px: offsetPx
          }
        };
        const previousStep = steps[steps.length - 1];
        previousStep.width = {
          ms: offsetMs - previousStep.offset.ms,
          px: offsetPx - previousStep.offset.px
        };
        steps.push(step);
      }
      const lastStep = steps[steps.length - 1];
      lastStep.width = {
        ms: this.state.options.times.totalViewDurationMs - lastStep.offset.ms,
        px: this.state.options.times.totalViewDurationPx - lastStep.offset.px
      };
      this.state.options.times.steps = steps;
    },

    /**
     * Calculate calendar widths - when scale was changed for example
     */
    computeCalendarWidths() {
      this.computeDayWidths();
      this.computeHourWidths();
      this.computeMonthWidths();
    },

    /**
     * Compute width of calendar hours column widths basing on text widths
     */
    computeHourWidths() {
      const style = { ...this.style['calendar-row-text'], ...this.style['calendar-row-text--hour'] };
      this.state.ctx.font = style['font-size'] + ' ' + style['font-family'];
      const localeName = this.state.options.locale.name;
      let currentDate = dayjs_min_default()('2018-01-01T00:00:00').locale(localeName); // any date will be good for hours
      let maxWidths = this.state.options.calendar.hour.maxWidths;
      if (maxWidths.length) {
        return;
      }
      for (let formatName in this.state.options.calendar.hour.format) {
        maxWidths[formatName] = 0;
      }
      for (let hour = 0; hour < 24; hour++) {
        let widths = { hour };
        for (let formatName in this.state.options.calendar.hour.format) {
          const hourFormatted = this.state.options.calendar.hour.format[formatName](currentDate);
          this.state.options.calendar.hour.formatted[formatName].push(hourFormatted);
          widths[formatName] = this.state.ctx.measureText(hourFormatted).width;
        }
        this.state.options.calendar.hour.widths.push(widths);
        for (let formatName in this.state.options.calendar.hour.format) {
          if (widths[formatName] > maxWidths[formatName]) {
            maxWidths[formatName] = widths[formatName];
          }
        }
        currentDate = currentDate.add(1, 'hour');
      }
    },

    /**
     * Compute calendar days column widths basing on text widths
     */
    computeDayWidths() {
      const style = { ...this.style['calendar-row-text'], ...this.style['calendar-row-text--day'] };
      this.state.ctx.font = style['font-size'] + ' ' + style['font-family'];
      const localeName = this.state.options.locale.name;
      let currentDate = dayjs_min_default()(this.state.options.times.steps[0].time).locale(localeName);
      let maxWidths = this.state.options.calendar.day.maxWidths;
      this.state.options.calendar.day.widths = [];
      Object.keys(this.state.options.calendar.day.format).forEach(formatName => {
        maxWidths[formatName] = 0;
      });
      for (let day = 0, daysLen = this.state.options.times.steps.length; day < daysLen; day++) {
        const widths = {
          day
        };
        Object.keys(this.state.options.calendar.day.format).forEach(formatName => {
          widths[formatName] = this.state.ctx.measureText(
            this.state.options.calendar.day.format[formatName](currentDate)
          ).width;
        });
        this.state.options.calendar.day.widths.push(widths);
        Object.keys(this.state.options.calendar.day.format).forEach(formatName => {
          if (widths[formatName] > maxWidths[formatName]) {
            maxWidths[formatName] = widths[formatName];
          }
        });
        currentDate = currentDate.add(1, 'day');
      }
    },

    /**
     * Months count
     *
     * @description Returns number of different months in specified time range
     *
     * @param {number} fromTime - date in ms
     * @param {number} toTime - date in ms
     *
     * @returns {number} different months count
     */
    monthsCount(fromTime, toTime) {
      if (fromTime > toTime) {
        return 0;
      }
      let currentMonth = dayjs_min_default()(fromTime);
      let previousMonth = currentMonth.clone();
      let monthsCount = 1;
      while (currentMonth.valueOf() <= toTime) {
        currentMonth = currentMonth.add(1, 'day');
        if (previousMonth.month() !== currentMonth.month()) {
          monthsCount++;
        }
        previousMonth = currentMonth.clone();
      }
      return monthsCount;
    },

    /**
     * Compute month calendar columns widths basing on text widths
     */
    computeMonthWidths() {
      const style = { ...this.style['calendar-row-text'], ...this.style['calendar-row-text--month'] };
      this.state.ctx.font = style['font-size'] + ' ' + style['font-family'];
      let maxWidths = this.state.options.calendar.month.maxWidths;
      this.state.options.calendar.month.widths = [];
      Object.keys(this.state.options.calendar.month.format).forEach(formatName => {
        maxWidths[formatName] = 0;
      });
      const localeName = this.state.options.locale.name;
      let currentDate = dayjs_min_default()(this.state.options.times.firstTime).locale(localeName);
      const monthsCount = this.monthsCount(this.state.options.times.firstTime, this.state.options.times.lastTime);
      for (let month = 0; month < monthsCount; month++) {
        const widths = {
          month
        };
        Object.keys(this.state.options.calendar.month.format).forEach(formatName => {
          widths[formatName] = this.state.ctx.measureText(
            this.state.options.calendar.month.format[formatName](currentDate)
          ).width;
        });
        this.state.options.calendar.month.widths.push(widths);
        Object.keys(this.state.options.calendar.month.format).forEach(formatName => {
          if (widths[formatName] > maxWidths[formatName]) {
            maxWidths[formatName] = widths[formatName];
          }
        });
        currentDate = currentDate.add(1, 'month');
      }
    },

    /**
     * Prepare time and date variables for gantt
     */
    prepareDates() {
      let firstTaskTime = Number.MAX_SAFE_INTEGER;
      let lastTaskTime = 0;
      for (let index = 0, len = this.state.tasks.length; index < len; index++) {
        let task = this.state.tasks[index];
        if (task.startTime < firstTaskTime) {
          firstTaskTime = task.startTime;
        }
        if (task.startTime + task.duration > lastTaskTime) {
          lastTaskTime = task.startTime + task.duration;
        }
      }
      this.state.options.times.firstTaskTime = firstTaskTime;
      this.state.options.times.lastTaskTime = lastTaskTime;
      this.state.options.times.firstTime = dayjs_min_default()(firstTaskTime)
        .locale(this.state.options.locale.name)
        .startOf('day')
        .subtract(this.state.options.scope.before, 'days')
        .startOf('day')
        .valueOf();
      this.state.options.times.lastTime = dayjs_min_default()(lastTaskTime)
        .locale(this.state.options.locale.name)
        .endOf('day')
        .add(this.state.options.scope.after, 'days')
        .endOf('day')
        .valueOf();
    },

    /**
     * Setup and calculate everything
     */
    setup(itsUpdate = '') {
      this.initialize(itsUpdate);
      this.prepareDates();
      this.initTimes();
      this.calculateSteps();
      this.computeCalendarWidths();
      this.state.options.taskList.width = this.state.options.taskList.columns.reduce(
        (prev, current) => {
          return { width: prev.width + current.width };
        },
        { width: 0 }
      ).width;
    },

    /**
     * Global resize event (from window.addEventListener)
     */
    globalOnResize() {
      if (typeof this.$el === 'undefined' || !this.$el) {
        return;
      }
      this.state.options.clientWidth = this.$el.clientWidth;
      if (
        this.state.options.taskList.widthFromPercentage >
        (this.state.options.clientWidth / 100) * this.state.options.taskList.widthThreshold
      ) {
        const diff =
          this.state.options.taskList.widthFromPercentage -
          (this.state.options.clientWidth / 100) * this.state.options.taskList.widthThreshold;
        let diffPercent = 100 - (diff / this.state.options.taskList.widthFromPercentage) * 100;
        if (diffPercent < 0) {
          diffPercent = 0;
        }
        this.state.options.taskList.columns.forEach(column => {
          column.thresholdPercent = diffPercent;
        });
      } else {
        this.state.options.taskList.columns.forEach(column => {
          column.thresholdPercent = 100;
        });
      }
      this.calculateTaskListColumnsDimensions();
      this.$emit('calendar-recalculate');
      this.$emitBus.emit('calendar-recalculate');
      this.syncScrollTop();
    }
  },

  computed: {
    /**
     * Get visible tasks
     * Very important method which will bring us only those tasks that are visible inside gantt chart
     * For example when task is collapsed - children of this task are not visible - we should not render them
     */
    visibleTasks() {
      // pure computed - the geometry side effects live in the visibleTasks watcher,
      // a computed that mutates reactive state re-triggers itself endlessly in Vue 3
      return this.state.tasks.filter(task => this.isTaskVisible(task));
    },

    /**
     * First visible row index of the virtualization window (issue #9):
     * only rows inside the viewport (plus an overscan of a few rows) are
     * rendered - keeps mounted components constant on large datasets
     *
     * @returns {number}
     */
    renderedFirstIndex() {
      const rowHeight = this.state.options.row.height + this.state.options.chart.grid.horizontal.gap * 2;
      const first = Math.floor(this.state.options.scroll.top / rowHeight) - 5;
      return first < 0 ? 0 : first;
    },

    /**
     * Rows inside the vertical viewport - chart and task list render these
     * instead of all visibleTasks (issue #9). Chart rows are absolutely
     * positioned so the window needs no layout compensation there; the task
     * list uses spacers to keep its scroll height stable.
     *
     * @returns {array}
     */
    renderedTasks() {
      const tasks = this.visibleTasks;
      const rowHeight = this.state.options.row.height + this.state.options.chart.grid.horizontal.gap * 2;
      const last = Math.min(
        tasks.length,
        Math.ceil((this.state.options.scroll.top + this.state.options.rowsHeight) / rowHeight) + 5
      );
      return tasks.slice(this.renderedFirstIndex, last);
    },

    /**
     * Style shortcut
     */
    style() {
      return this.state.dynamicStyle;
    },

    /**
     * Get task list columns; dimensions are calculated in initialize(),
     * a computed must not mutate reactive state or Vue 3 will re-trigger it endlessly
     */
    getTaskListColumns() {
      return this.state.options.taskList.columns;
    },

    /**
     * Tasks used for communicate with parent component
     */
    outputTasks() {
      return this.state.tasks;
    },

    /**
     * Options used to communicate with parent component
     */
    outputOptions() {
      return this.state.options;
    }
  },

  /**
   * Watch tasks after gantt instance is created and react when we have new kids on the block
   */
  created() {
    this.$set = function(obj, key, val) { obj[key] = val; };
    this.$delete = function(obj, key) { delete obj[key]; };
    this.$emitBus = mitt();
    // Vue 3 removed $on - expose a Vue 2 style subscription API backed by the
    // event bus so consumers can register listeners programmatically
    this.$on = (event, handler) => {
      this.$emitBus.on(event, handler);
      return this;
    };
    this.$off = (event, handler) => {
      this.$emitBus.off(event, handler);
      return this;
    };
    this.initializeEvents();
    this.setup();
    this.state.unwatchTasks = this.$watch(
      'tasks',
      tasks => {
        const notEqual = notEqualDeep(tasks, this.outputTasks);
        if (notEqual) {
          this.setup('tasks');
        }
      },
      { deep: true }
    );
    this.state.unwatchOptions = this.$watch(
      'options',
      opts => {
        const notEqual = notEqualDeep(opts, this.outputOptions);
        if (notEqual) {
          this.setup('options');
        }
      },
      { deep: true }
    );
    this.state.unwatchStyle = this.$watch(
      'dynamicStyle',
      style => {
        const notEqual = notEqualDeep(style, this.style);
        if (notEqual) {
          this.initializeStyle();
        }
      },
      { deep: true, immediate: true }
    );

    this.state.unwatchOutputTasks = this.$watch(
      'outputTasks',
      tasks => {
        this.$emit('tasks-changed', tasks.map(task => task));
        this.$emitBus.emit('tasks-changed', tasks.map(task => task));
      },
      { deep: true }
    );
    this.state.unwatchOutputOptions = this.$watch(
      'outputOptions',
      options => {
        this.$emit('options-changed', mergeDeep({}, options));
        this.$emitBus.emit('options-changed', mergeDeep({}, options));
      },
      { deep: true }
    );
    this.state.unwatchOutputStyle = this.$watch(
      'style',
      style => {
        this.$emit('dynamic-style-changed', mergeDeep({}, style));
        this.$emitBus.emit('dynamic-style-changed', mergeDeep({}, style));
      },
      { deep: true }
    );

    // apply geometry when the set of visible tasks (or anything it depends on) changes;
    // this used to be a side effect inside the visibleTasks computed, which loops in Vue 3
    this.state.unwatchVisibleTasksGeometry = this.$watch(
      'visibleTasks',
      visibleTasks => {
        const maxRows = visibleTasks.slice(0, this.state.options.maxRows);
        this.state.options.rowsHeight = this.getTasksHeight(maxRows);
        let heightCompensation = 0;
        if (this.state.options.maxHeight && this.state.options.rowsHeight > this.state.options.maxHeight) {
          heightCompensation = this.state.options.rowsHeight - this.state.options.maxHeight;
          this.state.options.rowsHeight = this.state.options.maxHeight;
        }
        this.state.options.height = this.getHeight(maxRows) - heightCompensation;
        this.state.options.allVisibleTasksHeight = this.getTasksHeight(visibleTasks);
        this.state.options.outerHeight = this.getHeight(maxRows, true) - heightCompensation;
        let len = visibleTasks.length;
        for (let index = 0; index < len; index++) {
          this.calculateTaskGeometry(visibleTasks[index], index);
        }
      },
      { immediate: true }
    );

    this.$emitBus.emit('gantt-elastic-created', this);
    this.$emit('created', this);
    this.$emitBus.emit('created', this);
  },

  /**
   * Emit before-mount event
   */
  beforeMount() {
    this.$emit('before-mount', this);
    this.$emitBus.emit('before-mount', this);
  },

  /**
   * Emit ready/mounted events and deliver this gantt instance to outside world when needed
   */
  mounted() {
    this.state.options.clientWidth = this.$el.clientWidth;
    this.state.resizeObserver = new ResizeObserverImpl(() => {
      this.globalOnResize();
    });
    this.state.resizeObserver.observe(this.$el.parentNode);
    this.globalOnResize();
    // keep the current-time line ticking (issue #7) - single timer, not watcher driven
    this.startNowTimer();
    this.$emit('ready', this);
    this.$emitBus.emit('ready', this);
    this.$emitBus.emit('gantt-elastic-mounted', this);
    this.$emit('mounted', this);
    this.$emitBus.emit('mounted', this);
    this.$emitBus.emit('gantt-elastic-ready', this);
    this.$emit('gantt-elastic-ready', this);
    this.$emitBus.emit('gantt-elastic-ready', this);
  },

  /**
   * Emit event when data was changed and before update (you can cleanup dom events here for example)
   */
  beforeUpdate() {
    this.$emit('before-update');
    this.$emitBus.emit('before-update');
  },

  /**
   * Emit event when gantt-elastic view was updated
   */
  updated() {
    this.$nextTick(() => {
      this.$emit('updated');
      this.$emitBus.emit('updated');
    });
  },

  /**
   * Before destroy event - clean up
   */
  beforeUnmount() {
    if (this.state.nowTimer !== null) {
      clearInterval(this.state.nowTimer);
      this.state.nowTimer = null;
    }
    this.state.resizeObserver.unobserve(this.$el.parentNode);
    this.state.unwatchTasks();
    this.state.unwatchOptions();
    this.state.unwatchStyle();
    this.state.unwatchVisibleTasksGeometry();
    this.state.unwatchOutputTasks();
    this.state.unwatchOutputOptions();
    this.state.unwatchOutputStyle();
    this.$emit('before-destroy');
    this.$emitBus.emit('before-destroy');
  },

  /**
   * Emit event after gantt-elastic was destroyed
   */
  unmounted() {
    this.$emit('destroyed');
    this.$emitBus.emit('destroyed');
  }
};
/* harmony default export */ const GanttElasticvue_type_script_lang_js = (GanttElastic);

;// ./src/GanttElastic.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/GanttElastic.vue?vue&type=style&index=0&id=372aea41&lang=css
var GanttElasticvue_type_style_index_0_id_372aea41_lang_css = __webpack_require__(292);
;// ./src/GanttElastic.vue?vue&type=style&index=0&id=372aea41&lang=css

;// ./src/GanttElastic.vue




;


const GanttElastic_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(GanttElasticvue_type_script_lang_js, [['render',render]])

/* harmony default export */ const src_GanttElastic = (GanttElastic_exports_);
})();

module.exports.GanttElastic = __webpack_exports__["default"];
/******/ })()
;
//# sourceMappingURL=GanttElastic.common.js.map