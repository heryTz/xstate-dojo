import { describe, expect, it } from "bun:test";
import { createActor, waitFor } from "xstate";
import { signupMachine } from "./signup-machine";

describe("signup machine", () => {
  it(`initial state is "editing", with empty fields and no errors`, () => {
    const actor = createActor(signupMachine);
    actor.start();
    expect(actor.getSnapshot().value).toBe("editing");
    expect(actor.getSnapshot().context).toEqual({
      email: { value: "", error: null },
      password: { value: "", error: null },
    });
  });

  it(`update email`, () => {
    const actor = createActor(signupMachine);
    actor.start();
    actor.send({ type: "change.email", value: "test@yopmail.com" });
    expect(actor.getSnapshot().context.email.value).toBe("test@yopmail.com");
  });

  it(`no error when update valid email`, () => {
    const actor = createActor(signupMachine);
    actor.start();
    actor.send({ type: "change.email", value: "test@yopmail.com" });
    expect(actor.getSnapshot().context.email.error).toBeNull();
  });

  it(`show error when update with invalid email`, () => {
    const actor = createActor(signupMachine);
    actor.start();
    actor.send({ type: "change.email", value: "test@" });
    expect(actor.getSnapshot().context.email.error).toBe("Invalid email");
  });

  it(`remove error after update with valid email`, () => {
    const actor = createActor(signupMachine);
    actor.start();
    actor.send({ type: "change.email", value: "test@" });
    actor.send({ type: "change.email", value: "test@yopmail.com" });
    expect(actor.getSnapshot().context.email.error).toBeNull();
  });

  it(`update password`, () => {
    const actor = createActor(signupMachine);
    actor.start();
    actor.send({ type: "change.password", value: "123" });
    expect(actor.getSnapshot().context.password.value).toBe("123");
  });

  it(`show error when update with less than 8 characters`, () => {
    const actor = createActor(signupMachine);
    actor.start();
    actor.send({ type: "change.password", value: "123" });
    expect(actor.getSnapshot().context.password.error).toBe(
      "Password should be more than 8 characters",
    );
  });

  it(`remove error after update with valid password`, () => {
    const actor = createActor(signupMachine);
    actor.start();
    actor.send({ type: "change.password", value: "123" });
    actor.send({ type: "change.password", value: "12345678" });
    expect(actor.getSnapshot().context.password.error).toBeNull();
  });

  it(`change state "submitting" after submit with valid fields`, () => {
    const actor = createActor(signupMachine);
    actor.start();
    actor.send({ type: "change.email", value: "test@yopmail.com" });
    actor.send({ type: "change.password", value: "12345678" });
    actor.send({ type: "submit" });
    expect(actor.getSnapshot().value).toBe("submitting");
  });

  it(`keep state "editing" after submit with invalid fields`, () => {
    const actor = createActor(signupMachine);
    actor.start();
    actor.send({ type: "change.email", value: "test@" });
    actor.send({ type: "change.password", value: "123" });
    actor.send({ type: "submit" });
    expect(actor.getSnapshot().value).toBe("editing");
  });

  it(`change state "success" after successful API call`, async () => {
    const actor = createActor(signupMachine);
    actor.start();
    actor.send({ type: "change.email", value: "test@yopmail.com" });
    actor.send({ type: "change.password", value: "12345678" });
    actor.send({ type: "submit" });

    expect(actor.getSnapshot().value).toBe("success");
    // await waitFor(actor, (state) => state.matches("success"));
  });
});
