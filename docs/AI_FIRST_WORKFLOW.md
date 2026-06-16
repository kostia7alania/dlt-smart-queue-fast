# AI-First Workflow

This repository is designed so a new AI assistant can start from an empty chat and
continue work without relying on previous conversation context.

## New Chat Bootstrap

Give any AI assistant this prompt:

```text
Read AGENTS.md, .specify/memory/constitution.md, docs/TASK_INDEX.md, and the active
specs/* feature. Continue from the first unchecked task in tasks.md. Do not implement
outside the current spec-driven workflow unless I explicitly ask.
```

## Source of Truth Order

1. `AGENTS.md` - project-wide constraints and non-goals
2. `.specify/memory/constitution.md` - Spec Kit governance and quality gates
3. `docs/PRODUCT_SPEC.md` - product goal and MVP boundaries
4. `docs/idea.md` - raw DLT observations and upstream API details
5. `docs/TASK_INDEX.md` - current active feature and next task
6. `specs/*/spec.md` - behavior requirements
7. `specs/*/plan.md` - technical approach
8. `specs/*/tasks.md` - executable checklist

## Spec Kit Commands

Use these when working in Windsurf:

- `/speckit.specify` - create or revise a feature spec
- `/speckit.clarify` - resolve ambiguous requirements
- `/speckit.plan` - create technical plan artifacts
- `/speckit.tasks` - generate implementation tasks
- `/speckit.analyze` - check consistency before implementation
- `/speckit.implement` - execute tasks

## Practical Rule

Small one-line fixes can be direct. Anything that changes product behavior, API
contracts, data model, or UI flow should update the active spec/plan/tasks first.
