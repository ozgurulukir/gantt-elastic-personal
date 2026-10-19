# Update tasks without rebuilding the chart

Use `ganttInstance.updateTask(id, patch)` to patch one task in place. Changing the `tasks` prop array instead causes the
component's deep watcher to rebuild its task state. This guide shows how to keep the parent task list synchronized with
the component. Return to the [README](../../README.md) for setup.

```javascript
const gantt = this.$refs.gantt;

gantt.$on('tasks-changed', (tasks) => {
  this.tasks = tasks;
});

gantt.updateTask(1, { progress: 50, label: 'Design review' });
```

The component emits `tasks-changed` after its task state changes. Keep the owning `tasks` value current through that
event so a later rebuild does not replace the patch with older input data.

The patch uses canonical task fields such as `progress` and `dependencies`. For compatibility, `percent` maps to
`progress`, and `dependentOn` maps to `dependencies`. When `taskMapping` reads those values from renamed input fields,
the patch is mirrored to the mapped property as well.

If a patch changes `start`, `end`, or `duration` so the task falls outside the current time range, the component
recalculates the range around the changed task. The update is applied again after that rebuild.

The same instance supports `getTask(id)`, `selectTask(id)`, and `clearSelection()`. See the
[component reference](../reference/task-model-and-options.md) for methods and events, and
[interactions](interactions.md) for selection behavior.
