<h1>Gantt-elastic - Javascript Gantt Chart (editable, responsive)</h1>
<h2>Javascript Gantt Chart for vue, jquery, vanilla js and other frameworks</h2>

<br>
<h3>Project moved as next major version to <a href="https://github.com/neuronetio/gantt-schedule-timeline-calendar">gantt-schedule-timeline-calendar</a></h3><br>
<br>

<strong>This project is not suitable for use in a production environment as it runs very slowly even in standard medium projects. This project has been completely rewritten and built with super performance in mind and is available in the new repository as a <a href="https://github.com/neuronetio/gantt-schedule-timeline-calendar">gantt-schedule-timeline-calendar</a>.</strong>

<h2><a href="https://neuronet.io/gantt-elastic/" target="_blank">Gantt-elastic demo here</a></h2>

![preview img](https://github.com/neuronetio/gantt-elastic/raw/master/gantt-elastic.jpg)
![preview gif](https://github.com/neuronetio/gantt-elastic/raw/master/grab-scroll.gif)

## Gantt-elastic

is a vue component but it could be used in other frameworks or even with jQuery (vue is kind of elastic and lightweight framework).

> **Vue 3 fork note:** this repository is migrated to **Vue 3 / Webpack 5 / Cypress 15**. The default header is now built into the library (the old external `gantt-elastic-header` package was Vue 2 only and is no longer needed).

### Installation

`npm install --save gantt-elastic` or download zip from github / clone repo

### Usage (plain HTML / UMD build)

```html
<!DOCTYPE html>
<html charset="utf-8">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    <title>GanttElastic demo</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dayjs"></script>
    <script src="https://unpkg.com/gantt-elastic/dist/GanttElastic.umd.js"></script>
  </head>

  <body>
    <div style="width:100%;height:100%">
      <div id="app">
        <gantt-elastic ref="gantt" :tasks="tasks" :options="options" :dynamic-style="dynamicStyle">
          <template #footer><span>this is a footer</span></template>
        </gantt-elastic>
      </div>
    </div>

    <script>
      // just helper to get current dates
      function getDate(hours) {
        const currentDate = new Date();
        const timeStamp = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0).getTime();
        return new Date(timeStamp + hours * 60 * 60 * 1000).getTime();
      }

      let tasks = [
        {
          id: 1,
          label: 'Make some noise',
          user: '<a href="https://www.google.com/search?q=John+Doe" target="_blank" style="color:#0077c0;">John Doe</a>',
          start: getDate(-24 * 5),
          duration: 15 * 24 * 60 * 60 * 1000,
          progress: 85,
          type: 'project',
        },
        {
          id: 2,
          label: 'With great power comes great responsibility',
          user: 'Peter Parker',
          parentId: 1,
          start: getDate(-24 * 4),
          duration: 4 * 24 * 60 * 60 * 1000,
          progress: 50,
          type: 'milestone',
          collapsed: true,
        },
        {
          id: 3,
          label: 'Courage is being scared to death, but saddling up anyway.',
          user: 'John Wayne',
          parentId: 2,
          start: getDate(-24 * 3),
          duration: 2 * 24 * 60 * 60 * 1000,
          progress: 100,
          type: 'task',
        },
      ];

      let options = {
        maxRows: 100,
        maxHeight: 300,
        row: { height: 24 },
        calendar: { hour: { display: false } },
        chart: { progress: { bar: false }, expander: { display: true } },
        taskList: {
          expander: { straight: false },
          columns: [
            { id: 1, label: 'ID', value: 'id', width: 40 },
            {
              id: 2,
              label: 'Description',
              value: 'label',
              width: 200,
              expander: true,
              html: true,
              events: {
                click({ data, column }) {
                  alert('description clicked!\n' + data.label);
                },
              },
            },
            { id: 3, label: 'Assigned to', value: 'user', width: 130, html: true },
            { id: 4, label: 'Start', value: (task) => dayjs(task.start).format('YYYY-MM-DD'), width: 78 },
            { id: 5, label: 'Type', value: 'type', width: 68 },
            { id: 6, label: '%', value: 'progress', width: 35 },
          ],
        },
      };

      // create app
      const appApp = Vue.createApp({
        components: {
          'gantt-elastic': GanttElastic,
        },
        data() {
          return {
            tasks: tasks.map((task) => Object.assign({}, task)),
            options,
            dynamicStyle: {
              'task-list-header-label': { 'font-weight': 'bold' },
            },
          };
        },
        mounted() {
          const ganttInstance = this.$refs.gantt;

          // programmatic listeners (Vue 3 compatible $on shim backed by the internal event bus)
          ganttInstance.$on('tasks-changed', (tasks) => {
            this.tasks = tasks;
          });
          ganttInstance.$on('options-changed', (options) => {
            this.options = options;
          });
          ganttInstance.$on('dynamic-style-changed', (style) => {
            this.dynamicStyle = style;
          });
          ganttInstance.$on('chart-task-mouseenter', ({ data, event }) => {
            console.log('task mouse enter', { data, event });
          });
          ganttInstance.$on('taskList-task-click', ({ event, data, column }) => {
            console.log('task list clicked! (task)', { data, column });
          });
        },
      });

      // mount gantt to DOM
      const app = appApp.mount('#app');
    </script>
  </body>
</html>
```

A full working version of this snippet lives in [examples/from-readme.html](examples/from-readme.html) - the [examples](examples) folder also contains `vue.html`, `vue.edit.html`, `vue.max-rows.html` and `index.html`. Run them with any static server (e.g. `npx http-server`) from the repo root.

### gantt-elastic as vue component

Take a look at the `vue.html` inside the [examples folder](examples) file to see how you could add gantt-elastic inside `<script>` tag along with the Vue framework

You can also import gantt-elastic as compiled js component in commonjs or umd format ([examples](examples) folder) or just grab GanttElastic.vue from src directory and add to your existing vue project.

```javascript
import { createApp } from 'vue';
import GanttElastic from 'gantt-elastic';

const app = createApp({
  template: `<gantt-elastic :tasks="tasks" :options="options"></gantt-elastic>`,
  components: { GanttElastic },
  data() {
    return {
      tasks: tasks,
      options: options
    };
  }
});

app.mount('#gantt');
```

or

```javascript
import { createApp } from 'vue';
import App from './App.vue'; // your app that uses gantt-elastic from 'gantt-elastic/src/GanttElastic.vue'

createApp(App).mount('#app');
```

The header is built in and renders by default. To customize it, fill the `header` slot:

```html
<gantt-elastic :tasks="tasks" :options="options">
  <template #header>your custom header</template>
</gantt-elastic>
```

### For webpack usage (pure javascript, inside other frameworks or Vue App/Component)

```javascript
import GanttElastic from 'gantt-elastic/dist/GanttElastic.umd.js';
import GanttElastic from 'gantt-elastic/dist/GanttElastic.common.js'; // same as import GanttElastic from 'gantt-elastic';
import GanttElastic from 'gantt-elastic/src/GanttElastic.vue'; // if you want vue component directly without compilation - look above
// and the same with require
const GanttElastic = require('gantt-elastic/dist/GanttElastic.common.js');
```

For a standalone build with the bundled header use `dist/bundle.js` and the `GanttElastic.mount({ el, tasks, options, ready })` API - see [examples/index.html](examples/index.html).

### Styling

The gantt ships a default `system-ui` font stack and no longer inherits the host page's `body` font (which made plain integrations render in Times New Roman). Override it per instance through the dynamic style object:

```javascript
dynamicStyle: {
  fontFamily: 'Inter, sans-serif',
  fontSize: '13px',
}
```

All other style keys (`task-list-item`, `chart-row-bar-polygon`, ...) are overridable the same way - see [src/style.js](src/style.js) for the full key list.

### Development

```bash
npm install
npm run build    # webpack production build -> dist/
npm run dev      # webpack watch build
npm test         # cypress e2e suite
```

### Licence

MIT
