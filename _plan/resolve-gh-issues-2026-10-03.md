# Resolve GitHub issues (improvement tracker) — 2026-10-03

User-approved processing order: #15 slice 1 → #2 → #4 → #5+#6+#12 → #8 → #3+#9 → #7 → #11 → #13 → #14.
(#10 event delegation is intentionally out of this order; left open, pairs with #9 later.)

One conventional commit per issue, each closes its issue, each UX issue lands with its spec
(#15 definition of done). Tests must be green before each commit. `npm run build` before testing
(cypress pages load dist/ bundles). Suite: `npx cypress run --browser chrome --config baseUrl=http://localhost:8085`
(http-server serving repo root on 8085).

## Fact corrections found during recon (vs. issue text)
- #2: NaN no longer reproduces at HEAD (pure-computed refactor already fixed the recursion era
  behavior; immediate geometry watcher runs in created() before first render with valid timePerPixel).
  Resolution = defensive hardening + automated console-error net.
- #7: Grid.vue already renders `grid-line-time` + recenter; missing = options, timer refresh,
  hide-outside-window, docs.
- #11: TaskListHeader already drag-resizes columns live; missing = keyboard, dblclick reset,
  min/max clamp, persistence option, terminal event; plus a real addEventListener/removeEventListener
  bind leak bug.

## Commits
1. test(cypress): fail suite on console errors/warnings — support/index.js capture (#15 slice 1)
2. fix(core): NaN-proof geometry — clamp width, default duration, timePerPixel guard (#2)
3. fix(style): default font stack; drop body computed-style read; root CSS + inline override (#4)
4. feat(chart): Tooltip.vue hosted in MainView, chart.tooltip option, format(task) (#5)
5. feat(chart): selection — state.selectedTaskId, selectTask/clearSelection, click wiring,
   chart-row--selected/task-list-item--selected styles, outside-click clears (#6)
6. feat(tasklist): hover — state.hoveredTaskId, --hover style keys, synced chart+list (#12)
7. security(sep): DOMPurify sanitize for the 3 v-html sites; interpolation stays default (#8)
8. perf(core): updateTask(id, patch) O(changed) API, pure dependencyTasks/dates computeds (#3)
9. perf(chart/tasklist): vertical row windowing via renderedTasks + task-list spacers (#9)
10. feat(chart): chart.currentTimeLine option {display, color, strokeWidth, updateInterval} (#7)
11. feat(tasklist): column resize keyboard/dblclick/clamp/persist + leak fix (#11)
12. feat(a11y): roles, aria-labels, roving keyboard nav, focus-visible, escape clears (#13)
13. chore(deps): drop resize-observer-polyfill, global + fallback (#14)

## Verification per commit
- npm run build && full cypress suite green
- Feature spec added with each UX commit
- code-reviewer pass after feature batch (#5/#6/#12), after #8, after #3/#9, and final
