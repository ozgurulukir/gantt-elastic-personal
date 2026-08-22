(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("Vue"));
	else if(typeof define === 'function' && define.amd)
		define(["Vue"], factory);
	else if(typeof exports === 'object')
		exports["GanttElastic"] = factory(require("Vue"));
	else
		root["GanttElastic"] = factory(root["Vue"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__508__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 401
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
`, "",{"version":3,"sources":["webpack://./src/GanttElastic.vue"],"names":[],"mappings":";AAikDA;;EAEE,sBAAsB;AACxB;AACA;EACE,cAAc;AAChB;AACA;;EAEE,eAAe;EACf,eAAe;AACjB;AACA;EACE,WAAW;AACb;AACA;EACE,cAAc;AAChB;AACA;;EAEE,gBAAgB;EAChB,eAAe;AACjB;AACA;EACE,iCAAiC;AACnC;AACA;EACE,kCAAkC;AACpC;AACA;EACE,4BAA4B;AAC9B;AACA;EACE,kBAAkB;EAClB,4BAA4B;AAC9B;AACA;EACE,kBAAkB;AACpB","sourcesContent":["<!--\n/**\n * @fileoverview GanttElastic component\n * @license MIT\n * @author Rafal Pospiech <neuronet.io@gmail.com>\n * @package GanttElastic\n */\n-->\n<template>\n  <div class=\"gantt-elastic\" style=\"width:100%\">\n    <slot name=\"header\"></slot>\n    <main-view ref=\"mainView\"></main-view>\n    <slot name=\"footer\"></slot>\n  </div>\n</template>\n\n<script>\nimport VueInstance from 'vue';\nimport dayjs from 'dayjs';\nimport mitt from 'mitt';\nimport MainView from './components/MainView.vue';\nimport getStyle from './style.js';\nimport ResizeObserver from 'resize-observer-polyfill';\n\nconst ctx = document.createElement('canvas').getContext('2d');\nlet VueInst = VueInstance;\nfunction initVue() {\n  if (typeof Vue !== 'undefined' && typeof VueInst === 'undefined') {\n    VueInst = Vue;\n  }\n}\ninitVue();\n\nlet hourWidthCache = null;\n\n/**\n * Helper function to fill out empty options in user settings\n *\n * @param {object} userOptions - initial user options that will merge with those below\n * @returns {object} merged options\n */\nfunction getOptions(userOptions) {\n  let localeName = 'en';\n  if (typeof userOptions.locale !== 'undefined' && typeof userOptions.locale.name !== 'undefined') {\n    localeName = userOptions.locale.name;\n  }\n  return {\n    slots: {\n      header: {}\n    },\n    taskMapping: {\n      //*\n      id: 'id',\n      start: 'start',\n      label: 'label',\n      duration: 'duration',\n      progress: 'progress',\n      type: 'type',\n      style: 'style',\n      collapsed: 'collapsed'\n    },\n    width: 0,\n    height: 0,\n    clientWidth: 0,\n    outerHeight: 0,\n    rowsHeight: 0,\n    allVisibleTasksHeight: 0,\n    scroll: {\n      scrolling: false,\n      dragXMoveMultiplier: 3, //*\n      dragYMoveMultiplier: 2, //*\n      top: 0,\n      taskList: {\n        left: 0,\n        right: 0,\n        top: 0,\n        bottom: 0\n      },\n      chart: {\n        left: 0,\n        right: 0,\n        percent: 0,\n        timePercent: 0,\n        top: 0,\n        bottom: 0,\n        time: 0,\n        timeCenter: 0,\n        dateTime: {\n          left: '',\n          right: ''\n        }\n      }\n    },\n    scope: {\n      //*\n      before: 1,\n      after: 1\n    },\n    times: {\n      timeScale: 60 * 1000,\n      timeZoom: 17, //*\n      timePerPixel: 0,\n      firstTime: null,\n      lastTime: null,\n      firstTaskTime: 0,\n      lastTaskTime: 0,\n      totalViewDurationMs: 0,\n      totalViewDurationPx: 0,\n      stepDuration: 'day',\n      steps: []\n    },\n    row: {\n      height: 24 //*\n    },\n    maxRows: 20, //*\n    maxHeight: 0, //*\n    chart: {\n      grid: {\n        horizontal: {\n          gap: 6 //*\n        }\n      },\n      progress: {\n        width: 20, //*\n        height: 6, //*\n        pattern: true,\n        bar: false\n      },\n      text: {\n        offset: 4, //*\n        xPadding: 10, //*\n        display: true //*\n      },\n      expander: {\n        type: 'chart',\n        display: false, //*\n        displayIfTaskListHidden: true, //*\n        offset: 4, //*\n        size: 18\n      }\n    },\n    taskList: {\n      display: true, //*\n      resizeAfterThreshold: true, //*\n      widthThreshold: 75, //*\n      columns: [\n        //*\n        {\n          id: 0,\n          label: 'ID',\n          value: 'id',\n          width: 40\n        }\n      ],\n      percent: 100, //*\n      width: 0,\n      finalWidth: 0,\n      widthFromPercentage: 0,\n      minWidth: 18,\n      expander: {\n        type: 'task-list',\n        size: 16,\n        columnWidth: 24,\n        padding: 16,\n        margin: 10,\n        straight: false\n      }\n    },\n    calendar: {\n      workingDays: [1, 2, 3, 4, 5], //*\n      gap: 6, //*\n      height: 0,\n      strokeWidth: 1,\n      hour: {\n        height: 20, //*\n        display: true, //*\n        widths: [],\n        maxWidths: { short: 0, medium: 0, long: 0 },\n        formatted: {\n          long: [],\n          medium: [],\n          short: []\n        },\n        format: {\n          //*\n          long(date) {\n            return date.format('HH:mm');\n          },\n          medium(date) {\n            return date.format('HH:mm');\n          },\n          short(date) {\n            return date.format('HH');\n          }\n        }\n      },\n      day: {\n        height: 20, //*\n        display: true, //*\n        widths: [],\n        maxWidths: { short: 0, medium: 0, long: 0 },\n        format: {\n          long(date) {\n            return date.format('DD dddd');\n          },\n          medium(date) {\n            return date.format('DD ddd');\n          },\n          short(date) {\n            return date.format('DD');\n          }\n        }\n      },\n      month: {\n        height: 20, //*\n        display: true, //*\n        widths: [],\n        maxWidths: { short: 0, medium: 0, long: 0 },\n        format: {\n          //*\n          short(date) {\n            return date.format('MM');\n          },\n          medium(date) {\n            return date.format(\"MMM 'YY\");\n          },\n          long(date) {\n            return date.format('MMMM YYYY');\n          }\n        }\n      }\n    },\n    locale: {\n      //*\n      name: 'en',\n      weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),\n      weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),\n      weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),\n      months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),\n      monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),\n      weekStart: 1,\n      relativeTime: {\n        future: 'in %s',\n        past: '%s ago',\n        s: 'a few seconds',\n        m: 'a minute',\n        mm: '%d minutes',\n        h: 'an hour',\n        hh: '%d hours',\n        d: 'a day',\n        dd: '%d days',\n        M: 'a month',\n        MM: '%d months',\n        y: 'a year',\n        yy: '%d years'\n      },\n      formats: {\n        LT: 'HH:mm',\n        LTS: 'HH:mm:ss',\n        L: 'DD/MM/YYYY',\n        LL: 'D MMMM YYYY',\n        LLL: 'D MMMM YYYY HH:mm',\n        LLLL: 'dddd, D MMMM YYYY HH:mm'\n      },\n      ordinal: n => {\n        const s = ['th', 'st', 'nd', 'rd'];\n        const v = n % 100;\n        return `[${n}${s[(v - 20) % 10] || s[v] || s[0]}]`;\n      }\n    }\n  };\n}\n\n/**\n * Prepare style\n *\n * @returns {object}\n */\nfunction prepareStyle(userStyle) {\n  let fontSize = '12px';\n  let fontFamily = window\n    .getComputedStyle(document.body)\n    .getPropertyValue('font-family')\n    .toString();\n  if (typeof userStyle !== 'undefined') {\n    if (typeof userStyle.fontSize !== 'undefined') {\n      fontSize = userStyle.fontSize;\n    }\n    if (typeof userStyle.fontFamily !== 'undefined') {\n      fontFamily = userStyle.fontFamily;\n    }\n  }\n  return getStyle(fontSize, fontFamily);\n}\n\n/**\n * Helper function to determine if specified variable is an object\n *\n * @param {any} item\n *\n * @returns {boolean}\n */\nfunction isObject(item) {\n  return (\n    item &&\n    typeof item === 'object' &&\n    !Array.isArray(item) &&\n    !(item instanceof HTMLElement) &&\n    !(item instanceof CanvasRenderingContext2D) &&\n    typeof item !== 'function'\n  );\n}\n\n/**\n * Helper function which will merge objects recursively - creating brand new one - like clone\n *\n * @param {object} target\n * @params {object} sources\n *\n * @returns {object}\n */\nexport function mergeDeep(target, ...sources) {\n  if (!sources.length) {\n    return target;\n  }\n  const source = sources.shift();\n  if (isObject(target) && isObject(source)) {\n    for (const key in source) {\n      if (isObject(source[key])) {\n        if (typeof target[key] === 'undefined') {\n          target[key] = {};\n        }\n        target[key] = mergeDeep(target[key], source[key]);\n      } else if (Array.isArray(source[key])) {\n        target[key] = [];\n        for (let item of source[key]) {\n          if (isObject(item)) {\n            target[key].push(mergeDeep({}, item));\n            continue;\n          }\n          target[key].push(item);\n        }\n      } else {\n        target[key] = source[key];\n      }\n    }\n  }\n  return mergeDeep(target, ...sources);\n}\n\n/**\n * Detect if object or array is observable\n *\n * @param {object|array} obj\n *\n * @returns {boolean}\n */\nfunction isObservable(obj) {\n  return typeof obj === 'object' && obj.hasOwnProperty('__ob__');\n}\n\n/**\n * Same as above but with reactivity in mind\n *\n * @param {object} target\n * @params {object} sources\n *\n * @returns {object}\n */\nexport function mergeDeepReactive(component, target, ...sources) {\n  if (!sources.length) {\n    return target;\n  }\n  const source = sources.shift();\n  if (isObject(target) && isObject(source)) {\n    for (const key in source) {\n      if (isObject(source[key])) {\n        if (typeof target[key] === 'undefined') {\n          component.$set(target, key, {});\n        }\n        mergeDeepReactive(component, target[key], source[key]);\n      } else if (Array.isArray(source[key])) {\n        component.$set(target, key, source[key]);\n      } else if (typeof source[key] === 'function') {\n        if (source[key].toString().indexOf('[native code]') === -1) {\n          target[key] = source[key];\n        }\n      } else {\n        component.$set(target, key, source[key]);\n      }\n    }\n  }\n  return mergeDeepReactive(component, target, ...sources);\n}\n/**\n * Check if objects or arrays are equal by comparing nested values\n *\n * @param {object|array} left\n * @param {object|array} right\n *\n * @returns {boolean}\n */\nexport function notEqualDeep(left, right, cache = [], path = '') {\n  if (typeof right !== typeof left) {\n    return { left, right, what: path + '.typeof' };\n  } else if (Array.isArray(left) && !Array.isArray(right)) {\n    return { left, right, what: path + '.isArray' };\n  } else if (Array.isArray(right) && !Array.isArray(left)) {\n    return { left, right, what: path + '.isArray' };\n  } else if (Array.isArray(left) && Array.isArray(right)) {\n    if (left.length !== right.length) {\n      return { left, right, what: path + '.length' };\n    }\n    let what;\n    for (let index = 0, len = left.length; index < len; index++) {\n      if ((what = notEqualDeep(left[index], right[index], cache, path + '.' + index))) {\n        return what;\n      }\n    }\n  } else if (isObject(left) && !isObject(right)) {\n    return { left, right, what: path + '.isObject' };\n  } else if (isObject(right) && !isObject(left)) {\n    return { left, right, what: path + '.isObject' };\n  } else if (isObject(left) && isObject(right)) {\n    for (let key in left) {\n      if (!left.hasOwnProperty(key) || !left.propertyIsEnumerable(key)) {\n        continue;\n      }\n      if (!right.hasOwnProperty(key)) {\n        return { left, right, what: path + '.' + key };\n      }\n      let what;\n      if ((what = notEqualDeep(left[key], right[key], cache, path + '.' + key))) {\n        return what;\n      }\n    }\n  } else if (left !== right) {\n    return { left, right, what: path + '. !==' };\n  }\n  return false;\n}\n\n/**\n * GanttElastic\n * Main vue component\n */\nconst GanttElastic = {\n  name: 'GanttElastic',\n  components: {\n    MainView\n  },\n  props: ['tasks', 'options', 'dynamicStyle'],\n  provide() {\n    const provider = {};\n    const self = this;\n    Object.defineProperty(provider, 'root', {\n      enumerable: true,\n      get: () => self\n    });\n    return provider;\n  },\n  data() {\n    return {\n      state: {\n        tasks: [],\n        options: {\n          scrollBarHeight: 0,\n          allVisibleTasksHeight: 0,\n          outerHeight: 0,\n          scroll: {\n            left: 0,\n            top: 0\n          }\n        },\n        dynamicStyle: {},\n        refs: {},\n        tasksById: {},\n        taskTree: {},\n        ctx,\n        emitTasksChanges: true, // some operations may pause emitting changes to parent component\n        emitOptionsChanges: true, // some operations may pause emitting changes to parent component\n        resizeObserver: null,\n        unwatchTasks: null,\n        unwatchOptions: null,\n        unwatchStyle: null,\n        unwatchOutputTasks: null,\n        unwatchOutputOptions: null,\n        unwatchOutputStyle: null\n      }\n    };\n  },\n  methods: {\n    mergeDeep,\n    mergeDeepReactive,\n\n    /**\n     * Calculate height of scrollbar in current browser\n     *\n     * @returns {number}\n     */\n    getScrollBarHeight() {\n      const outer = document.createElement('div');\n      outer.style.visibility = 'hidden';\n      outer.style.height = '100px';\n      outer.style.msOverflowStyle = 'scrollbar';\n      document.body.appendChild(outer);\n      var noScroll = outer.offsetHeight;\n      outer.style.overflow = 'scroll';\n      var inner = document.createElement('div');\n      inner.style.height = '100%';\n      outer.appendChild(inner);\n      var withScroll = inner.offsetHeight;\n      outer.parentNode.removeChild(outer);\n      const height = noScroll - withScroll;\n      this.style['chart-scroll-container--vertical']['margin-left'] = `-${height}px`;\n      return (this.state.options.scrollBarHeight = height);\n    },\n\n    /**\n     * Fill out empty task properties and make it reactive\n     *\n     * @param {array} tasks\n     */\n    fillTasks(tasks) {\n      for (let task of tasks) {\n        if (typeof task.x === 'undefined') {\n          task.x = 0;\n        }\n        if (typeof task.y === 'undefined') {\n          task.y = 0;\n        }\n        if (typeof task.width === 'undefined') {\n          task.width = 0;\n        }\n        if (typeof task.height === 'undefined') {\n          task.height = 0;\n        }\n        if (typeof task.mouseOver === 'undefined') {\n          task.mouseOver = false;\n        }\n        if (typeof task.collapsed === 'undefined') {\n          task.collapsed = false;\n        }\n        if (typeof task.dependentOn === 'undefined') {\n          task.dependentOn = [];\n        }\n        if (typeof task.parentId === 'undefined') {\n          task.parentId = null;\n        }\n        if (typeof task.style === 'undefined') {\n          task.style = {};\n        }\n        if (typeof task.children === 'undefined') {\n          task.children = [];\n        }\n        if (typeof task.allChildren === 'undefined') {\n          task.allChildren = [];\n        }\n        if (typeof task.parents === 'undefined') {\n          task.parents = [];\n        }\n        if (typeof task.parent === 'undefined') {\n          task.parent = null;\n        }\n        if (typeof task.startTime === 'undefined') {\n          task.startTime = dayjs(task.start).valueOf();\n        }\n        if (typeof task.endTime === 'undefined' && task.hasOwnProperty('end')) {\n          task.endTime = dayjs(task.end).valueOf();\n        } else if (typeof task.endTime === 'undefined' && task.hasOwnProperty('duration')) {\n          task.endTime = task.startTime + task.duration;\n        }\n        if (typeof task.duration === 'undefined' && task.hasOwnProperty('endTime')) {\n          task.duration = task.endTime - task.startTime;\n        }\n      }\n      return tasks;\n    },\n\n    /**\n     * Map tasks\n     *\n     * @param {Array} tasks\n     * @param {Object} options\n     */\n    mapTasks(tasks, options) {\n      for (let [index, task] of tasks.entries()) {\n        tasks[index] = {\n          ...task,\n          id: task[options.taskMapping.id],\n          start: task[options.taskMapping.start],\n          label: task[options.taskMapping.label],\n          duration: task[options.taskMapping.duration],\n          progress: task[options.taskMapping.progress],\n          type: task[options.taskMapping.type],\n          style: task[options.taskMapping.style],\n          collapsed: task[options.taskMapping.collapsed]\n        };\n      }\n      return tasks;\n    },\n\n    /**\n     * Initialize component\n     */\n    initialize(itsUpdate = '') {\n      let options = mergeDeep({}, this.state.options, getOptions(this.options), this.options);\n      let tasks = this.mapTasks(this.tasks, options);\n      if (Object.keys(this.state.dynamicStyle).length === 0) {\n        this.initializeStyle();\n      }\n      dayjs.locale(options.locale, null, true);\n      dayjs.locale(options.locale.name);\n      if (typeof options.taskList === 'undefined') {\n        options.taskList = {};\n      }\n      options.taskList.columns = options.taskList.columns.map((column, index) => {\n        column.thresholdPercent = 100;\n        column.widthFromPercentage = 0;\n        column.finalWidth = 0;\n        if (typeof column.height === 'undefined') {\n          column.height = 0;\n        }\n        if (typeof column.style === 'undefined') {\n          column.style = {};\n        }\n        column._id = `${index}-${column.label}`;\n        return column;\n      });\n      this.state.options = options;\n      tasks = this.fillTasks(tasks);\n      this.state.tasksById = this.resetTaskTree(tasks);\n      this.state.taskTree = this.makeTaskTree(this.state.rootTask, tasks);\n      this.state.tasks = this.state.taskTree.allChildren.map(childId => this.getTask(childId));\n      this.calculateTaskListColumnsDimensions();\n      this.state.options.scrollBarHeight = this.getScrollBarHeight();\n      this.state.options.outerHeight = this.state.options.height + this.state.options.scrollBarHeight;\n      this.globalOnResize();\n    },\n\n    /**\n     * Initialize style\n     */\n    initializeStyle() {\n      this.state.dynamicStyle = mergeDeep({}, prepareStyle(this.dynamicStyle), this.dynamicStyle);\n    },\n\n    /**\n     * Get calendar rows outer height\n     *\n     * @returns {int}\n     */\n    getCalendarHeight() {\n      return this.state.options.calendar.height + this.state.options.calendar.strokeWidth;\n    },\n\n    /**\n     * Get maximal level of nested task children\n     *\n     * @returns {int}\n     */\n    getMaximalLevel() {\n      let maximalLevel = 0;\n      this.state.tasks.forEach(task => {\n        if (task.parents.length > maximalLevel) {\n          maximalLevel = task.parents.length;\n        }\n      });\n      return maximalLevel - 1;\n    },\n\n    /**\n     * Get maximal expander width - to calculate straight task list text\n     *\n     * @returns {int}\n     */\n    getMaximalExpanderWidth() {\n      return (\n        this.getMaximalLevel() * this.state.options.taskList.expander.padding +\n        this.state.options.taskList.expander.margin\n      );\n    },\n\n    /**\n     * Synchronize scrollTop property when row height is changed\n     */\n    syncScrollTop() {\n      if (\n        this.state.refs.taskListItems &&\n        this.state.refs.chartGraph.scrollTop !== this.state.refs.taskListItems.scrollTop\n      ) {\n        this.state.options.scroll.top = this.state.refs.taskListItems.scrollTop = this.state.refs.chartScrollContainerVertical.scrollTop = this.state.refs.chartGraph.scrollTop;\n      }\n    },\n\n    /**\n     * Calculate task list columns dimensions\n     */\n    calculateTaskListColumnsDimensions() {\n      let final = 0;\n      let percentage = 0;\n      for (let column of this.state.options.taskList.columns) {\n        if (column.expander) {\n          column.widthFromPercentage =\n            ((this.getMaximalExpanderWidth() + column.width) / 100) * this.state.options.taskList.percent;\n        } else {\n          column.widthFromPercentage = (column.width / 100) * this.state.options.taskList.percent;\n        }\n        percentage += column.widthFromPercentage;\n        column.finalWidth = (column.thresholdPercent * column.widthFromPercentage) / 100;\n        final += column.finalWidth;\n        column.height = this.getTaskHeight() - this.style['grid-line-horizontal']['stroke-width'];\n      }\n      this.state.options.taskList.widthFromPercentage = percentage;\n      this.state.options.taskList.finalWidth = final;\n    },\n\n    /**\n     * Reset task tree - which is used to create tree like structure inside task list\n     */\n    resetTaskTree(tasks) {\n      this.$set(this.state, 'rootTask', {\n        id: null,\n        label: 'root',\n        children: [],\n        allChildren: [],\n        parents: [],\n        parent: null,\n        __root: true\n      });\n      const tasksById = {};\n      for (let i = 0, len = tasks.length; i < len; i++) {\n        let current = tasks[i];\n        current.children = [];\n        current.allChildren = [];\n        current.parent = null;\n        current.parents = [];\n        tasksById[current.id] = current;\n      }\n      return tasksById;\n    },\n\n    /**\n     * Make task tree, after reset - look above\n     *\n     * @param {object} task\n     * @returns {object} tasks with children and parents\n     */\n    makeTaskTree(task, tasks) {\n      for (let i = 0, len = tasks.length; i < len; i++) {\n        let current = tasks[i];\n        if (current.parentId === task.id) {\n          if (task.parents.length) {\n            task.parents.forEach(parent => current.parents.push(parent));\n          }\n          if (!task.propertyIsEnumerable('__root')) {\n            current.parents.push(task.id);\n            current.parent = task.id;\n          } else {\n            current.parents = [];\n            current.parent = null;\n          }\n          current = this.makeTaskTree(current, tasks);\n          task.allChildren.push(current.id);\n          task.children.push(current.id);\n          current.allChildren.forEach(childId => task.allChildren.push(childId));\n        }\n      }\n      return task;\n    },\n\n    /**\n     * Get task by id\n     *\n     * @param {any} taskId\n     * @returns {object|null} task\n     */\n    getTask(taskId) {\n      if (typeof this.state.tasksById[taskId] !== 'undefined') {\n        return this.state.tasksById[taskId];\n      }\n      return null;\n    },\n\n    /**\n     * Get children tasks for specified taskId\n     *\n     * @param {any} taskId\n     * @returns {array} children\n     */\n    getChildren(taskId) {\n      return this.state.tasks.filter(task => task.parent === taskId);\n    },\n\n    /**\n     * Is task visible\n     *\n     * @param {Number|String|Task} task\n     */\n    isTaskVisible(task) {\n      if (typeof task === 'number' || typeof task === 'string') {\n        task = this.getTask(task);\n      }\n      for (let i = 0, len = task.parents.length; i < len; i++) {\n        if (this.getTask(task.parents[i]).collapsed) {\n          return false;\n        }\n      }\n      return true;\n    },\n\n    /**\n     * Get svg\n     *\n     * @returns {string} html svg image of gantt\n     */\n    getSVG() {\n      return this.state.options.mainView.outerHTML;\n    },\n\n    /**\n     * Get image\n     *\n     * @param {string} type image format\n     * @returns {Promise} when resolved returns base64 image string of gantt\n     */\n    getImage(type = 'image/png') {\n      return new Promise(resolve => {\n        const img = new Image();\n        img.onload = () => {\n          const canvas = document.createElement('canvas');\n          canvas.width = this.state.options.mainView.clientWidth;\n          canvas.height = this.state.options.rowsHeight;\n          canvas.getContext('2d').drawImage(img, 0, 0);\n          resolve(canvas.toDataURL(type));\n        };\n        img.src = 'data:image/svg+xml,' + encodeURIComponent(this.getSVG());\n      });\n    },\n\n    /**\n     * Get gantt total height\n     *\n     * @returns {number}\n     */\n    getHeight(visibleTasks, outer = false) {\n      let height =\n        visibleTasks.length * (this.state.options.row.height + this.state.options.chart.grid.horizontal.gap * 2) +\n        this.state.options.calendar.height +\n        this.state.options.calendar.strokeWidth +\n        this.state.options.calendar.gap;\n      if (outer) {\n        height += this.state.options.scrollBarHeight;\n      }\n      return height;\n    },\n\n    /**\n     * Get one task height\n     *\n     * @returns {number}\n     */\n    getTaskHeight(withStroke = false) {\n      if (withStroke) {\n        return (\n          this.state.options.row.height +\n          this.state.options.chart.grid.horizontal.gap * 2 +\n          this.style['grid-line-horizontal']['stroke-width']\n        );\n      }\n      return this.state.options.row.height + this.state.options.chart.grid.horizontal.gap * 2;\n    },\n\n    /**\n     * Get specified tasks height\n     *\n     * @returns {number}\n     */\n    getTasksHeight(visibleTasks) {\n      return visibleTasks.length * this.getTaskHeight();\n    },\n\n    /**\n     * Convert time (in milliseconds) to pixel offset inside chart\n     *\n     * @param {int} ms\n     * @returns {number}\n     */\n    timeToPixelOffsetX(ms) {\n      let x = ms - this.state.options.times.firstTime;\n      if (x) {\n        x = x / this.state.options.times.timePerPixel;\n      }\n      return x;\n    },\n\n    /**\n     * Convert pixel offset inside chart to corresponding time offset in milliseconds\n     *\n     * @param {number} pixelOffsetX\n     * @returns {int} milliseconds\n     */\n    pixelOffsetXToTime(pixelOffsetX) {\n      let offset = pixelOffsetX + this.style['grid-line-vertical']['stroke-width'] / 2;\n      return offset * this.state.options.times.timePerPixel + this.state.options.times.firstTime;\n    },\n\n    /**\n     * Determine if element is inside current view port\n     *\n     * @param {number} x - element placement\n     * @param {number} width - element width\n     * @param {int} buffer - or threshold, if element is outside viewport but offset from view port is below this value return true\n     * @returns {boolean}\n     */\n    isInsideViewPort(x, width, buffer = 5000) {\n      return (\n        (x + width + buffer >= this.state.options.scroll.chart.left &&\n          x - buffer <= this.state.options.scroll.chart.right) ||\n        (x - buffer <= this.state.options.scroll.chart.left &&\n          x + width + buffer >= this.state.options.scroll.chart.right)\n      );\n    },\n\n    /**\n     * Chart scroll event handler\n     *\n     * @param {event} ev\n     */\n    onScrollChart(ev) {\n      this._onScrollChart(\n        this.state.refs.chartScrollContainerHorizontal.scrollLeft,\n        this.state.refs.chartScrollContainerVertical.scrollTop\n      );\n    },\n\n    /**\n     * After same as above but with different arguments - normalized\n     *\n     * @param {number} left\n     * @param {number} top\n     */\n    _onScrollChart(left, top) {\n      if (this.state.options.scroll.chart.left === left && this.state.options.scroll.chart.top === top) {\n        return;\n      }\n      const chartContainerWidth = this.state.refs.chartContainer.clientWidth;\n      this.state.options.scroll.chart.left = left;\n      this.state.options.scroll.chart.right = left + chartContainerWidth;\n      this.state.options.scroll.chart.percent = (left / this.state.options.times.totalViewDurationPx) * 100;\n      this.state.options.scroll.chart.top = top;\n      this.state.options.scroll.chart.time = this.pixelOffsetXToTime(left);\n      this.state.options.scroll.chart.timeCenter = this.pixelOffsetXToTime(left + chartContainerWidth / 2);\n      this.state.options.scroll.chart.dateTime.left = dayjs(this.state.options.scroll.chart.time).valueOf();\n      this.state.options.scroll.chart.dateTime.right = dayjs(\n        this.pixelOffsetXToTime(left + this.state.refs.chart.clientWidth)\n      ).valueOf();\n      this.scrollTo(left, top);\n    },\n\n    /**\n     * Scroll current chart to specified time (in milliseconds)\n     *\n     * @param {int} time\n     */\n    scrollToTime(time) {\n      let pos = this.timeToPixelOffsetX(time);\n      const chartContainerWidth = this.state.refs.chartContainer.clientWidth;\n      pos = pos - chartContainerWidth / 2;\n      if (pos > this.state.options.width) {\n        pos = this.state.options.width - chartContainerWidth;\n      }\n      this.scrollTo(pos);\n    },\n\n    /**\n     * Scroll chart or task list to specified pixel values\n     *\n     * @param {number|null} left\n     * @param {number|null} top\n     */\n    scrollTo(left = null, top = null) {\n      if (left !== null) {\n        this.state.refs.chartCalendarContainer.scrollLeft = left;\n        this.state.refs.chartGraphContainer.scrollLeft = left;\n        this.state.refs.chartScrollContainerHorizontal.scrollLeft = left;\n        this.state.options.scroll.left = left;\n      }\n      if (top !== null) {\n        this.state.refs.chartScrollContainerVertical.scrollTop = top;\n        this.state.refs.chartGraph.scrollTop = top;\n        this.state.refs.taskListItems.scrollTop = top;\n        this.state.options.scroll.top = top;\n        this.syncScrollTop();\n      }\n    },\n\n    /**\n     * After some actions like time zoom change we need to recompensate scroll position\n     * so as a result everything will be in same place\n     */\n    fixScrollPos() {\n      this.scrollToTime(this.state.options.scroll.chart.timeCenter);\n    },\n\n    /**\n     * Mouse wheel event handler\n     */\n    onWheelChart(ev) {\n      if (!ev.shiftKey && ev.deltaX === 0) {\n        let top = this.state.options.scroll.top + ev.deltaY;\n        const chartClientHeight = this.state.options.rowsHeight;\n        const scrollHeight = this.state.refs.chartGraph.scrollHeight - chartClientHeight;\n        if (top < 0) {\n          top = 0;\n        } else if (top > scrollHeight) {\n          top = scrollHeight;\n        }\n        this.scrollTo(null, top);\n      } else if (ev.shiftKey && ev.deltaX === 0) {\n        let left = this.state.options.scroll.left + ev.deltaY;\n        const chartClientWidth = this.state.refs.chartScrollContainerHorizontal.clientWidth;\n        const scrollWidth = this.state.refs.chartScrollContainerHorizontal.scrollWidth - chartClientWidth;\n        if (left < 0) {\n          left = 0;\n        } else if (left > scrollWidth) {\n          left = scrollWidth;\n        }\n        this.scrollTo(left);\n      } else {\n        let left = this.state.options.scroll.left + ev.deltaX;\n        const chartClientWidth = this.state.refs.chartScrollContainerHorizontal.clientWidth;\n        const scrollWidth = this.state.refs.chartScrollContainerHorizontal.scrollWidth - chartClientWidth;\n        if (left < 0) {\n          left = 0;\n        } else if (left > scrollWidth) {\n          left = scrollWidth;\n        }\n        this.scrollTo(left);\n      }\n    },\n\n    /**\n     * Time zoom change event handler\n     */\n    onTimeZoomChange(timeZoom) {\n      this.state.options.times.timeZoom = timeZoom;\n      this.recalculateTimes();\n      this.calculateSteps();\n      this.fixScrollPos();\n    },\n\n    /**\n     * Row height change event handler\n     */\n    onRowHeightChange(height) {\n      this.state.options.row.height = height;\n      this.calculateTaskListColumnsDimensions();\n      this.syncScrollTop();\n    },\n\n    /**\n     * Scope change event handler\n     */\n    onScopeChange(value) {\n      this.state.options.scope.before = value;\n      this.state.options.scope.after = value;\n      this.initTimes();\n      this.calculateSteps();\n      this.computeCalendarWidths();\n      this.fixScrollPos();\n    },\n\n    /**\n     * Task list width change event handler\n     */\n    onTaskListWidthChange(value) {\n      this.state.options.taskList.percent = value;\n      this.calculateTaskListColumnsDimensions();\n      this.fixScrollPos();\n    },\n\n    /**\n     * Task list column width change event handler\n     */\n    onTaskListColumnWidthChange() {\n      this.calculateTaskListColumnsDimensions();\n      this.fixScrollPos();\n    },\n\n    /**\n     * Listen to specified event names\n     */\n    initializeEvents() {\n      this.$emitBus.on('chart-scroll-horizontal', this.onScrollChart);\n      this.$emitBus.on('chart-scroll-vertical', this.onScrollChart);\n      this.$emitBus.on('chart-wheel', this.onWheelChart);\n      this.$emitBus.on('times-timeZoom-change', this.onTimeZoomChange);\n      this.$emitBus.on('row-height-change', this.onRowHeightChange);\n      this.$emitBus.on('scope-change', this.onScopeChange);\n      this.$emitBus.on('taskList-width-change', this.onTaskListWidthChange);\n      this.$emitBus.on('taskList-column-width-change', this.onTaskListColumnWidthChange);\n    },\n\n    /**\n     * When some action was performed (scale change for example) - recalculate time variables\n     */\n    recalculateTimes() {\n      let max = this.state.options.times.timeScale * 60;\n      let min = this.state.options.times.timeScale;\n      let steps = max / min;\n      let percent = this.state.options.times.timeZoom / 100;\n      this.state.options.times.timePerPixel =\n        this.state.options.times.timeScale * steps * percent + Math.pow(2, this.state.options.times.timeZoom);\n      this.state.options.times.totalViewDurationMs = dayjs(this.state.options.times.lastTime).diff(\n        this.state.options.times.firstTime,\n        'milliseconds'\n      );\n      this.state.options.times.totalViewDurationPx =\n        this.state.options.times.totalViewDurationMs / this.state.options.times.timePerPixel;\n      this.state.options.width =\n        this.state.options.times.totalViewDurationPx + this.style['grid-line-vertical']['stroke-width'];\n    },\n\n    /**\n     * Initialize time variables\n     */\n    initTimes() {\n      this.state.options.times.firstTime = dayjs(this.state.options.times.firstTaskTime)\n        .locale(this.state.options.locale.name)\n        .startOf('day')\n        .subtract(this.state.options.scope.before, 'days')\n        .startOf('day')\n        .valueOf();\n      this.state.options.times.lastTime = dayjs(this.state.options.times.lastTaskTime)\n        .locale(this.state.options.locale.name)\n        .endOf('day')\n        .add(this.state.options.scope.after, 'days')\n        .endOf('day')\n        .valueOf();\n      this.recalculateTimes();\n    },\n\n    /**\n     * Calculate steps\n     * Steps are days by default\n     * Each step contain information about time offset and pixel offset of this time inside gantt chart\n     */\n    calculateSteps() {\n      const steps = [];\n      const lastMs = dayjs(this.state.options.times.lastTime).valueOf();\n      const currentDate = dayjs(this.state.options.times.firstTime);\n      steps.push({\n        time: currentDate.valueOf(),\n        offset: {\n          ms: 0,\n          px: 0\n        }\n      });\n      for (\n        let currentDate = dayjs(this.state.options.times.firstTime)\n          .add(1, this.state.options.times.stepDuration)\n          .startOf('day');\n        currentDate.valueOf() <= lastMs;\n        currentDate = currentDate.add(1, this.state.options.times.stepDuration).startOf('day')\n      ) {\n        const offsetMs = currentDate.diff(this.state.options.times.firstTime, 'milliseconds');\n        const offsetPx = offsetMs / this.state.options.times.timePerPixel;\n        const step = {\n          time: currentDate.valueOf(),\n          offset: {\n            ms: offsetMs,\n            px: offsetPx\n          }\n        };\n        const previousStep = steps[steps.length - 1];\n        previousStep.width = {\n          ms: offsetMs - previousStep.offset.ms,\n          px: offsetPx - previousStep.offset.px\n        };\n        steps.push(step);\n      }\n      const lastStep = steps[steps.length - 1];\n      lastStep.width = {\n        ms: this.state.options.times.totalViewDurationMs - lastStep.offset.ms,\n        px: this.state.options.times.totalViewDurationPx - lastStep.offset.px\n      };\n      this.state.options.times.steps = steps;\n    },\n\n    /**\n     * Calculate calendar widths - when scale was changed for example\n     */\n    computeCalendarWidths() {\n      this.computeDayWidths();\n      this.computeHourWidths();\n      this.computeMonthWidths();\n    },\n\n    /**\n     * Compute width of calendar hours column widths basing on text widths\n     */\n    computeHourWidths() {\n      const style = { ...this.style['calendar-row-text'], ...this.style['calendar-row-text--hour'] };\n      this.state.ctx.font = style['font-size'] + ' ' + style['font-family'];\n      const localeName = this.state.options.locale.name;\n      let currentDate = dayjs('2018-01-01T00:00:00').locale(localeName); // any date will be good for hours\n      let maxWidths = this.state.options.calendar.hour.maxWidths;\n      if (maxWidths.length) {\n        return;\n      }\n      for (let formatName in this.state.options.calendar.hour.format) {\n        maxWidths[formatName] = 0;\n      }\n      for (let hour = 0; hour < 24; hour++) {\n        let widths = { hour };\n        for (let formatName in this.state.options.calendar.hour.format) {\n          const hourFormatted = this.state.options.calendar.hour.format[formatName](currentDate);\n          this.state.options.calendar.hour.formatted[formatName].push(hourFormatted);\n          widths[formatName] = this.state.ctx.measureText(hourFormatted).width;\n        }\n        this.state.options.calendar.hour.widths.push(widths);\n        for (let formatName in this.state.options.calendar.hour.format) {\n          if (widths[formatName] > maxWidths[formatName]) {\n            maxWidths[formatName] = widths[formatName];\n          }\n        }\n        currentDate = currentDate.add(1, 'hour');\n      }\n    },\n\n    /**\n     * Compute calendar days column widths basing on text widths\n     */\n    computeDayWidths() {\n      const style = { ...this.style['calendar-row-text'], ...this.style['calendar-row-text--day'] };\n      this.state.ctx.font = style['font-size'] + ' ' + style['font-family'];\n      const localeName = this.state.options.locale.name;\n      let currentDate = dayjs(this.state.options.times.steps[0].time).locale(localeName);\n      let maxWidths = this.state.options.calendar.day.maxWidths;\n      this.state.options.calendar.day.widths = [];\n      Object.keys(this.state.options.calendar.day.format).forEach(formatName => {\n        maxWidths[formatName] = 0;\n      });\n      for (let day = 0, daysLen = this.state.options.times.steps.length; day < daysLen; day++) {\n        const widths = {\n          day\n        };\n        Object.keys(this.state.options.calendar.day.format).forEach(formatName => {\n          widths[formatName] = this.state.ctx.measureText(\n            this.state.options.calendar.day.format[formatName](currentDate)\n          ).width;\n        });\n        this.state.options.calendar.day.widths.push(widths);\n        Object.keys(this.state.options.calendar.day.format).forEach(formatName => {\n          if (widths[formatName] > maxWidths[formatName]) {\n            maxWidths[formatName] = widths[formatName];\n          }\n        });\n        currentDate = currentDate.add(1, 'day');\n      }\n    },\n\n    /**\n     * Months count\n     *\n     * @description Returns number of different months in specified time range\n     *\n     * @param {number} fromTime - date in ms\n     * @param {number} toTime - date in ms\n     *\n     * @returns {number} different months count\n     */\n    monthsCount(fromTime, toTime) {\n      if (fromTime > toTime) {\n        return 0;\n      }\n      let currentMonth = dayjs(fromTime);\n      let previousMonth = currentMonth.clone();\n      let monthsCount = 1;\n      while (currentMonth.valueOf() <= toTime) {\n        currentMonth = currentMonth.add(1, 'day');\n        if (previousMonth.month() !== currentMonth.month()) {\n          monthsCount++;\n        }\n        previousMonth = currentMonth.clone();\n      }\n      return monthsCount;\n    },\n\n    /**\n     * Compute month calendar columns widths basing on text widths\n     */\n    computeMonthWidths() {\n      const style = { ...this.style['calendar-row-text'], ...this.style['calendar-row-text--month'] };\n      this.state.ctx.font = style['font-size'] + ' ' + style['font-family'];\n      let maxWidths = this.state.options.calendar.month.maxWidths;\n      this.state.options.calendar.month.widths = [];\n      Object.keys(this.state.options.calendar.month.format).forEach(formatName => {\n        maxWidths[formatName] = 0;\n      });\n      const localeName = this.state.options.locale.name;\n      let currentDate = dayjs(this.state.options.times.firstTime).locale(localeName);\n      const monthsCount = this.monthsCount(this.state.options.times.firstTime, this.state.options.times.lastTime);\n      for (let month = 0; month < monthsCount; month++) {\n        const widths = {\n          month\n        };\n        Object.keys(this.state.options.calendar.month.format).forEach(formatName => {\n          widths[formatName] = this.state.ctx.measureText(\n            this.state.options.calendar.month.format[formatName](currentDate)\n          ).width;\n        });\n        this.state.options.calendar.month.widths.push(widths);\n        Object.keys(this.state.options.calendar.month.format).forEach(formatName => {\n          if (widths[formatName] > maxWidths[formatName]) {\n            maxWidths[formatName] = widths[formatName];\n          }\n        });\n        currentDate = currentDate.add(1, 'month');\n      }\n    },\n\n    /**\n     * Prepare time and date variables for gantt\n     */\n    prepareDates() {\n      let firstTaskTime = Number.MAX_SAFE_INTEGER;\n      let lastTaskTime = 0;\n      for (let index = 0, len = this.state.tasks.length; index < len; index++) {\n        let task = this.state.tasks[index];\n        if (task.startTime < firstTaskTime) {\n          firstTaskTime = task.startTime;\n        }\n        if (task.startTime + task.duration > lastTaskTime) {\n          lastTaskTime = task.startTime + task.duration;\n        }\n      }\n      this.state.options.times.firstTaskTime = firstTaskTime;\n      this.state.options.times.lastTaskTime = lastTaskTime;\n      this.state.options.times.firstTime = dayjs(firstTaskTime)\n        .locale(this.state.options.locale.name)\n        .startOf('day')\n        .subtract(this.state.options.scope.before, 'days')\n        .startOf('day')\n        .valueOf();\n      this.state.options.times.lastTime = dayjs(lastTaskTime)\n        .locale(this.state.options.locale.name)\n        .endOf('day')\n        .add(this.state.options.scope.after, 'days')\n        .endOf('day')\n        .valueOf();\n    },\n\n    /**\n     * Setup and calculate everything\n     */\n    setup(itsUpdate = '') {\n      this.initialize(itsUpdate);\n      this.prepareDates();\n      this.initTimes();\n      this.calculateSteps();\n      this.computeCalendarWidths();\n      this.state.options.taskList.width = this.state.options.taskList.columns.reduce(\n        (prev, current) => {\n          return { width: prev.width + current.width };\n        },\n        { width: 0 }\n      ).width;\n    },\n\n    /**\n     * Global resize event (from window.addEventListener)\n     */\n    globalOnResize() {\n      if (typeof this.$el === 'undefined' || !this.$el) {\n        return;\n      }\n      this.state.options.clientWidth = this.$el.clientWidth;\n      if (\n        this.state.options.taskList.widthFromPercentage >\n        (this.state.options.clientWidth / 100) * this.state.options.taskList.widthThreshold\n      ) {\n        const diff =\n          this.state.options.taskList.widthFromPercentage -\n          (this.state.options.clientWidth / 100) * this.state.options.taskList.widthThreshold;\n        let diffPercent = 100 - (diff / this.state.options.taskList.widthFromPercentage) * 100;\n        if (diffPercent < 0) {\n          diffPercent = 0;\n        }\n        this.state.options.taskList.columns.forEach(column => {\n          column.thresholdPercent = diffPercent;\n        });\n      } else {\n        this.state.options.taskList.columns.forEach(column => {\n          column.thresholdPercent = 100;\n        });\n      }\n      this.calculateTaskListColumnsDimensions();\n      this.$emit('calendar-recalculate');\n      this.syncScrollTop();\n    }\n  },\n\n  computed: {\n    /**\n     * Get visible tasks\n     * Very important method which will bring us only those tasks that are visible inside gantt chart\n     * For example when task is collapsed - children of this task are not visible - we should not render them\n     */\n    visibleTasks() {\n      const visibleTasks = this.state.tasks.filter(task => this.isTaskVisible(task));\n      const maxRows = visibleTasks.slice(0, this.state.options.maxRows);\n      this.state.options.rowsHeight = this.getTasksHeight(maxRows);\n      let heightCompensation = 0;\n      if (this.state.options.maxHeight && this.state.options.rowsHeight > this.state.options.maxHeight) {\n        heightCompensation = this.state.options.rowsHeight - this.state.options.maxHeight;\n        this.state.options.rowsHeight = this.state.options.maxHeight;\n      }\n      this.state.options.height = this.getHeight(maxRows) - heightCompensation;\n      this.state.options.allVisibleTasksHeight = this.getTasksHeight(visibleTasks);\n      this.state.options.outerHeight = this.getHeight(maxRows, true) - heightCompensation;\n      let len = visibleTasks.length;\n      for (let index = 0; index < len; index++) {\n        let task = visibleTasks[index];\n        task.width =\n          task.duration / this.state.options.times.timePerPixel - this.style['grid-line-vertical']['stroke-width'];\n        if (task.width < 0) {\n          task.width = 0;\n        }\n        task.height = this.state.options.row.height;\n        task.x = this.timeToPixelOffsetX(task.startTime);\n        task.y =\n          (this.state.options.row.height + this.state.options.chart.grid.horizontal.gap * 2) * index +\n          this.state.options.chart.grid.horizontal.gap;\n      }\n      return visibleTasks;\n    },\n\n    /**\n     * Style shortcut\n     */\n    style() {\n      return this.state.dynamicStyle;\n    },\n\n    /**\n     * Get columns and compute dimensions on the fly\n     */\n    getTaskListColumns() {\n      this.calculateTaskListColumnsDimensions();\n      return this.state.options.taskList.columns;\n    },\n\n    /**\n     * Tasks used for communicate with parent component\n     */\n    outputTasks() {\n      return this.state.tasks;\n    },\n\n    /**\n     * Options used to communicate with parent component\n     */\n    outputOptions() {\n      return this.state.options;\n    }\n  },\n\n  /**\n   * Watch tasks after gantt instance is created and react when we have new kids on the block\n   */\n  created() {\n    this.$set = function(obj, key, val) { obj[key] = val; };\n    this.$delete = function(obj, key) { delete obj[key]; };\n    this.root = this.$parent;\n    this.$emitBus = mitt();\n    this.initializeEvents();\n    this.setup();\n    this.state.unwatchTasks = this.$watch(\n      'tasks',\n      tasks => {\n        const notEqual = notEqualDeep(tasks, this.outputTasks);\n        if (notEqual) {\n          this.setup('tasks');\n        }\n      },\n      { deep: true }\n    );\n    this.state.unwatchOptions = this.$watch(\n      'options',\n      opts => {\n        const notEqual = notEqualDeep(opts, this.outputOptions);\n        if (notEqual) {\n          this.setup('options');\n        }\n      },\n      { deep: true }\n    );\n    this.state.unwatchStyle = this.$watch(\n      'dynamicStyle',\n      style => {\n        const notEqual = notEqualDeep(style, this.dynamicStyle);\n        if (notEqual) {\n          this.initializeStyle();\n        }\n      },\n      { deep: true, immediate: true }\n    );\n\n    this.state.unwatchOutputTasks = this.$watch(\n      'outputTasks',\n      tasks => {\n        this.$emit('tasks-changed', tasks.map(task => task));\n      },\n      { deep: true }\n    );\n    this.state.unwatchOutputOptions = this.$watch(\n      'outputOptions',\n      options => {\n        this.$emit('options-changed', mergeDeep({}, options));\n      },\n      { deep: true }\n    );\n    this.state.unwatchOutputStyle = this.$watch(\n      'style',\n      style => {\n        this.$emit('dynamic-style-changed', mergeDeep({}, style));\n      },\n      { deep: true }\n    );\n\n    this.$emitBus.emit('gantt-elastic-created', this);\n    this.$emit('created', this);\n  },\n\n  /**\n   * Emit before-mount event\n   */\n  beforeMount() {\n    this.$emit('before-mount', this);\n  },\n\n  /**\n   * Emit ready/mounted events and deliver this gantt instance to outside world when needed\n   */\n  mounted() {\n    this.state.options.clientWidth = this.$el.clientWidth;\n    this.state.resizeObserver = new ResizeObserver((entries, observer) => {\n      this.globalOnResize();\n    });\n    this.state.resizeObserver.observe(this.$el.parentNode);\n    this.globalOnResize();\n    this.$emit('ready', this);\n    this.$emitBus.emit('gantt-elastic-mounted', this);\n    this.$emit('mounted', this);\n    this.$emitBus.emit('gantt-elastic-ready', this);\n    this.$emit('gantt-elastic-ready', this);\n  },\n\n  /**\n   * Emit event when data was changed and before update (you can cleanup dom events here for example)\n   */\n  beforeUpdate() {\n    this.$emit('before-update');\n  },\n\n  /**\n   * Emit event when gantt-elastic view was updated\n   */\n  updated() {\n    this.$nextTick(() => {\n      this.$emit('updated');\n    });\n  },\n\n  /**\n   * Before destroy event - clean up\n   */\n  beforeUnmount() {\n    this.state.resizeObserver.unobserve(this.$el.parentNode);\n    this.state.unwatchTasks();\n    this.state.unwatchOptions();\n    this.state.unwatchStyle();\n    this.state.unwatchOutputTasks();\n    this.state.unwatchOutputOptions();\n    this.state.unwatchOutputStyle();\n    this.$emit('before-destroy');\n  },\n\n  /**\n   * Emit event after gantt-elastic was destroyed\n   */\n  unmounted() {\n    this.$emit('destroyed');\n  }\n};\nexport default GanttElastic;\n</script>\n\n<style>\n[class^='gantt-elastic'],\n[class*=' gantt-elastic'] {\n  box-sizing: border-box;\n}\n.gantt-elastic__main-view svg {\n  display: block;\n}\n.gantt-elastic__grid-horizontal-line,\n.gantt-elastic__grid-vertical-line {\n  stroke: #a0a0a0;\n  stroke-width: 1;\n}\nforeignObject > * {\n  margin: 0px;\n}\n.gantt-elastic .p-2 {\n  padding: 10rem;\n}\n.gantt-elastic__main-view-main-container,\n.gantt-elastic__main-view-container {\n  overflow: hidden;\n  max-width: 100%;\n}\n.gantt-elastic__task-list-header-column:last-of-type {\n  border-right: 1px solid #00000050;\n}\n.gantt-elastic__task-list-item:last-of-type {\n  border-bottom: 1px solid #00000050;\n}\n.gantt-elastic__task-list-item-value-wrapper:hover {\n  overflow: visible !important;\n}\n.gantt-elastic__task-list-item-value-wrapper:hover > .gantt-elastic__task-list-item-value-container {\n  position: relative;\n  overflow: visible !important;\n}\n.gantt-elastic__task-list-item-value-wrapper:hover > .gantt-elastic__task-list-item-value {\n  position: absolute;\n}\n</style>\n"],"sourceRoot":""}]);
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

/***/ 28
(module, __unused_webpack_exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(401);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(534)/* ["default"] */ .A)
var update = add("1a9e2ec5", content, false, {});
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

/***/ 508
(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__508__;

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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
var external_Vue_ = __webpack_require__(508);
var external_Vue_default = /*#__PURE__*/__webpack_require__.n(external_Vue_);
;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/GanttElastic.vue?vue&type=template&id=a7f9b0e0


const _hoisted_1 = {
  class: "gantt-elastic",
  style: {"width":"100%"}
}

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_main_view = (0,external_Vue_.resolveComponent)("main-view")

  return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", _hoisted_1, [
    (0,external_Vue_.renderSlot)(_ctx.$slots, "header"),
    (0,external_Vue_.createVNode)(_component_main_view, { ref: "mainView" }, null, 512 /* NEED_PATCH */),
    (0,external_Vue_.renderSlot)(_ctx.$slots, "footer")
  ]))
}
;// ./src/GanttElastic.vue?vue&type=template&id=a7f9b0e0

// EXTERNAL MODULE: ./node_modules/dayjs/dayjs.min.js
var dayjs_min = __webpack_require__(353);
var dayjs_min_default = /*#__PURE__*/__webpack_require__.n(dayjs_min);
;// ./node_modules/mitt/dist/mitt.mjs
/* harmony default export */ function mitt(n){return{all:n=n||new Map,on:function(t,e){var i=n.get(t);i?i.push(e):n.set(t,[e])},off:function(t,e){var i=n.get(t);i&&(e?i.splice(i.indexOf(e)>>>0,1):n.set(t,[]))},emit:function(t,e){var i=n.get(t);i&&i.slice().map(function(n){n(e)}),(i=n.get("*"))&&i.slice().map(function(n){n(t,e)})}}}
//# sourceMappingURL=mitt.mjs.map

;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/MainView.vue?vue&type=template&id=7ac81826


function MainViewvue_type_template_id_7ac81826_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_task_list = (0,external_Vue_.resolveComponent)("task-list")
  const _component_chart = (0,external_Vue_.resolveComponent)("chart")

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
    ], 36 /* STYLE, NEED_HYDRATION */)
  ], 4 /* STYLE */))
}
;// ./src/components/MainView.vue?vue&type=template&id=7ac81826

;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/TaskList/TaskList.vue?vue&type=template&id=0ddd1532


function TaskListvue_type_template_id_0ddd1532_render(_ctx, _cache, $props, $setup, $data, $options) {
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
        style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['task-list-items'], height: $options.root.state.options.rowsHeight + 'px' })
      }, [
        ((0,external_Vue_.openBlock)(true), (0,external_Vue_.createElementBlock)(external_Vue_.Fragment, null, (0,external_Vue_.renderList)($options.root.visibleTasks, (task) => {
          return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createBlock)(_component_task_list_item, {
            key: task.id,
            task: task
          }, null, 8 /* PROPS */, ["task"]))
        }), 128 /* KEYED_FRAGMENT */))
      ], 4 /* STYLE */)
    ], 4 /* STYLE */)
  ], 4 /* STYLE */)), [
    [external_Vue_.vShow, $options.root.state.options.taskList.display]
  ])
}
;// ./src/components/TaskList/TaskList.vue?vue&type=template&id=0ddd1532

;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/TaskList/TaskListHeader.vue?vue&type=template&id=42b30fa2


const TaskListHeadervue_type_template_id_42b30fa2_hoisted_1 = ["column"]
const _hoisted_2 = ["column", "onMousedown"]

function TaskListHeadervue_type_template_id_42b30fa2_render(_ctx, _cache, $props, $setup, $data, $options) {
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
        }, (0,external_Vue_.toDisplayString)(column.label), 45 /* TEXT, STYLE, PROPS, NEED_HYDRATION */, TaskListHeadervue_type_template_id_42b30fa2_hoisted_1),
        (0,external_Vue_.createElementVNode)("div", {
          class: "gantt-elastic__task-list-header-resizer-wrapper",
          style: (0,external_Vue_.normalizeStyle)({
          ...$options.root.style['task-list-header-resizer-wrapper'],
          ...column.style['task-list-header-resizer-wrapper']
        }),
          column: column,
          onMousedown: $event => ($options.resizerMouseDown($event, column))
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
;// ./src/components/TaskList/TaskListHeader.vue?vue&type=template&id=42b30fa2

;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Expander.vue?vue&type=template&id=09ed5944


const Expandervue_type_template_id_09ed5944_hoisted_1 = ["width", "height"]
const Expandervue_type_template_id_09ed5944_hoisted_2 = ["x", "y", "width", "height"]
const _hoisted_3 = ["x1", "y1", "x2", "y2"]
const _hoisted_4 = ["x1", "y1", "x2", "y2"]

function Expandervue_type_template_id_09ed5944_render(_ctx, _cache, $props, $setup, $data, $options) {
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
          onClick: _cache[0] || (_cache[0] = (...args) => ($options.toggle && $options.toggle(...args)))
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
          }, null, 14 /* CLASS, STYLE, PROPS */, Expandervue_type_template_id_09ed5944_hoisted_2),
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
        ], 14 /* CLASS, STYLE, PROPS */, Expandervue_type_template_id_09ed5944_hoisted_1))
      : (0,external_Vue_.createCommentVNode)("v-if", true)
  ], 6 /* CLASS, STYLE */))
}
;// ./src/components/Expander.vue?vue&type=template&id=09ed5944

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
const __exports__ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(Expandervue_type_script_lang_js, [['render',Expandervue_type_template_id_09ed5944_render]])

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
        const lastWidth = this.resizer.moving.width;
        this.resizer.moving.width = this.resizer.initialWidth + event.clientX - this.resizer.x;
        if (this.resizer.moving.width < this.root.state.options.taskList.minWidth) {
          this.resizer.moving.width = this.root.state.options.taskList.minWidth;
        }
        if (lastWidth !== this.resizer.moving.width) {
          this.root.$emitBus.emit('taskList-column-width-change', this.resizer.moving);
        }
      }
    },

    /**
     * Resizer mouse up event handler
     */
    resizerMouseUp(event) {
      if (this.resizer.moving) {
        this.root.$emitBus.emit('taskList-column-width-change-stop', this.resizer.moving);
        this.resizer.moving = false;
      }
    }
  },

  /**
   * Created
   */
  created() {
    this.$set = function(obj, key, val) { obj[key] = val; };
    this.$delete = function(obj, key) { delete obj[key]; };

    this.mouseUpListener = document.addEventListener('mouseup', this.resizerMouseUp.bind(this));
    this.mouseMoveListener = document.addEventListener('mousemove', this.resizerMouseMove.bind(this));
    this.root.$emitBus.on('main-view-mousemove', this.resizerMouseMove);
    this.root.$emitBus.on('main-view-mouseup', this.resizerMouseUp);
  },

  /**
   * Before destroy event - clear all event listeners
   */
  beforeUnmount() {
    document.removeEventListener('mouseup', this.resizerMouseUp);
    document.removeEventListener('mousemove', this.resizerMouseMove);
    this.root.$emitBus.off('main-view-mousemove', this.resizerMouseMove);
    this.root.$emitBus.off('main-view-mouseup', this.resizerMouseUp);
  }
});

;// ./src/components/TaskList/TaskListHeader.vue?vue&type=script&lang=js
 
;// ./src/components/TaskList/TaskListHeader.vue




;
const TaskListHeader_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(TaskListHeadervue_type_script_lang_js, [['render',TaskListHeadervue_type_template_id_42b30fa2_render]])

/* harmony default export */ const TaskListHeader = (TaskListHeader_exports_);
;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/TaskList/TaskListItem.vue?vue&type=template&id=9ddbf498


function TaskListItemvue_type_template_id_9ddbf498_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_task_list_expander = (0,external_Vue_.resolveComponent)("task-list-expander")
  const _component_item_column = (0,external_Vue_.resolveComponent)("item-column")

  return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
    class: "gantt-elastic__task-list-item",
    style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['task-list-item'] })
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
  ], 4 /* STYLE */))
}
;// ./src/components/TaskList/TaskListItem.vue?vue&type=template&id=9ddbf498

;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/TaskList/ItemColumn.vue?vue&type=template&id=0c93a03c


const ItemColumnvue_type_template_id_0c93a03c_hoisted_1 = ["innerHTML"]

function ItemColumnvue_type_template_id_0c93a03c_render(_ctx, _cache, $props, $setup, $data, $options) {
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
              onMousemove: _cache[4] || (_cache[4] = $event => ($options.emitEvent('mousemove', $event))),
              onMousedown: _cache[5] || (_cache[5] = $event => ($options.emitEvent('mousedown', $event))),
              onMouseup: _cache[6] || (_cache[6] = $event => ($options.emitEvent('mouseup', $event))),
              onMousewheel: _cache[7] || (_cache[7] = $event => ($options.emitEvent('mousewheel', $event))),
              onTouchstart: _cache[8] || (_cache[8] = $event => ($options.emitEvent('touchstart', $event))),
              onTouchmove: _cache[9] || (_cache[9] = $event => ($options.emitEvent('touchmove', $event))),
              onTouchend: _cache[10] || (_cache[10] = $event => ($options.emitEvent('touchend', $event)))
            }, (0,external_Vue_.toDisplayString)($options.value), 37 /* TEXT, STYLE, NEED_HYDRATION */))
          : ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("div", {
              key: 1,
              class: "gantt-elastic__task-list-item-value",
              style: (0,external_Vue_.normalizeStyle)($options.valueStyle),
              onClick: _cache[11] || (_cache[11] = $event => ($options.emitEvent('click', $event))),
              onMouseenter: _cache[12] || (_cache[12] = $event => ($options.emitEvent('mouseenter', $event))),
              onMouseover: _cache[13] || (_cache[13] = $event => ($options.emitEvent('mouseover', $event))),
              onMouseout: _cache[14] || (_cache[14] = $event => ($options.emitEvent('mouseout', $event))),
              onMousemove: _cache[15] || (_cache[15] = $event => ($options.emitEvent('mousemove', $event))),
              onMousedown: _cache[16] || (_cache[16] = $event => ($options.emitEvent('mousedown', $event))),
              onMouseup: _cache[17] || (_cache[17] = $event => ($options.emitEvent('mouseup', $event))),
              onMousewheel: _cache[18] || (_cache[18] = $event => ($options.emitEvent('mousewheel', $event))),
              onTouchstart: _cache[19] || (_cache[19] = $event => ($options.emitEvent('touchstart', $event))),
              onTouchmove: _cache[20] || (_cache[20] = $event => ($options.emitEvent('touchmove', $event))),
              onTouchend: _cache[21] || (_cache[21] = $event => ($options.emitEvent('touchend', $event))),
              innerHTML: $options.value
            }, null, 44 /* STYLE, PROPS, NEED_HYDRATION */, ItemColumnvue_type_template_id_0c93a03c_hoisted_1))
      ], 4 /* STYLE */)
    ], 4 /* STYLE */)
  ], 4 /* STYLE */))
}
;// ./src/components/TaskList/ItemColumn.vue?vue&type=template&id=0c93a03c

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

    itemColumnStyle() {
      return {
        ...this.root.style['task-list-item-column'],
        ...this.column.style['task-list-item-column'],
        width: this.column.finalWidth + 'px',
        height: this.column.height + 'px'
      };
    },

    wrapperStyle() {
      return {
        ...this.root.style['task-list-item-value-wrapper'],
        ...this.column.style['task-list-item-value-wrapper']
      };
    },

    containerStyle() {
      return {
        ...this.root.style['task-list-item-value-container'],
        ...this.column.style['task-list-item-value-container']
      };
    },

    valueStyle() {
      return { ...this.root.style['task-list-item-value'], ...this.column.style['task-list-item-value'] };
    }
  }
});

;// ./src/components/TaskList/ItemColumn.vue




;
const ItemColumn_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(ItemColumnvue_type_script_lang_js, [['render',ItemColumnvue_type_template_id_0c93a03c_render]])

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
  computed: {
    columns() {
      return this.root.state.options.taskList.columns;
    }
  }
});

;// ./src/components/TaskList/TaskListItem.vue?vue&type=script&lang=js
 
;// ./src/components/TaskList/TaskListItem.vue




;
const TaskListItem_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(TaskListItemvue_type_script_lang_js, [['render',TaskListItemvue_type_template_id_9ddbf498_render]])

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
const TaskList_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(TaskListvue_type_script_lang_js, [['render',TaskListvue_type_template_id_0ddd1532_render]])

/* harmony default export */ const TaskList = (TaskList_exports_);
;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/Chart.vue?vue&type=template&id=491a2e0a


const Chartvue_type_template_id_491a2e0a_hoisted_1 = ["width", "height"]
const Chartvue_type_template_id_491a2e0a_hoisted_2 = ["task"]

function Chartvue_type_template_id_491a2e0a_render(_ctx, _cache, $props, $setup, $data, $options) {
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
            xmlns: "http://www.w3.org/2000/svg"
          }, [
            (0,external_Vue_.createVNode)(_component_days_highlight),
            (0,external_Vue_.createVNode)(_component_grid),
            (0,external_Vue_.createVNode)(_component_dependency_lines, {
              tasks: $options.root.visibleTasks
            }, null, 8 /* PROPS */, ["tasks"]),
            ((0,external_Vue_.openBlock)(true), (0,external_Vue_.createElementBlock)(external_Vue_.Fragment, null, (0,external_Vue_.renderList)($options.root.visibleTasks, (task) => {
              return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("g", {
                class: "gantt-elastic__chart-row-wrapper",
                style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['chart-row-wrapper'] }),
                task: task,
                key: task.id
              }, [
                ((0,external_Vue_.openBlock)(), (0,external_Vue_.createBlock)((0,external_Vue_.resolveDynamicComponent)(task.type), { task: task }, null, 8 /* PROPS */, ["task"]))
              ], 12 /* STYLE, PROPS */, Chartvue_type_template_id_491a2e0a_hoisted_2))
            }), 128 /* KEYED_FRAGMENT */))
          ], 12 /* STYLE, PROPS */, Chartvue_type_template_id_491a2e0a_hoisted_1))
        ], 4 /* STYLE */)
      ], 4 /* STYLE */)
    ], 4 /* STYLE */)
  ], 4 /* STYLE */))
}
;// ./src/components/Chart/Chart.vue?vue&type=template&id=491a2e0a

;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/Grid.vue?vue&type=template&id=ee756b32


const Gridvue_type_template_id_ee756b32_hoisted_1 = ["width", "height"]
const Gridvue_type_template_id_ee756b32_hoisted_2 = ["x1", "y1", "x2", "y2"]
const Gridvue_type_template_id_ee756b32_hoisted_3 = ["x1", "y1", "x2", "y2"]
const Gridvue_type_template_id_ee756b32_hoisted_4 = ["x1", "y1", "x2", "y2"]

function Gridvue_type_template_id_ee756b32_render(_ctx, _cache, $props, $setup, $data, $options) {
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
        }, null, 12 /* STYLE, PROPS */, Gridvue_type_template_id_ee756b32_hoisted_2))
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
        }, null, 12 /* STYLE, PROPS */, Gridvue_type_template_id_ee756b32_hoisted_3))
      }), 128 /* KEYED_FRAGMENT */)),
      (0,external_Vue_.createElementVNode)("line", {
        class: "gantt-elastic__grid-line-time",
        style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['grid-line-time'] }),
        x1: $options.timeLinePosition.x,
        y1: $options.timeLinePosition.y1,
        x2: $options.timeLinePosition.x,
        y2: $options.timeLinePosition.y2
      }, null, 12 /* STYLE, PROPS */, Gridvue_type_template_id_ee756b32_hoisted_4)
    ], 4 /* STYLE */)
  ], 12 /* STYLE, PROPS */, Gridvue_type_template_id_ee756b32_hoisted_1))
}
;// ./src/components/Chart/Grid.vue?vue&type=template&id=ee756b32

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
     * Get current time line position
     *
     * @returns {object}
     */
    timeLinePosition() {
      const d = new Date();
      const current = d.getTime();
      const currentOffset = this.root.timeToPixelOffsetX(current);
      const timeLine = {
        x: 0,
        y1: 0,
        y2: '100%',
        dateTime: '',
        time: current
      };
      timeLine.x = currentOffset;
      timeLine.dateTime = d.toLocaleDateString();
      return timeLine;
    }
  }
});

;// ./src/components/Chart/Grid.vue




;
const Grid_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(Gridvue_type_script_lang_js, [['render',Gridvue_type_template_id_ee756b32_render]])

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
;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Calendar/Calendar.vue?vue&type=template&id=d6b41f74


function Calendarvue_type_template_id_d6b41f74_render(_ctx, _cache, $props, $setup, $data, $options) {
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
;// ./src/components/Calendar/Calendar.vue?vue&type=template&id=d6b41f74

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
    dates() {
      const hours = this.generateHours();
      const days = this.generateDays();
      const months = this.generateMonths();
      const allDates = { hours, days, months };
      this.calculateCalendarDimensions(allDates);
      return allDates;
    }
  }
});

;// ./src/components/Calendar/Calendar.vue?vue&type=script&lang=js
 
;// ./src/components/Calendar/Calendar.vue




;
const Calendar_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(Calendarvue_type_script_lang_js, [['render',Calendarvue_type_template_id_d6b41f74_render]])

/* harmony default export */ const Calendar = (Calendar_exports_);
;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/DependencyLines.vue?vue&type=template&id=5467c6cc


const DependencyLinesvue_type_template_id_5467c6cc_hoisted_1 = ["task"]
const DependencyLinesvue_type_template_id_5467c6cc_hoisted_2 = ["task", "d"]

function DependencyLinesvue_type_template_id_5467c6cc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("svg", {
    x: "0",
    y: "0",
    width: "100%",
    height: "100%",
    class: "gantt-elastic__chart-dependency-lines-container",
    style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['chart-dependency-lines-container'] })
  }, [
    ((0,external_Vue_.openBlock)(true), (0,external_Vue_.createElementBlock)(external_Vue_.Fragment, null, (0,external_Vue_.renderList)($options.dependencyTasks, (task) => {
      return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("g", {
        key: task.id,
        task: task
      }, [
        ((0,external_Vue_.openBlock)(true), (0,external_Vue_.createElementBlock)(external_Vue_.Fragment, null, (0,external_Vue_.renderList)(task.dependencyLines, (dependencyLine) => {
          return ((0,external_Vue_.openBlock)(), (0,external_Vue_.createElementBlock)("path", {
            class: "gantt-elastic__chart-dependency-lines-path",
            style: (0,external_Vue_.normalizeStyle)({ ...$options.root.style['chart-dependency-lines-path'], ...task.style['chart-dependency-lines-path'], ...task.style['chart-dependency-lines-path-' + dependencyLine.task_id] }),
            key: dependencyLine.id,
            task: task,
            d: dependencyLine.points
          }, null, 12 /* STYLE, PROPS */, DependencyLinesvue_type_template_id_5467c6cc_hoisted_2))
        }), 128 /* KEYED_FRAGMENT */))
      ], 8 /* PROPS */, DependencyLinesvue_type_template_id_5467c6cc_hoisted_1))
    }), 128 /* KEYED_FRAGMENT */))
  ], 4 /* STYLE */))
}
;// ./src/components/Chart/DependencyLines.vue?vue&type=template&id=5467c6cc

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
     * Get tasks which are dependent on other tasks
     *
     * @returns {array}
     */
    dependencyTasks() {
      return this.tasks
        .filter(task => typeof task.dependentOn !== 'undefined')
        .map(task => {
          task.dependencyLines = task.dependentOn.map(id => {
            return { points: this.getPoints(id, task.id), task_id: id };
          });
          return task;
        })
        .filter(task => task.dependencyLines.points !== null);
    }
  }
});

;// ./src/components/Chart/DependencyLines.vue




;
const DependencyLines_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(DependencyLinesvue_type_script_lang_js, [['render',DependencyLinesvue_type_template_id_5467c6cc_render]])

/* harmony default export */ const DependencyLines = (DependencyLines_exports_);
;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/Row/Task.vue?vue&type=template&id=4a3c3dc1


const Taskvue_type_template_id_4a3c3dc1_hoisted_1 = ["x", "y", "width", "height"]
const Taskvue_type_template_id_4a3c3dc1_hoisted_2 = ["x", "y", "width", "height", "viewBox"]
const Taskvue_type_template_id_4a3c3dc1_hoisted_3 = ["id"]
const Taskvue_type_template_id_4a3c3dc1_hoisted_4 = ["points"]
const _hoisted_5 = ["points"]

function Taskvue_type_template_id_4a3c3dc1_render(_ctx, _cache, $props, $setup, $data, $options) {
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
        ], 12 /* STYLE, PROPS */, Taskvue_type_template_id_4a3c3dc1_hoisted_1))
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
      onMousemove: _cache[4] || (_cache[4] = $event => (_ctx.emitEvent('mousemove', $event))),
      onMousedown: _cache[5] || (_cache[5] = $event => (_ctx.emitEvent('mousedown', $event))),
      onMouseup: _cache[6] || (_cache[6] = $event => (_ctx.emitEvent('mouseup', $event))),
      onMousewheel: _cache[7] || (_cache[7] = $event => (_ctx.emitEvent('mousewheel', $event))),
      onTouchstart: _cache[8] || (_cache[8] = $event => (_ctx.emitEvent('touchstart', $event))),
      onTouchmove: _cache[9] || (_cache[9] = $event => (_ctx.emitEvent('touchmove', $event))),
      onTouchend: _cache[10] || (_cache[10] = $event => (_ctx.emitEvent('touchend', $event))),
      xmlns: "http://www.w3.org/2000/svg"
    }, [
      (0,external_Vue_.createElementVNode)("defs", null, [
        (0,external_Vue_.createElementVNode)("clipPath", { id: $options.clipPathId }, [
          (0,external_Vue_.createElementVNode)("polygon", { points: $options.getPoints }, null, 8 /* PROPS */, Taskvue_type_template_id_4a3c3dc1_hoisted_4)
        ], 8 /* PROPS */, Taskvue_type_template_id_4a3c3dc1_hoisted_3)
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
    ], 44 /* STYLE, PROPS, NEED_HYDRATION */, Taskvue_type_template_id_4a3c3dc1_hoisted_2)),
    ($options.root.state.options.chart.text.display)
      ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createBlock)(_component_chart_text, {
          key: 1,
          task: $props.task
        }, null, 8 /* PROPS */, ["task"]))
      : (0,external_Vue_.createCommentVNode)("v-if", true)
  ], 4 /* STYLE */))
}
;// ./src/components/Chart/Row/Task.vue?vue&type=template&id=4a3c3dc1

;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/Text.vue?vue&type=template&id=dfc2b57a


const Textvue_type_template_id_dfc2b57a_hoisted_1 = ["x", "y", "width", "height"]
const Textvue_type_template_id_dfc2b57a_hoisted_2 = ["height"]
const Textvue_type_template_id_dfc2b57a_hoisted_3 = ["innerHTML"]

function Textvue_type_template_id_dfc2b57a_render(_ctx, _cache, $props, $setup, $data, $options) {
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
              innerHTML: $props.task.label
            }, null, 12 /* STYLE, PROPS */, Textvue_type_template_id_dfc2b57a_hoisted_3))
          : (0,external_Vue_.createCommentVNode)("v-if", true)
      ], 4 /* STYLE */)
    ], 8 /* PROPS */, Textvue_type_template_id_dfc2b57a_hoisted_2))
  ], 12 /* STYLE, PROPS */, Textvue_type_template_id_dfc2b57a_hoisted_1))
}
;// ./src/components/Chart/Text.vue?vue&type=template&id=dfc2b57a

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

;// ./src/components/Chart/Text.vue




;
const Text_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(Textvue_type_script_lang_js, [['render',Textvue_type_template_id_dfc2b57a_render]])

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
const Task_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(Taskvue_type_script_lang_js, [['render',Taskvue_type_template_id_4a3c3dc1_render]])

/* harmony default export */ const Task = (Task_exports_);
;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/Row/Milestone.vue?vue&type=template&id=6d69cd05


const Milestonevue_type_template_id_6d69cd05_hoisted_1 = ["x", "y", "width", "height"]
const Milestonevue_type_template_id_6d69cd05_hoisted_2 = ["x", "y", "width", "height", "viewBox"]
const Milestonevue_type_template_id_6d69cd05_hoisted_3 = ["id"]
const Milestonevue_type_template_id_6d69cd05_hoisted_4 = ["points"]
const Milestonevue_type_template_id_6d69cd05_hoisted_5 = ["points"]

function Milestonevue_type_template_id_6d69cd05_render(_ctx, _cache, $props, $setup, $data, $options) {
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
        ], 12 /* STYLE, PROPS */, Milestonevue_type_template_id_6d69cd05_hoisted_1))
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
      onMousemove: _cache[4] || (_cache[4] = $event => (_ctx.emitEvent('mousemove', $event))),
      onMousedown: _cache[5] || (_cache[5] = $event => (_ctx.emitEvent('mousedown', $event))),
      onMouseup: _cache[6] || (_cache[6] = $event => (_ctx.emitEvent('mouseup', $event))),
      onMousewheel: _cache[7] || (_cache[7] = $event => (_ctx.emitEvent('mousewheel', $event))),
      onTouchstart: _cache[8] || (_cache[8] = $event => (_ctx.emitEvent('touchstart', $event))),
      onTouchmove: _cache[9] || (_cache[9] = $event => (_ctx.emitEvent('touchmove', $event))),
      onTouchend: _cache[10] || (_cache[10] = $event => (_ctx.emitEvent('touchend', $event))),
      xmlns: "http://www.w3.org/2000/svg"
    }, [
      (0,external_Vue_.createElementVNode)("defs", null, [
        (0,external_Vue_.createElementVNode)("clipPath", { id: $options.clipPathId }, [
          (0,external_Vue_.createElementVNode)("polygon", { points: $options.getPoints }, null, 8 /* PROPS */, Milestonevue_type_template_id_6d69cd05_hoisted_4)
        ], 8 /* PROPS */, Milestonevue_type_template_id_6d69cd05_hoisted_3)
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
      }, null, 12 /* STYLE, PROPS */, Milestonevue_type_template_id_6d69cd05_hoisted_5),
      (0,external_Vue_.createVNode)(_component_progress_bar, {
        task: $props.task,
        "clip-path": 'url(#' + $options.clipPathId + ')'
      }, null, 8 /* PROPS */, ["task", "clip-path"])
    ], 44 /* STYLE, PROPS, NEED_HYDRATION */, Milestonevue_type_template_id_6d69cd05_hoisted_2)),
    ($options.root.state.options.chart.text.display)
      ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createBlock)(_component_chart_text, {
          key: 1,
          task: $props.task
        }, null, 8 /* PROPS */, ["task"]))
      : (0,external_Vue_.createCommentVNode)("v-if", true)
  ], 4 /* STYLE */))
}
;// ./src/components/Chart/Row/Milestone.vue?vue&type=template&id=6d69cd05

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
const Milestone_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(Milestonevue_type_script_lang_js, [['render',Milestonevue_type_template_id_6d69cd05_render]])

/* harmony default export */ const Milestone = (Milestone_exports_);
;// ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/Chart/Row/Project.vue?vue&type=template&id=5a17b514


const Projectvue_type_template_id_5a17b514_hoisted_1 = ["x", "y", "width", "height"]
const Projectvue_type_template_id_5a17b514_hoisted_2 = ["x", "y", "width", "height", "viewBox"]
const Projectvue_type_template_id_5a17b514_hoisted_3 = ["id"]
const Projectvue_type_template_id_5a17b514_hoisted_4 = ["d"]
const Projectvue_type_template_id_5a17b514_hoisted_5 = ["d"]

function Projectvue_type_template_id_5a17b514_render(_ctx, _cache, $props, $setup, $data, $options) {
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
        ], 12 /* STYLE, PROPS */, Projectvue_type_template_id_5a17b514_hoisted_1))
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
      onMousemove: _cache[4] || (_cache[4] = $event => (_ctx.emitEvent('mousemove', $event))),
      onMousedown: _cache[5] || (_cache[5] = $event => (_ctx.emitEvent('mousedown', $event))),
      onMouseup: _cache[6] || (_cache[6] = $event => (_ctx.emitEvent('mouseup', $event))),
      onMousewheel: _cache[7] || (_cache[7] = $event => (_ctx.emitEvent('mousewheel', $event))),
      onTouchstart: _cache[8] || (_cache[8] = $event => (_ctx.emitEvent('touchstart', $event))),
      onTouchmove: _cache[9] || (_cache[9] = $event => (_ctx.emitEvent('touchmove', $event))),
      onTouchend: _cache[10] || (_cache[10] = $event => (_ctx.emitEvent('touchend', $event))),
      xmlns: "http://www.w3.org/2000/svg"
    }, [
      (0,external_Vue_.createElementVNode)("defs", null, [
        (0,external_Vue_.createElementVNode)("clipPath", { id: $options.clipPathId }, [
          (0,external_Vue_.createElementVNode)("path", { d: $options.getPoints }, null, 8 /* PROPS */, Projectvue_type_template_id_5a17b514_hoisted_4)
        ], 8 /* PROPS */, Projectvue_type_template_id_5a17b514_hoisted_3)
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
      }, null, 12 /* STYLE, PROPS */, Projectvue_type_template_id_5a17b514_hoisted_5),
      (0,external_Vue_.createVNode)(_component_progress_bar, {
        task: $props.task,
        "clip-path": 'url(#' + $options.clipPathId + ')'
      }, null, 8 /* PROPS */, ["task", "clip-path"])
    ], 44 /* STYLE, PROPS, NEED_HYDRATION */, Projectvue_type_template_id_5a17b514_hoisted_2)),
    ($options.root.state.options.chart.text.display)
      ? ((0,external_Vue_.openBlock)(), (0,external_Vue_.createBlock)(_component_chart_text, {
          key: 1,
          task: $props.task
        }, null, 8 /* PROPS */, ["task"]))
      : (0,external_Vue_.createCommentVNode)("v-if", true)
  ], 4 /* STYLE */))
}
;// ./src/components/Chart/Row/Project.vue?vue&type=template&id=5a17b514

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
const Project_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(Projectvue_type_script_lang_js, [['render',Projectvue_type_template_id_5a17b514_render]])

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
  }
});

;// ./src/components/Chart/Chart.vue?vue&type=script&lang=js
 
;// ./src/components/Chart/Chart.vue




;
const Chart_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(Chartvue_type_script_lang_js, [['render',Chartvue_type_template_id_491a2e0a_render]])

/* harmony default export */ const Chart = (Chart_exports_);
;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/components/MainView.vue?vue&type=script&lang=js




let ignoreScrollEvents = false;

/* harmony default export */ const MainViewvue_type_script_lang_js = ({
  name: 'MainView',
  components: {
    TaskList: TaskList,
    Chart: Chart
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
     * Initiates drag scrolling mode
     */
    chartMouseDown(ev) {
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
const MainView_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(MainViewvue_type_script_lang_js, [['render',MainViewvue_type_template_id_7ac81826_render]])

/* harmony default export */ const MainView = (MainView_exports_);
;// ./src/style.js
/**
 * @fileoverview Styles for gantt-elastic
 * @license MIT
 * @author Rafal Pospiech <neuronet.io@gmail.com>
 * @package GanttElastic
 */

function getStyle(fontSize = '12px', fontFamily = 'Arial, sans-serif') {
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
    'slot-header-beforeOptions': {
      display: 'inline-block'
    }
  };
}

;// ./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js
/**
 * A collection of shims that provide minimal functionality of the ES6 collections.
 *
 * These implementations are not meant to be used outside of the ResizeObserver
 * modules as they cover only a limited range of use cases.
 */
/* eslint-disable require-jsdoc, valid-jsdoc */
var MapShim = (function () {
    if (typeof Map !== 'undefined') {
        return Map;
    }
    /**
     * Returns index in provided array that matches the specified key.
     *
     * @param {Array<Array>} arr
     * @param {*} key
     * @returns {number}
     */
    function getIndex(arr, key) {
        var result = -1;
        arr.some(function (entry, index) {
            if (entry[0] === key) {
                result = index;
                return true;
            }
            return false;
        });
        return result;
    }
    return /** @class */ (function () {
        function class_1() {
            this.__entries__ = [];
        }
        Object.defineProperty(class_1.prototype, "size", {
            /**
             * @returns {boolean}
             */
            get: function () {
                return this.__entries__.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {*} key
         * @returns {*}
         */
        class_1.prototype.get = function (key) {
            var index = getIndex(this.__entries__, key);
            var entry = this.__entries__[index];
            return entry && entry[1];
        };
        /**
         * @param {*} key
         * @param {*} value
         * @returns {void}
         */
        class_1.prototype.set = function (key, value) {
            var index = getIndex(this.__entries__, key);
            if (~index) {
                this.__entries__[index][1] = value;
            }
            else {
                this.__entries__.push([key, value]);
            }
        };
        /**
         * @param {*} key
         * @returns {void}
         */
        class_1.prototype.delete = function (key) {
            var entries = this.__entries__;
            var index = getIndex(entries, key);
            if (~index) {
                entries.splice(index, 1);
            }
        };
        /**
         * @param {*} key
         * @returns {void}
         */
        class_1.prototype.has = function (key) {
            return !!~getIndex(this.__entries__, key);
        };
        /**
         * @returns {void}
         */
        class_1.prototype.clear = function () {
            this.__entries__.splice(0);
        };
        /**
         * @param {Function} callback
         * @param {*} [ctx=null]
         * @returns {void}
         */
        class_1.prototype.forEach = function (callback, ctx) {
            if (ctx === void 0) { ctx = null; }
            for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
                var entry = _a[_i];
                callback.call(ctx, entry[1], entry[0]);
            }
        };
        return class_1;
    }());
})();

/**
 * Detects whether window and document objects are available in current environment.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document;

// Returns global object of a current environment.
var global$1 = (function () {
    if (typeof __webpack_require__.g !== 'undefined' && __webpack_require__.g.Math === Math) {
        return __webpack_require__.g;
    }
    if (typeof self !== 'undefined' && self.Math === Math) {
        return self;
    }
    if (typeof window !== 'undefined' && window.Math === Math) {
        return window;
    }
    // eslint-disable-next-line no-new-func
    return Function('return this')();
})();

/**
 * A shim for the requestAnimationFrame which falls back to the setTimeout if
 * first one is not supported.
 *
 * @returns {number} Requests' identifier.
 */
var requestAnimationFrame$1 = (function () {
    if (typeof requestAnimationFrame === 'function') {
        // It's required to use a bounded function because IE sometimes throws
        // an "Invalid calling object" error if rAF is invoked without the global
        // object on the left hand side.
        return requestAnimationFrame.bind(global$1);
    }
    return function (callback) { return setTimeout(function () { return callback(Date.now()); }, 1000 / 60); };
})();

// Defines minimum timeout before adding a trailing call.
var trailingTimeout = 2;
/**
 * Creates a wrapper function which ensures that provided callback will be
 * invoked only once during the specified delay period.
 *
 * @param {Function} callback - Function to be invoked after the delay period.
 * @param {number} delay - Delay after which to invoke callback.
 * @returns {Function}
 */
function throttle (callback, delay) {
    var leadingCall = false, trailingCall = false, lastCallTime = 0;
    /**
     * Invokes the original callback function and schedules new invocation if
     * the "proxy" was called during current request.
     *
     * @returns {void}
     */
    function resolvePending() {
        if (leadingCall) {
            leadingCall = false;
            callback();
        }
        if (trailingCall) {
            proxy();
        }
    }
    /**
     * Callback invoked after the specified delay. It will further postpone
     * invocation of the original function delegating it to the
     * requestAnimationFrame.
     *
     * @returns {void}
     */
    function timeoutCallback() {
        requestAnimationFrame$1(resolvePending);
    }
    /**
     * Schedules invocation of the original function.
     *
     * @returns {void}
     */
    function proxy() {
        var timeStamp = Date.now();
        if (leadingCall) {
            // Reject immediately following calls.
            if (timeStamp - lastCallTime < trailingTimeout) {
                return;
            }
            // Schedule new call to be in invoked when the pending one is resolved.
            // This is important for "transitions" which never actually start
            // immediately so there is a chance that we might miss one if change
            // happens amids the pending invocation.
            trailingCall = true;
        }
        else {
            leadingCall = true;
            trailingCall = false;
            setTimeout(timeoutCallback, delay);
        }
        lastCallTime = timeStamp;
    }
    return proxy;
}

// Minimum delay before invoking the update of observers.
var REFRESH_DELAY = 20;
// A list of substrings of CSS properties used to find transition events that
// might affect dimensions of observed elements.
var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight'];
// Check if MutationObserver is available.
var mutationObserverSupported = typeof MutationObserver !== 'undefined';
/**
 * Singleton controller class which handles updates of ResizeObserver instances.
 */
var ResizeObserverController = /** @class */ (function () {
    /**
     * Creates a new instance of ResizeObserverController.
     *
     * @private
     */
    function ResizeObserverController() {
        /**
         * Indicates whether DOM listeners have been added.
         *
         * @private {boolean}
         */
        this.connected_ = false;
        /**
         * Tells that controller has subscribed for Mutation Events.
         *
         * @private {boolean}
         */
        this.mutationEventsAdded_ = false;
        /**
         * Keeps reference to the instance of MutationObserver.
         *
         * @private {MutationObserver}
         */
        this.mutationsObserver_ = null;
        /**
         * A list of connected observers.
         *
         * @private {Array<ResizeObserverSPI>}
         */
        this.observers_ = [];
        this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
        this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
    }
    /**
     * Adds observer to observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be added.
     * @returns {void}
     */
    ResizeObserverController.prototype.addObserver = function (observer) {
        if (!~this.observers_.indexOf(observer)) {
            this.observers_.push(observer);
        }
        // Add listeners if they haven't been added yet.
        if (!this.connected_) {
            this.connect_();
        }
    };
    /**
     * Removes observer from observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be removed.
     * @returns {void}
     */
    ResizeObserverController.prototype.removeObserver = function (observer) {
        var observers = this.observers_;
        var index = observers.indexOf(observer);
        // Remove observer if it's present in registry.
        if (~index) {
            observers.splice(index, 1);
        }
        // Remove listeners if controller has no connected observers.
        if (!observers.length && this.connected_) {
            this.disconnect_();
        }
    };
    /**
     * Invokes the update of observers. It will continue running updates insofar
     * it detects changes.
     *
     * @returns {void}
     */
    ResizeObserverController.prototype.refresh = function () {
        var changesDetected = this.updateObservers_();
        // Continue running updates if changes have been detected as there might
        // be future ones caused by CSS transitions.
        if (changesDetected) {
            this.refresh();
        }
    };
    /**
     * Updates every observer from observers list and notifies them of queued
     * entries.
     *
     * @private
     * @returns {boolean} Returns "true" if any observer has detected changes in
     *      dimensions of it's elements.
     */
    ResizeObserverController.prototype.updateObservers_ = function () {
        // Collect observers that have active observations.
        var activeObservers = this.observers_.filter(function (observer) {
            return observer.gatherActive(), observer.hasActive();
        });
        // Deliver notifications in a separate cycle in order to avoid any
        // collisions between observers, e.g. when multiple instances of
        // ResizeObserver are tracking the same element and the callback of one
        // of them changes content dimensions of the observed target. Sometimes
        // this may result in notifications being blocked for the rest of observers.
        activeObservers.forEach(function (observer) { return observer.broadcastActive(); });
        return activeObservers.length > 0;
    };
    /**
     * Initializes DOM listeners.
     *
     * @private
     * @returns {void}
     */
    ResizeObserverController.prototype.connect_ = function () {
        // Do nothing if running in a non-browser environment or if listeners
        // have been already added.
        if (!isBrowser || this.connected_) {
            return;
        }
        // Subscription to the "Transitionend" event is used as a workaround for
        // delayed transitions. This way it's possible to capture at least the
        // final state of an element.
        document.addEventListener('transitionend', this.onTransitionEnd_);
        window.addEventListener('resize', this.refresh);
        if (mutationObserverSupported) {
            this.mutationsObserver_ = new MutationObserver(this.refresh);
            this.mutationsObserver_.observe(document, {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            });
        }
        else {
            document.addEventListener('DOMSubtreeModified', this.refresh);
            this.mutationEventsAdded_ = true;
        }
        this.connected_ = true;
    };
    /**
     * Removes DOM listeners.
     *
     * @private
     * @returns {void}
     */
    ResizeObserverController.prototype.disconnect_ = function () {
        // Do nothing if running in a non-browser environment or if listeners
        // have been already removed.
        if (!isBrowser || !this.connected_) {
            return;
        }
        document.removeEventListener('transitionend', this.onTransitionEnd_);
        window.removeEventListener('resize', this.refresh);
        if (this.mutationsObserver_) {
            this.mutationsObserver_.disconnect();
        }
        if (this.mutationEventsAdded_) {
            document.removeEventListener('DOMSubtreeModified', this.refresh);
        }
        this.mutationsObserver_ = null;
        this.mutationEventsAdded_ = false;
        this.connected_ = false;
    };
    /**
     * "Transitionend" event handler.
     *
     * @private
     * @param {TransitionEvent} event
     * @returns {void}
     */
    ResizeObserverController.prototype.onTransitionEnd_ = function (_a) {
        var _b = _a.propertyName, propertyName = _b === void 0 ? '' : _b;
        // Detect whether transition may affect dimensions of an element.
        var isReflowProperty = transitionKeys.some(function (key) {
            return !!~propertyName.indexOf(key);
        });
        if (isReflowProperty) {
            this.refresh();
        }
    };
    /**
     * Returns instance of the ResizeObserverController.
     *
     * @returns {ResizeObserverController}
     */
    ResizeObserverController.getInstance = function () {
        if (!this.instance_) {
            this.instance_ = new ResizeObserverController();
        }
        return this.instance_;
    };
    /**
     * Holds reference to the controller's instance.
     *
     * @private {ResizeObserverController}
     */
    ResizeObserverController.instance_ = null;
    return ResizeObserverController;
}());

/**
 * Defines non-writable/enumerable properties of the provided target object.
 *
 * @param {Object} target - Object for which to define properties.
 * @param {Object} props - Properties to be defined.
 * @returns {Object} Target object.
 */
var defineConfigurable = (function (target, props) {
    for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
        var key = _a[_i];
        Object.defineProperty(target, key, {
            value: props[key],
            enumerable: false,
            writable: false,
            configurable: true
        });
    }
    return target;
});

/**
 * Returns the global object associated with provided element.
 *
 * @param {Object} target
 * @returns {Object}
 */
var getWindowOf = (function (target) {
    // Assume that the element is an instance of Node, which means that it
    // has the "ownerDocument" property from which we can retrieve a
    // corresponding global object.
    var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
    // Return the local global object if it's not possible extract one from
    // provided element.
    return ownerGlobal || global$1;
});

// Placeholder of an empty content rectangle.
var emptyRect = createRectInit(0, 0, 0, 0);
/**
 * Converts provided string to a number.
 *
 * @param {number|string} value
 * @returns {number}
 */
function toFloat(value) {
    return parseFloat(value) || 0;
}
/**
 * Extracts borders size from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @param {...string} positions - Borders positions (top, right, ...)
 * @returns {number}
 */
function getBordersSize(styles) {
    var positions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        positions[_i - 1] = arguments[_i];
    }
    return positions.reduce(function (size, position) {
        var value = styles['border-' + position + '-width'];
        return size + toFloat(value);
    }, 0);
}
/**
 * Extracts paddings sizes from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @returns {Object} Paddings box.
 */
function getPaddings(styles) {
    var positions = ['top', 'right', 'bottom', 'left'];
    var paddings = {};
    for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
        var position = positions_1[_i];
        var value = styles['padding-' + position];
        paddings[position] = toFloat(value);
    }
    return paddings;
}
/**
 * Calculates content rectangle of provided SVG element.
 *
 * @param {SVGGraphicsElement} target - Element content rectangle of which needs
 *      to be calculated.
 * @returns {DOMRectInit}
 */
function getSVGContentRect(target) {
    var bbox = target.getBBox();
    return createRectInit(0, 0, bbox.width, bbox.height);
}
/**
 * Calculates content rectangle of provided HTMLElement.
 *
 * @param {HTMLElement} target - Element for which to calculate the content rectangle.
 * @returns {DOMRectInit}
 */
function getHTMLElementContentRect(target) {
    // Client width & height properties can't be
    // used exclusively as they provide rounded values.
    var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
    // By this condition we can catch all non-replaced inline, hidden and
    // detached elements. Though elements with width & height properties less
    // than 0.5 will be discarded as well.
    //
    // Without it we would need to implement separate methods for each of
    // those cases and it's not possible to perform a precise and performance
    // effective test for hidden elements. E.g. even jQuery's ':visible' filter
    // gives wrong results for elements with width & height less than 0.5.
    if (!clientWidth && !clientHeight) {
        return emptyRect;
    }
    var styles = getWindowOf(target).getComputedStyle(target);
    var paddings = getPaddings(styles);
    var horizPad = paddings.left + paddings.right;
    var vertPad = paddings.top + paddings.bottom;
    // Computed styles of width & height are being used because they are the
    // only dimensions available to JS that contain non-rounded values. It could
    // be possible to utilize the getBoundingClientRect if only it's data wasn't
    // affected by CSS transformations let alone paddings, borders and scroll bars.
    var width = toFloat(styles.width), height = toFloat(styles.height);
    // Width & height include paddings and borders when the 'border-box' box
    // model is applied (except for IE).
    if (styles.boxSizing === 'border-box') {
        // Following conditions are required to handle Internet Explorer which
        // doesn't include paddings and borders to computed CSS dimensions.
        //
        // We can say that if CSS dimensions + paddings are equal to the "client"
        // properties then it's either IE, and thus we don't need to subtract
        // anything, or an element merely doesn't have paddings/borders styles.
        if (Math.round(width + horizPad) !== clientWidth) {
            width -= getBordersSize(styles, 'left', 'right') + horizPad;
        }
        if (Math.round(height + vertPad) !== clientHeight) {
            height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
        }
    }
    // Following steps can't be applied to the document's root element as its
    // client[Width/Height] properties represent viewport area of the window.
    // Besides, it's as well not necessary as the <html> itself neither has
    // rendered scroll bars nor it can be clipped.
    if (!isDocumentElement(target)) {
        // In some browsers (only in Firefox, actually) CSS width & height
        // include scroll bars size which can be removed at this step as scroll
        // bars are the only difference between rounded dimensions + paddings
        // and "client" properties, though that is not always true in Chrome.
        var vertScrollbar = Math.round(width + horizPad) - clientWidth;
        var horizScrollbar = Math.round(height + vertPad) - clientHeight;
        // Chrome has a rather weird rounding of "client" properties.
        // E.g. for an element with content width of 314.2px it sometimes gives
        // the client width of 315px and for the width of 314.7px it may give
        // 314px. And it doesn't happen all the time. So just ignore this delta
        // as a non-relevant.
        if (Math.abs(vertScrollbar) !== 1) {
            width -= vertScrollbar;
        }
        if (Math.abs(horizScrollbar) !== 1) {
            height -= horizScrollbar;
        }
    }
    return createRectInit(paddings.left, paddings.top, width, height);
}
/**
 * Checks whether provided element is an instance of the SVGGraphicsElement.
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
var isSVGGraphicsElement = (function () {
    // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
    // interface.
    if (typeof SVGGraphicsElement !== 'undefined') {
        return function (target) { return target instanceof getWindowOf(target).SVGGraphicsElement; };
    }
    // If it's so, then check that element is at least an instance of the
    // SVGElement and that it has the "getBBox" method.
    // eslint-disable-next-line no-extra-parens
    return function (target) { return (target instanceof getWindowOf(target).SVGElement &&
        typeof target.getBBox === 'function'); };
})();
/**
 * Checks whether provided element is a document element (<html>).
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
function isDocumentElement(target) {
    return target === getWindowOf(target).document.documentElement;
}
/**
 * Calculates an appropriate content rectangle for provided html or svg element.
 *
 * @param {Element} target - Element content rectangle of which needs to be calculated.
 * @returns {DOMRectInit}
 */
function getContentRect(target) {
    if (!isBrowser) {
        return emptyRect;
    }
    if (isSVGGraphicsElement(target)) {
        return getSVGContentRect(target);
    }
    return getHTMLElementContentRect(target);
}
/**
 * Creates rectangle with an interface of the DOMRectReadOnly.
 * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
 *
 * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
 * @returns {DOMRectReadOnly}
 */
function createReadOnlyRect(_a) {
    var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
    // If DOMRectReadOnly is available use it as a prototype for the rectangle.
    var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
    var rect = Object.create(Constr.prototype);
    // Rectangle's properties are not writable and non-enumerable.
    defineConfigurable(rect, {
        x: x, y: y, width: width, height: height,
        top: y,
        right: x + width,
        bottom: height + y,
        left: x
    });
    return rect;
}
/**
 * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
 * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
 *
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} width - Rectangle's width.
 * @param {number} height - Rectangle's height.
 * @returns {DOMRectInit}
 */
function createRectInit(x, y, width, height) {
    return { x: x, y: y, width: width, height: height };
}

/**
 * Class that is responsible for computations of the content rectangle of
 * provided DOM element and for keeping track of it's changes.
 */
var ResizeObservation = /** @class */ (function () {
    /**
     * Creates an instance of ResizeObservation.
     *
     * @param {Element} target - Element to be observed.
     */
    function ResizeObservation(target) {
        /**
         * Broadcasted width of content rectangle.
         *
         * @type {number}
         */
        this.broadcastWidth = 0;
        /**
         * Broadcasted height of content rectangle.
         *
         * @type {number}
         */
        this.broadcastHeight = 0;
        /**
         * Reference to the last observed content rectangle.
         *
         * @private {DOMRectInit}
         */
        this.contentRect_ = createRectInit(0, 0, 0, 0);
        this.target = target;
    }
    /**
     * Updates content rectangle and tells whether it's width or height properties
     * have changed since the last broadcast.
     *
     * @returns {boolean}
     */
    ResizeObservation.prototype.isActive = function () {
        var rect = getContentRect(this.target);
        this.contentRect_ = rect;
        return (rect.width !== this.broadcastWidth ||
            rect.height !== this.broadcastHeight);
    };
    /**
     * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
     * from the corresponding properties of the last observed content rectangle.
     *
     * @returns {DOMRectInit} Last observed content rectangle.
     */
    ResizeObservation.prototype.broadcastRect = function () {
        var rect = this.contentRect_;
        this.broadcastWidth = rect.width;
        this.broadcastHeight = rect.height;
        return rect;
    };
    return ResizeObservation;
}());

var ResizeObserverEntry = /** @class */ (function () {
    /**
     * Creates an instance of ResizeObserverEntry.
     *
     * @param {Element} target - Element that is being observed.
     * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
     */
    function ResizeObserverEntry(target, rectInit) {
        var contentRect = createReadOnlyRect(rectInit);
        // According to the specification following properties are not writable
        // and are also not enumerable in the native implementation.
        //
        // Property accessors are not being used as they'd require to define a
        // private WeakMap storage which may cause memory leaks in browsers that
        // don't support this type of collections.
        defineConfigurable(this, { target: target, contentRect: contentRect });
    }
    return ResizeObserverEntry;
}());

var ResizeObserverSPI = /** @class */ (function () {
    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {ResizeObserverCallback} callback - Callback function that is invoked
     *      when one of the observed elements changes it's content dimensions.
     * @param {ResizeObserverController} controller - Controller instance which
     *      is responsible for the updates of observer.
     * @param {ResizeObserver} callbackCtx - Reference to the public
     *      ResizeObserver instance which will be passed to callback function.
     */
    function ResizeObserverSPI(callback, controller, callbackCtx) {
        /**
         * Collection of resize observations that have detected changes in dimensions
         * of elements.
         *
         * @private {Array<ResizeObservation>}
         */
        this.activeObservations_ = [];
        /**
         * Registry of the ResizeObservation instances.
         *
         * @private {Map<Element, ResizeObservation>}
         */
        this.observations_ = new MapShim();
        if (typeof callback !== 'function') {
            throw new TypeError('The callback provided as parameter 1 is not a function.');
        }
        this.callback_ = callback;
        this.controller_ = controller;
        this.callbackCtx_ = callbackCtx;
    }
    /**
     * Starts observing provided element.
     *
     * @param {Element} target - Element to be observed.
     * @returns {void}
     */
    ResizeObserverSPI.prototype.observe = function (target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }
        // Do nothing if current environment doesn't have the Element interface.
        if (typeof Element === 'undefined' || !(Element instanceof Object)) {
            return;
        }
        if (!(target instanceof getWindowOf(target).Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }
        var observations = this.observations_;
        // Do nothing if element is already being observed.
        if (observations.has(target)) {
            return;
        }
        observations.set(target, new ResizeObservation(target));
        this.controller_.addObserver(this);
        // Force the update of observations.
        this.controller_.refresh();
    };
    /**
     * Stops observing provided element.
     *
     * @param {Element} target - Element to stop observing.
     * @returns {void}
     */
    ResizeObserverSPI.prototype.unobserve = function (target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }
        // Do nothing if current environment doesn't have the Element interface.
        if (typeof Element === 'undefined' || !(Element instanceof Object)) {
            return;
        }
        if (!(target instanceof getWindowOf(target).Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }
        var observations = this.observations_;
        // Do nothing if element is not being observed.
        if (!observations.has(target)) {
            return;
        }
        observations.delete(target);
        if (!observations.size) {
            this.controller_.removeObserver(this);
        }
    };
    /**
     * Stops observing all elements.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.disconnect = function () {
        this.clearActive();
        this.observations_.clear();
        this.controller_.removeObserver(this);
    };
    /**
     * Collects observation instances the associated element of which has changed
     * it's content rectangle.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.gatherActive = function () {
        var _this = this;
        this.clearActive();
        this.observations_.forEach(function (observation) {
            if (observation.isActive()) {
                _this.activeObservations_.push(observation);
            }
        });
    };
    /**
     * Invokes initial callback function with a list of ResizeObserverEntry
     * instances collected from active resize observations.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.broadcastActive = function () {
        // Do nothing if observer doesn't have active observations.
        if (!this.hasActive()) {
            return;
        }
        var ctx = this.callbackCtx_;
        // Create ResizeObserverEntry instance for every active observation.
        var entries = this.activeObservations_.map(function (observation) {
            return new ResizeObserverEntry(observation.target, observation.broadcastRect());
        });
        this.callback_.call(ctx, entries, ctx);
        this.clearActive();
    };
    /**
     * Clears the collection of active observations.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.clearActive = function () {
        this.activeObservations_.splice(0);
    };
    /**
     * Tells whether observer has active observations.
     *
     * @returns {boolean}
     */
    ResizeObserverSPI.prototype.hasActive = function () {
        return this.activeObservations_.length > 0;
    };
    return ResizeObserverSPI;
}());

// Registry of internal observers. If WeakMap is not available use current shim
// for the Map collection as it has all required methods and because WeakMap
// can't be fully polyfilled anyway.
var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();
/**
 * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
 * exposing only those methods and properties that are defined in the spec.
 */
var ResizeObserver = /** @class */ (function () {
    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {ResizeObserverCallback} callback - Callback that is invoked when
     *      dimensions of the observed elements change.
     */
    function ResizeObserver(callback) {
        if (!(this instanceof ResizeObserver)) {
            throw new TypeError('Cannot call a class as a function.');
        }
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }
        var controller = ResizeObserverController.getInstance();
        var observer = new ResizeObserverSPI(callback, controller, this);
        observers.set(this, observer);
    }
    return ResizeObserver;
}());
// Expose public methods of ResizeObserver.
[
    'observe',
    'unobserve',
    'disconnect'
].forEach(function (method) {
    ResizeObserver.prototype[method] = function () {
        var _a;
        return (_a = observers.get(this))[method].apply(_a, arguments);
    };
});

var index = (function () {
    // Export existing implementation if available.
    if (typeof global$1.ResizeObserver !== 'undefined') {
        return global$1.ResizeObserver;
    }
    return ResizeObserver;
})();

/* harmony default export */ const ResizeObserver_es = (index);

;// ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/GanttElastic.vue?vue&type=script&lang=js








const ctx = document.createElement('canvas').getContext('2d');
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
  let fontFamily = window
    .getComputedStyle(document.body)
    .getPropertyValue('font-family')
    .toString();
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
    MainView: MainView
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
      for (let [index, task] of tasks.entries()) {
        tasks[index] = {
          ...task,
          id: task[options.taskMapping.id],
          start: task[options.taskMapping.start],
          label: task[options.taskMapping.label],
          duration: task[options.taskMapping.duration],
          progress: task[options.taskMapping.progress],
          type: task[options.taskMapping.type],
          style: task[options.taskMapping.style],
          collapsed: task[options.taskMapping.collapsed]
        };
      }
      return tasks;
    },

    /**
     * Initialize component
     */
    initialize(itsUpdate = '') {
      let options = mergeDeep({}, this.state.options, getOptions(this.options), this.options);
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
        return column;
      });
      this.state.options = options;
      tasks = this.fillTasks(tasks);
      this.state.tasksById = this.resetTaskTree(tasks);
      this.state.taskTree = this.makeTaskTree(this.state.rootTask, tasks);
      this.state.tasks = this.state.taskTree.allChildren.map(childId => this.getTask(childId));
      this.calculateTaskListColumnsDimensions();
      this.state.options.scrollBarHeight = this.getScrollBarHeight();
      this.state.options.outerHeight = this.state.options.height + this.state.options.scrollBarHeight;
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
      if (x) {
        x = x / this.state.options.times.timePerPixel;
      }
      return x;
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
      const visibleTasks = this.state.tasks.filter(task => this.isTaskVisible(task));
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
        let task = visibleTasks[index];
        task.width =
          task.duration / this.state.options.times.timePerPixel - this.style['grid-line-vertical']['stroke-width'];
        if (task.width < 0) {
          task.width = 0;
        }
        task.height = this.state.options.row.height;
        task.x = this.timeToPixelOffsetX(task.startTime);
        task.y =
          (this.state.options.row.height + this.state.options.chart.grid.horizontal.gap * 2) * index +
          this.state.options.chart.grid.horizontal.gap;
      }
      return visibleTasks;
    },

    /**
     * Style shortcut
     */
    style() {
      return this.state.dynamicStyle;
    },

    /**
     * Get columns and compute dimensions on the fly
     */
    getTaskListColumns() {
      this.calculateTaskListColumnsDimensions();
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
    this.root = this.$parent;
    this.$emitBus = mitt();
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
        const notEqual = notEqualDeep(style, this.dynamicStyle);
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
      },
      { deep: true }
    );
    this.state.unwatchOutputOptions = this.$watch(
      'outputOptions',
      options => {
        this.$emit('options-changed', mergeDeep({}, options));
      },
      { deep: true }
    );
    this.state.unwatchOutputStyle = this.$watch(
      'style',
      style => {
        this.$emit('dynamic-style-changed', mergeDeep({}, style));
      },
      { deep: true }
    );

    this.$emitBus.emit('gantt-elastic-created', this);
    this.$emit('created', this);
  },

  /**
   * Emit before-mount event
   */
  beforeMount() {
    this.$emit('before-mount', this);
  },

  /**
   * Emit ready/mounted events and deliver this gantt instance to outside world when needed
   */
  mounted() {
    this.state.options.clientWidth = this.$el.clientWidth;
    this.state.resizeObserver = new ResizeObserver_es((entries, observer) => {
      this.globalOnResize();
    });
    this.state.resizeObserver.observe(this.$el.parentNode);
    this.globalOnResize();
    this.$emit('ready', this);
    this.$emitBus.emit('gantt-elastic-mounted', this);
    this.$emit('mounted', this);
    this.$emitBus.emit('gantt-elastic-ready', this);
    this.$emit('gantt-elastic-ready', this);
  },

  /**
   * Emit event when data was changed and before update (you can cleanup dom events here for example)
   */
  beforeUpdate() {
    this.$emit('before-update');
  },

  /**
   * Emit event when gantt-elastic view was updated
   */
  updated() {
    this.$nextTick(() => {
      this.$emit('updated');
    });
  },

  /**
   * Before destroy event - clean up
   */
  beforeUnmount() {
    this.state.resizeObserver.unobserve(this.$el.parentNode);
    this.state.unwatchTasks();
    this.state.unwatchOptions();
    this.state.unwatchStyle();
    this.state.unwatchOutputTasks();
    this.state.unwatchOutputOptions();
    this.state.unwatchOutputStyle();
    this.$emit('before-destroy');
  },

  /**
   * Emit event after gantt-elastic was destroyed
   */
  unmounted() {
    this.$emit('destroyed');
  }
};
/* harmony default export */ const GanttElasticvue_type_script_lang_js = (GanttElastic);

;// ./src/GanttElastic.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/GanttElastic.vue?vue&type=style&index=0&id=a7f9b0e0&lang=css
var GanttElasticvue_type_style_index_0_id_a7f9b0e0_lang_css = __webpack_require__(28);
;// ./src/GanttElastic.vue?vue&type=style&index=0&id=a7f9b0e0&lang=css

;// ./src/GanttElastic.vue




;


const GanttElastic_exports_ = /*#__PURE__*/(0,exportHelper_namespaceObject.A)(GanttElasticvue_type_script_lang_js, [['render',render]])

/* harmony default export */ const src_GanttElastic = (GanttElastic_exports_);
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=GanttElastic.umd.js.map