# Use chart interactions

This guide covers selection, keyboard operation, tooltips, the current-time line, and task-list column resizing. For
every option's defaults, see the [component reference](../reference/task-model-and-options.md).

## Select and clear a task

Selection is enabled by default. Clicking a chart bar or task-list row selects the same task in both views. Click empty
chart space to clear selection. Disable selection with `options.taskSelection.display = false`.

The instance methods `selectTask(id)` and `clearSelection()` control selection in code. The `task-selected` event
carries the selected task and carries `null` when selection is cleared.

Rows also highlight in the chart and task list together while the pointer is over either view.

## Use the keyboard

Tab can focus task bars, task-list rows, expanders, and column resize handles. Enter or Space activates the focused bar
or row; Up and Down move focus among rendered rows or bars; Escape clears selection. Expanders handle Enter and Space to
toggle their rows.

Focus outlines use `:focus-visible`, and chart transitions are disabled when the operating system requests reduced
motion.

## Configure tooltips and the current-time line

The bar tooltip is on by default and shows the task label, date range, duration, and progress. Set
`options.chart.tooltip.display = false` to hide it, or supply `options.chart.tooltip.format(task)` to return custom
text. The result is rendered as text, not HTML.

The current-time line is on by default and refreshes every 60 seconds. Set
`options.chart.currentTimeLine.display = false` to hide it. To change the refresh interval, set
`options.chart.currentTimeLine.updateInterval` and call `ganttInstance.startNowTimer()`.

## Resize task-list columns

Drag a header divider to resize a column. Left and Right resize the focused handle; hold Shift for one-pixel steps.
Double-click a divider to restore the configured width.

Runtime widths are not saved by default. Set `options.taskList.persistColumnWidths = true` to save them in local
storage; use `options.taskList.persistKey` to namespace the saved value.

Related: [task model and options](../reference/task-model-and-options.md), [update tasks](update-tasks.md),
[README](../../README.md), [documentation index](../index.md).
