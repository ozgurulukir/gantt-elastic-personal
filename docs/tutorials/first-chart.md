# Tutorial: load a first chart

This tutorial loads the UMD component built from this repository in a browser page. It assumes a checkout of the repo
and network access for the Vue 3 CDN script. The npm and single-file component setup is in the
[README quickstart](../../README.md#quickstart).

From the repository root, install the development dependencies and build the UMD files:

```bash
npm install
npm run build
```

Save the following as `examples/first-chart.html`. It loads Vue before the local Gantt Elastic bundle, then registers
the exported component with the Vue app:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Gantt Elastic</title>
    <script src="https://unpkg.com/vue@3.5.41/dist/vue.global.js"></script>
    <script src="../dist/GanttElastic.umd.js"></script>
  </head>
  <body>
    <div id="app" style="height: 320px"></div>
    <script>
      const day = 24 * 60 * 60 * 1000;

      Vue.createApp({
        components: { 'gantt-elastic': GanttElastic },
        data() {
          return {
            tasks: [
              {
                id: 1,
                label: 'Plan the release',
                start: Date.now(),
                duration: 3 * day,
                progress: 25,
                type: 'task',
              },
            ],
            options: { maxHeight: 320 },
          };
        },
      }).mount('#app');
    </script>
  </body>
</html>
```

The task's `start` is a timestamp and `duration` is measured in milliseconds. The component includes a default header;
the [reference](../reference/task-model-and-options.md) documents the task fields and options, including custom headers.

Serve the repository root over HTTP and open `examples/first-chart.html`. The fuller
[`examples/from-readme.html`](../../examples/from-readme.html) demo uses the same local bundle. See
[Development and Cypress](../development.md) for the test server and the standalone mount API in
[`examples/index.html`](../../examples/index.html).

Related: [README](../../README.md), [documentation index](../index.md),
[task model reference](../reference/task-model-and-options.md).
