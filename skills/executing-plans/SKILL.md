---
name: executing-plans
description: Use when there is already a written implementation plan and the next job is to execute it carefully with checkpoints, verification, and blocker handling. Trigger for prompts like "implement this plan", "continue from the plan", or "carry out the roadmap".
---

# Executing Plans

Execute a written implementation plan carefully, transparently, and with strong verification.

**Announce at start:** "I'm using the executing-plans skill to implement this plan."

## Core rule

Do not blindly trust the plan just because it is written down. Review it first, then execute it task by task.

## Workflow

### Step 1: Load and Review Plan

1. Read the plan file.
2. Check for:
   - unclear steps
   - impossible sequencing
   - missing dependencies
   - risky assumptions
   - missing verification
3. If the plan has material problems, stop and raise them before coding.
4. If the plan is usable, create a task tracker and begin execution.

### Step 2: Execute Tasks

For each task in order:

1. Mark it `in_progress`.
2. Follow the planned steps closely, but keep thinking.
3. If a step is underspecified, choose the smallest sensible action that preserves the plan's intent.
4. Run the task-level verification before marking it done.
5. Mark it completed only when the expected success signal is real, not assumed.
6. Report progress at meaningful checkpoints instead of disappearing for a long time.

### Step 3: Handle blockers the right way

Stop and surface the issue when:

- the plan conflicts with the codebase
- a dependency is missing
- repeated verification keeps failing
- the next step would require guessing at an important design decision
- the plan needs to be amended, not merely interpreted

When blocked, report:

1. what you were trying to do
2. what happened
3. what you checked
4. the smallest next options

### Step 4: Finish cleanly

After all tasks are complete:

1. Run the final verification set for the changed area.
2. Summarize:
   - changed files
   - checks/tests run
   - remaining risks or follow-ups
3. If the user wants commit help, suggest a commit message or perform the commit only if explicitly requested.

## When to Stop and Ask for Help

**STOP executing immediately when:**
- Hit a blocker (missing dependency, test fails, instruction unclear)
- Plan has critical gaps preventing starting
- You don't understand an instruction
- Verification fails repeatedly

**Ask for clarification rather than guessing.**

## When to Revisit Earlier Steps

**Return to Review (Step 1) when:**
- Partner updates the plan based on your feedback
- Fundamental approach needs rethinking

**Don't force through blockers** - stop and ask.

## Remember
- Review first, then execute
- Follow the plan closely, but do not turn off judgment
- Don't skip verification
- Update visible progress as you go
- Stop when blocked; don't invent facts
- If the plan is no longer the right plan, say so explicitly
- Never do risky branch or git actions unless the user asked for them
