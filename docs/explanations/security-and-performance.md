# Security and performance behavior

This page describes the rendering controls and row virtualization present in the source. For vulnerability reporting
instructions, use the repository's [Security Policy](../../SECURITY.md). Return to the [README](../../README.md) for the
project overview.

## HTML rendering

Task and column values are rendered as text by default. HTML rendering is opt-in through a task-list column's
`html: true` setting or `options.title.html`. Values that go through these HTML paths are sanitized with DOMPurify
before insertion. The default tooltip formatter also renders text.

Sanitization is a rendering control, not a reason to treat untrusted content as trusted. Enable HTML only where markup
is needed, and report sanitizer bypasses through the [private reporting path](../../SECURITY.md).

## Row virtualization

The chart and task list render the rows around the vertical viewport, with five overscan rows before and after it. The
repository's virtualization test loads 2,000 visible tasks and checks that the number of mounted chart and task-list
rows remains below 60 for its test viewport; this is a test case, not a general performance guarantee.

`getSVG()` and `getImage()` operate on the currently rendered main view. They do not render rows that virtualization has
left outside the current viewport.

Related: [task model and component reference](../reference/task-model-and-options.md),
[development and Cypress](../development.md), [README](../../README.md), [documentation index](../index.md).
