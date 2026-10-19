# Gantt Elastic

## About

Gantt Elastic is a Vue 3 component for displaying hierarchical tasks on a timeline, with a task list beside the chart.
It can be embedded in a Vue application or used through the UMD build in this repository, with Vue 3 available globally.

Install from this repository's GitHub URL so the package source is explicit. The package is named `gantt-elastic` in
`package.json`.

## Quickstart

Use an existing Vue 3 application with a bundler that compiles `.vue` files. Install this repository's package:

```bash
npm install github:ozgurulukir/gantt-elastic-personal
```

Add a mount point such as `<div id="app"></div>` to the app's HTML, then create `src/App.vue`:

```vue
<template>
  <GanttElastic :tasks="tasks" :options="options" />
</template>

<script setup>
import GanttElastic from 'gantt-elastic';

const day = 24 * 60 * 60 * 1000;
const tasks = [
  {
    id: 1,
    label: 'Plan the release',
    start: Date.now(),
    duration: 3 * day,
    progress: 25,
    type: 'task',
  },
];
const options = { maxHeight: 320 };
</script>
```

Mount it from the app entry point, for example `src/main.js`:

```javascript
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
```

The repository's UMD builds expect Vue 3 as the global `Vue` object. See the
[first chart tutorial](docs/tutorials/first-chart.md) and the complete [browser example](examples/from-readme.html).

## Features

- Hierarchical task rows with parent tasks, collapsible children, project and milestone bars, and dependency lines.
- A calendar timeline with zoom controls and a current-time line.
- A configurable task list with custom columns, column resizing, and header and footer slots.
- Tooltips, synchronized hover and selection, keyboard interaction, and `updateTask` for patching one task.
- Viewport row rendering for long task lists. The repository includes a 2,000-task fixture for the virtualization
  behavior.
- Plain-text rendering by default. Opt-in HTML paths are sanitized with DOMPurify; see
  [security and performance](docs/explanations/security-and-performance.md).

See the [task model and component reference](docs/reference/task-model-and-options.md),
[interaction guide](docs/how-to/interactions.md), and [task update guide](docs/how-to/update-tasks.md) for details.

## Documentation

Browse the [documentation index](docs/index.md) for tutorials, how-to guides, the reference, and development notes. The
standalone bundle and its `GanttElastic.mount({ el, tasks, options, ready })` API are demonstrated in
[examples/index.html](examples/index.html).

## Development and community

- [Development and Cypress guide](docs/development.md)
- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

## License

[MIT](LICENSE)
