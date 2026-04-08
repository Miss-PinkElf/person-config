---
name: writing-plans
description: Use when the user already has approved requirements or a design and now needs an implementation plan before coding. Trigger for requests like "make a plan", "break this into steps", "implementation roadmap", or any multi-file change that should be planned before execution.
---

# Writing Plans

Turn an approved design into an execution-ready implementation plan.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

## Hard gate

Do NOT start editing code while writing the plan. If the request is still under-specified, return to `brainstorming` first.

## Goal

Write a plan that a low-context but capable implementer can follow without guessing:

- what to change
- where to change it
- in what order
- how to verify each step
- where to stop and report progress

Default save path: `docs/plans/YYYY-MM-DD-<feature-name>-plan.md`  
User preferences override the default.

## Scope Check

If the design still covers multiple independent subsystems, split it into separate plans or clearly separated phases. A plan should produce coherent, testable progress instead of one giant blob of work.

## Planning workflow

1. **Restate the mission**
   - Goal
   - constraints
   - non-goals
   - assumptions you are making

2. **Map files before tasks**
   - List the files to create or modify.
   - Note the responsibility of each file.
   - If boundaries are unclear, fix that in the plan before decomposing into tasks.

3. **Decompose into tasks with real checkpoints**
   - Each task should produce a meaningful unit of progress.
   - Prefer tasks that can be reviewed and verified independently.
   - Order tasks so later work depends on stable earlier work.

4. **Break each task into bite-sized steps**
   - Each step should usually be one action that takes a few minutes.
   - Good steps are explicit enough that an implementer can execute them directly.
   - Bad steps hide multiple decisions inside vague text.

5. **Plan verification as part of the work**
   - Include the exact test, check, or manual validation that proves the task is done.
   - Use TDD when it materially improves correctness:
     - pure logic
     - data transforms
     - parser/mapping behavior
     - bug fixes with a reproducible failure
   - Do not force fake TDD for work that is mostly wiring, exploration, or UI shaping. Use the strongest realistic validation for the task.

6. **Leave execution-ready handoff notes**
   - Call out blockers, migrations, rollout concerns, or sequencing hazards.
   - End by asking whether to execute with `executing-plans`.

## Plan structure

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Constraints / Non-goals:**
- ...

**Key Files:**
- `path/to/file` — why it matters
- `path/to/other_file` — why it matters

---
## Task 1: [Short task title]

**Outcome:** [What is true when this task is done]

**Files:**
- Create: `exact/path/to/new_file`
- Modify: `exact/path/to/existing_file`
- Verify: `exact/path/to/test_or_check`

- [ ] Step 1: ...
- [ ] Step 2: ...
- [ ] Step 3: ...

**Verification:**
- Run: `exact command if known`
- Expect: [clear success signal]

**Notes / Risks:**
- ...
```

## Quality bar

- Use exact file paths whenever you can.
- Prefer concrete commands over hand-wavy "test this".
- Explain why a task exists if that is not obvious.
- Keep the plan DRY and realistic.
- Do not smuggle major design changes into the plan without calling them out.
- If the best verification is manual, say exactly what to click, observe, or compare.

## Execution Handoff

After saving the plan, say:

> "Plan complete and saved to `<path>`. If you want, I can switch to `executing-plans` and start implementing it."

`executing-plans` is the only workflow skill this one should hand off to.
