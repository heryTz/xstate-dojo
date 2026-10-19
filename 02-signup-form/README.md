# 02 — Signup Form

## Goal

Build a signup form (email + password) whose data, validation, and submit flow live entirely in an XState machine.

The React component must not contain any `useState`, validation logic, or `async` code. It only:

- reads values, errors, and the current state from the machine
- sends events to the machine

## Requirements

1. The form has two fields: **email** and **password**. Both start empty.
2. Typing in a field sends a `CHANGE` event. The machine stores field values in `context`.
3. Validation rules:
   - **email** must contain an `@`
   - **password** must be at least 8 characters
4. Clicking **Submit** with invalid fields does not submit. It shows the error message under each invalid field.
5. Clicking **Submit** with valid fields moves the form to **submitting** and calls a fake API:
   - it resolves after 1 second
   - it rejects with `"Email already taken"` if the email is `taken@example.com`
6. While **submitting**:
   - fields and the **Submit** button are disabled
   - the UI displays `"Submitting…"`
7. On success, the form moves to **success** and the UI displays `"Welcome, <email>!"`.
8. On failure, the form moves to **error** and the UI displays the error message. From **error**:
   - editing a field returns to **editing**
   - clicking **Retry** submits again with the same values
9. The fake API is its own function, outside the machine, so tests can replace it.

## Acceptance criteria

- [x] Initial state is `editing`, with empty fields and no errors.
- [ ] `CHANGE` updates the matching field in `context`.
- [ ] `SUBMIT` with invalid fields stays in `editing` and sets the errors.
- [ ] `SUBMIT` with valid fields → `submitting`.
- [ ] Successful API call → `success`.
- [ ] Failed API call → `error`, with the error message in `context`.
- [ ] `RETRY` in `error` → `submitting`.
- [ ] `CHANGE` in `error` → `editing`.
- [ ] Events sent while `submitting` (`CHANGE`, `SUBMIT`) do nothing.
- [ ] The component has no conditional logic beyond rendering.

## Bonus

- Validate each field when it loses focus (`BLUR`), and only show its error after the field has been touched.
- Disable **Submit** while the form is invalid, using `state.can({ type: 'SUBMIT' })`.
- Add a **Cancel** button during `submitting` that goes back to `editing` and stops the pending API call.
