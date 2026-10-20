import { describe, expect, it } from "bun:test";
import { createActor } from "xstate";
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
});
