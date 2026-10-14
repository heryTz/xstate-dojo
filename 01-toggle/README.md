# 01 — Toggle

## Goal

Build a light switch whose behavior is driven entirely by an XState machine.

The React component must not contain any `useState`, `if`, or business logic. It only:

- reads the current state from the machine
- sends events to the machine

## Requirements

1. The light has two states: **off** and **on**. It starts **off**.
2. A **Toggle** button switches between **off** and **on**.
3. The UI displays the current state (`"The light is off"` / `"The light is on"`).
4. Add a **Break** button. Once the light is broken:
   - it goes into a **broken** state
   - **Toggle** no longer has any effect
   - the UI displays `"The light is broken"`
5. Add a **Repair** button that only works when the light is broken. Repairing puts the light back to **off**.
6. Buttons that have no effect in the current state must be **disabled**. Use `state.can(...)` to decide; don't hardcode state names in the component.
7. No `context` needed. This exercise is only about states, events, and transitions.

## Acceptance criteria

- [x] Initial state is `off`.
- [x] `TOGGLE` from `off` → `on`, and from `on` → `off`.
- [x] `BREAK` from `off` or `on` → `broken`.
- [x] `TOGGLE` in `broken` does nothing.
- [x] `REPAIR` in `broken` → `off`. `REPAIR` anywhere else does nothing.
- [x] Buttons are enabled or disabled according to `state.can(...)`.
- [x] The component has no conditional logic beyond rendering.

## Bonus

- Count how many times the light was toggled before breaking. Show the count in the UI. (This previews `context`, which comes in exercise 02.)
- Visualize your machine in the [Stately editor](https://stately.ai/editor).
