# Task model and component reference

This page documents the task fields, commonly used options, methods, and events exposed by the Vue component. Return to
the [README](../../README.md) for installation and a minimal example.

## Task fields

| Field          | Type                            | Meaning                                                                                                       |
| -------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `id`           | any                             | Unique task identifier.                                                                                       |
| `parentId`     | id                              | Parent task identifier; omit it for a top-level task.                                                         |
| `label`        | string                          | Text shown for the task in the list and on its bar.                                                           |
| `user`         | any                             | Optional user data that can be shown by a custom task-list column.                                            |
| `start`        | date, timestamp, or date string | Task start time.                                                                                              |
| `end`          | date, timestamp, or date string | Alternate end time. If both `end` and `duration` are supplied, normalization derives the end time from `end`. |
| `duration`     | number                          | Duration in milliseconds.                                                                                     |
| `progress`     | number                          | Completion percentage from 0 to 100.                                                                          |
| `dependencies` | id[]                            | Identifiers of tasks this task depends on; shown as dependency lines.                                         |
| `type`         | string                          | Selects the `task`, `project` (summary bar over children), or `milestone` row component.                      |
| `collapsed`    | boolean                         | Whether the task's children are hidden.                                                                       |
| `style`        | object                          | Per-task style overrides keyed by style name.                                                                 |

The `start` and `end` values are parsed with Day.js. `duration` takes milliseconds, not days or hours.

### Input field mapping

`options.taskMapping` can map these canonical input fields to different property names: `id`, `start`, `label`,
`duration`, `progress`, `dependencies`, `type`, `style`, and `collapsed`. For example, `{ progress: 'percent' }` reads
the progress value from `task.percent`. `parentId` is not part of this mapping and keeps that field name.

For compatibility, an input task with `dependentOn` is used for dependencies when `dependencies` is absent. `updateTask`
also accepts the legacy patch names `percent` and `dependentOn`; see [Update tasks](../how-to/update-tasks.md).

## Common options

| Option                                 | Default     | Behavior                                                                                        |
| -------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| `maxRows`                              | `20`        | Maximum rows used for the chart's content height.                                               |
| `maxHeight`                            | `0`         | Optional chart height cap; `0` leaves the cap unset.                                            |
| `row.height`                           | `24`        | Row height in pixels.                                                                           |
| `taskSelection.display`                | `true`      | Enables task selection.                                                                         |
| `chart.tooltip.display`                | `true`      | Shows the default bar tooltip.                                                                  |
| `chart.tooltip.format`                 | `null`      | Optional function that returns tooltip text for a task. The returned value is rendered as text. |
| `chart.currentTimeLine.display`        | `true`      | Shows the current-time line.                                                                    |
| `chart.currentTimeLine.updateInterval` | `60000`     | Refresh interval in milliseconds.                                                               |
| `taskList.persistColumnWidths`         | `false`     | Saves runtime column widths to local storage when enabled.                                      |
| `taskList.persistKey`                  | `'default'` | Key suffix used for persisted column widths.                                                    |

Task-list columns use `id`, `label`, `value`, and `width`; optional settings include `expander`, `html`, `events`, and
`style`. The default header can be replaced with the `header` slot, and a `footer` slot is also available.
`dynamicStyle` overrides style values; the [style source](../../src/style.js) lists the keys.

The default font stack is `system-ui`. For example, set `dynamicStyle` to
`{ fontFamily: 'Inter, sans-serif', fontSize: '13px' }` to override the font for an instance.

## Instance methods

| Method                  | Result or behavior                                                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getTask(id)`           | Returns the task with that id, or `null` if it is not found.                                                                                      |
| `updateTask(id, patch)` | Applies a patch to one task and returns the updated task, or `null` if the id or patch is invalid. See [Update tasks](../how-to/update-tasks.md). |
| `selectTask(id)`        | Selects a task when selection is enabled and the id exists.                                                                                       |
| `clearSelection()`      | Clears the current selection.                                                                                                                     |
| `startNowTimer()`       | Restarts the current-time refresh timer after its interval changes.                                                                               |
| `getSVG()`              | Returns the main view's current SVG markup.                                                                                                       |
| `getImage(type)`        | Returns a promise for a base64 image generated from the current rendered view.                                                                    |

The main view contains the currently rendered rows. See
[Security and performance](../explanations/security-and-performance.md) for the row-windowing behavior.

## Distribution files

The webpack build writes UMD builds (`dist/GanttElastic.umd.js` and its minified variant), CommonJS builds
(`dist/GanttElastic.common.js` and its minified variant), and `dist/bundle.js` for the standalone mount API. The
component UMD build expects Vue 3 as the global `Vue` object. See [`examples/index.html`](../../examples/index.html) for
the standalone bundle.

## Events

The component emits Vue events and also exposes `$on(event, handler)` / `$off(event, handler)` on the instance for
programmatic subscriptions. Common output events are:

| Event                   | Payload                                                  |
| ----------------------- | -------------------------------------------------------- |
| `tasks-changed`         | Current tasks array.                                     |
| `options-changed`       | Current options object.                                  |
| `dynamic-style-changed` | Current dynamic style object.                            |
| `task-selected`         | Selected task, or `null` after clearing selection.       |
| `chart-task-click`      | An object with `event` and `data` (the task).            |
| `taskList-task-click`   | An object with `event`, `data` (the task), and `column`. |

Subscribe using the `$on` compatibility method as shown in the [task update guide](../how-to/update-tasks.md). The
standalone bundle in `dist/bundle.js` exposes `GanttElastic.mount({ el, tasks, options, ready })`; see
[`examples/index.html`](../../examples/index.html).

Related: [tutorial](../tutorials/first-chart.md), [interactions](../how-to/interactions.md),
[documentation index](../index.md).
