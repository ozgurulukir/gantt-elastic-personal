# Terminology alignment with industry standard — 2026-10-03

## Objective

Review the user-facing vocabulary (task fields, options, events, methods, docs) and align it
with mainstream Gantt-library conventions.

## Audit findings

Reference conventions:

- **Frappe Gantt** task object: `id, name, start, end, progress (0–100), dependencies (id[]), custom_class`
- **dhtmlxGantt**: `text, start_date, end_date, duration, progress (0–1), parent`, task types `task | project | milestone`

| Term (current) | Verdict | Rationale |
| --- | --- | --- |
| `progress` (internal task field, 0–100) | keep | already the industry-standard name/scale (Frappe uses 0–100 too); README already canonical |
| `percent` (legacy user-side field in vue.edit.html + fixtures, wired via `taskMapping.progress`) | adopt canonical | demos/fixtures should showcase the canonical vocabulary; mapping stays as the documented legacy path |
| `dependentOn` (task field) | **rename → `dependencies`** | no mainstream Gantt lib uses it; Frappe Gantt: `dependencies`; "dependentOn" is an adjective phrase, not a noun field |
| type values `task / project / milestone` | keep | exactly dhtmlxGantt's type vocabulary |
| `collapsed`, `parentId`, `label`, `start`, `end`, `duration` | keep | standard tree/gantt vocabulary; `label` is remappable via `taskMapping` for `name`/`text` conventions |
| `taskList.percent` (pane width %), `scroll.chart.percent` | keep | genuine percentages, not completion |
| events `chart-<type>-<action>`, `taskList-row-<action>` | keep | kebab domain-subject-action, Vue ecosystem convention |
| `updateTask / getTask / selectTask` | keep | standard API verbs |
| CSS `gantt-elastic__block--modifier` | keep | BEM |

## Changes

1. **src**: canonical `dependencies` field — `taskMapping` default `dependencies: 'dependencies'`,
   `mapTasks` maps it, `fillTasks` falls back to legacy `dependentOn`, `DependencyLines.vue` reads
   `dependencies`, `updateTask` translates legacy patch keys (`percent`→`progress`,
   `dependentOn`→`dependencies`).
2. **fixtures/examples**: canonical `progress` + `dependencies` everywhere except
   `tests/assets/standalone.html`, deliberately kept on legacy vocabulary as the
   backward-compat fixture (exercises `taskMapping` + `dependentOn` alias).
3. **tests**: update_task_spec patches canonical `progress`; new legacy-translation test;
   basic_spec asserts the `dependentOn` → `dependencies` normalization on the legacy fixture.
4. **README**: new "Task model" section documenting the canonical fields, the industry
   alignment, legacy aliases and the `taskMapping` escape hatch.

## Verification

`npm run build` + full cypress suite (35+ tests) green; rebuild dist (tracked); code-review pass.
