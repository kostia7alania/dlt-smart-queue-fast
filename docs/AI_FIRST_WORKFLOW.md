# AI-First Workflow

This repository is designed so a new AI assistant can start from an empty chat and
continue work without relying on previous conversation context.

## New Chat Bootstrap

Give any AI assistant this prompt:

```text
Read AGENTS.md, docs/CONSTITUTION.md, docs/TASK_INDEX.md and docs/PROJECT_STATUS.md.
If a feature is active, read its spec/plan/tasks and continue from the first
unchecked task. Otherwise select a ready item from docs/BACKLOG.md and specify
it before implementation. Verify branch/worktree state before editing.
```

## Source of Truth Order

1. `AGENTS.md` - project-wide constraints and non-goals
2. `docs/CONSTITUTION.md` - project governance and quality gates
3. `docs/PRODUCT_SPEC.md` - product goal and MVP boundaries
4. `docs/PROJECT_STATUS.md` - checked implementation, delivery state and limitations
5. `docs/TASK_INDEX.md` and `docs/BACKLOG.md` - active feature and next priorities
6. `specs/*/spec.md`, `plan.md`, `tasks.md` - behavior, approach and checklist
7. `docs/idea.md` and dated research - historical observations, not current priorities

## Spec-Driven Loop

The workflow is plain Markdown, so it works with any AI assistant or editor.
No specific tooling is required.

- **Specify** - create or revise `specs/<feature>/spec.md` from the requirements
- **Clarify** - resolve ambiguous requirements before planning
- **Plan** - capture the technical approach in `specs/<feature>/plan.md`
- **Tasks** - break the plan into a checklist in `specs/<feature>/tasks.md`
- **Implement** - work the checklist top to bottom, marking `- [x]` after validation

To continue an in-progress feature, tell the assistant to "continue from the first
unchecked task in `tasks.md`". To start a new feature, create the next
`specs/NNN-<slug>/` directory and seed it with spec/plan/tasks following the same
structure as the existing feature.

Use full feature directory names: historical parallel work produced multiple
015 and 016 specifications. Do not renumber existing directories. Preserve the
distinction between implemented code, deployment evidence and research proposals.

## Practical Rule

Small one-line fixes can be direct. Anything that changes product behavior, API
contracts, data model, or UI flow should update the active spec/plan/tasks first.
