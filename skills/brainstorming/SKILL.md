---
name: brainstorming
description: Use this before turning an idea into implementation whenever scope, requirements, or approach still need alignment. Trigger for new features, behavior changes, refactors, workflow design, or any multi-step build request where you should clarify goals and trade-offs before planning or coding.
---

# Brainstorming

Turn a fuzzy request into an approved design that is ready for planning.

**Announce at start:** "I'm using the brainstorming skill to clarify the design before we plan or implement."

<HARD-GATE>
Do NOT write code, edit files, scaffold a project, or create an implementation plan until you have presented a design and the user has approved it.
</HARD-GATE>

## What good brainstorming produces

Leave the conversation with:

- confirmed goals and constraints
- clear scope and non-goals
- 2-3 viable approaches with trade-offs
- one recommended direction
- an explicit user approval to move into planning

## Workflow

1. **Explore context first**
   - Read the relevant files, docs, and surrounding patterns.
   - If the user already gave enough detail, do not ask filler questions.

2. **Check scope**
   - If the request actually contains multiple independent systems, split it into smaller tracks.
   - Brainstorm the first concrete track instead of pretending one design can cleanly cover everything.

3. **Ask clarifying questions only where the answer matters**
   - Ask **one question at a time**.
   - Prefer 2-4 concrete options when the decision space is known.
   - Focus on purpose, constraints, success criteria, and non-goals.
   - If the missing detail is low-risk, state a reasonable assumption instead of blocking.

4. **Propose approaches**
   - Present 2-3 approaches.
   - Lead with your recommendation.
   - Explain trade-offs in plain language: complexity, flexibility, migration cost, failure modes, and testing impact.

5. **Present the design**
   - Scale the detail to the job: short for small changes, fuller for architecture work.
   - Cover the pieces that will matter later in planning:
     - goal
     - in-scope / out-of-scope
     - components or modules involved
     - data/control flow
     - risks / edge cases
     - validation strategy

6. **Get explicit approval**
   - Wait for a clear "yes", approval, or requested revisions.
   - If the user revises the idea, loop back and update the design.

7. **Optional artifact**
   - If useful, save the approved design to a file.
   - Default path: `docs/designs/YYYY-MM-DD-<topic>-design.md`
   - User preferences override the default.

8. **Transition**
   - If the user wants to proceed, invoke `writing-plans`.
   - Do not invoke unrelated implementation skills from here.

## Design checklist

Use this as your internal checklist before asking for approval:

- Can you explain the problem in one paragraph?
- Is the scope small enough to implement in one plan?
- Are module boundaries clear?
- Are the main risks named?
- Is there an obvious way to validate success?
- Would another agent be able to turn this into a plan without guessing?

## Output template

Use a structure like this when presenting the design:

```md
## Proposed Direction

### Goal
...

### Scope
- In:
- Out:

### Recommended Approach
...

### Alternatives Considered
1. ...
2. ...

### Main Risks
- ...

### Validation
- ...
```

## Key Principles

- **Design before planning** - even small tasks deserve a short alignment pass
- **One question at a time** - avoid interrogating the user
- **Recommendation, not just options** - help the user choose
- **Keep it lean** - remove speculative complexity
- **Name assumptions** - hidden assumptions become implementation bugs
- **Approval is the handoff gate** - no plan and no code before the design is accepted
