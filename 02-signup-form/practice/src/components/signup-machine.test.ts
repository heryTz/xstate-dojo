import { describe, expect, it } from "bun:test";
import { createActor, waitFor } from "xstate";
import { signupMachine } from "./signup-machine";
import { FakeApi } from "./api";
import { jest } from "bun:test";

function createSignupMachineActor(
  apiParams?: ConstructorParameters<typeof FakeApi>[0],
) {
  const api = new FakeApi(apiParams);
  return createActor(signupMachine, { input: { api } });
}

describe("signup machine", () => {
  it(`initial state is "editing", with empty fields and no errors`, () => {
    const actor = createSignupMachineActor();
    actor.start();
    expect(actor.getSnapshot().value).toBe("editing");
    const { api, ...payload } = actor.getSnapshot().context;
    expect(payload).toEqual({
      email: { value: "", error: null },
      password: { value: "", error: null },
    });
  });

  it(`update email`, () => {
    const actor = createSignupMachineActor();
    actor.start();
    actor.send({ type: "change.email", value: "test@yopmail.com" });
    expect(actor.getSnapshot().context.email.value).toBe("test@yopmail.com");
  });

  it(`no error when update valid email`, () => {
    const actor = createSignupMachineActor();
    actor.start();
    actor.send({ type: "change.email", value: "test@yopmail.com" });
    expect(actor.getSnapshot().context.email.error).toBeNull();
  });

  it(`show error when update with invalid email`, () => {
    const actor = createSignupMachineActor();
    actor.start();
    actor.send({ type: "change.email", value: "test@" });
    expect(actor.getSnapshot().context.email.error).toBe("Invalid email");
  });

  it(`remove error after update with valid email`, () => {
    const actor = createSignupMachineActor();
    actor.start();
    actor.send({ type: "change.email", value: "test@" });
    actor.send({ type: "change.email", value: "test@yopmail.com" });
    expect(actor.getSnapshot().context.email.error).toBeNull();
  });

  it(`update password`, () => {
    const actor = createSignupMachineActor();
    actor.start();
    actor.send({ type: "change.password", value: "123" });
    expect(actor.getSnapshot().context.password.value).toBe("123");
  });

  it(`show error when update with less than 8 characters`, () => {
    const actor = createSignupMachineActor();
    actor.start();
    actor.send({ type: "change.password", value: "123" });
    expect(actor.getSnapshot().context.password.error).toBe(
      "Password should be more than 8 characters",
    );
  });

  it(`remove error after update with valid password`, () => {
    const actor = createSignupMachineActor();
    actor.start();
    actor.send({ type: "change.password", value: "123" });
    actor.send({ type: "change.password", value: "12345678" });
    expect(actor.getSnapshot().context.password.error).toBeNull();
  });

  it(`change state "submitting" after submit with valid fields`, () => {
    const actor = createSignupMachineActor();
    actor.start();
    actor.send({ type: "change.email", value: "test@yopmail.com" });
    actor.send({ type: "change.password", value: "12345678" });
    actor.send({ type: "submit" });
    expect(actor.getSnapshot().value).toBe("submitting");
  });

  it(`keep state "editing" after submit with invalid fields`, () => {
    const actor = createSignupMachineActor();
    actor.start();
    actor.send({ type: "change.email", value: "test@" });
    actor.send({ type: "change.password", value: "123" });
    actor.send({ type: "submit" });
    expect(actor.getSnapshot().value).toBe("editing");
  });

  it(`change state "success" after successful API call`, async () => {
    const signupFn = jest.fn();
    const actor = createSignupMachineActor({ signupFn });
    actor.start();
    actor.send({ type: "change.email", value: "test@yopmail.com" });
    actor.send({ type: "change.password", value: "12345678" });
    actor.send({ type: "submit" });

    await waitFor(actor, (state) => state.matches("success"));
    expect(signupFn).toBeCalledWith({
      email: "test@yopmail.com",
      password: "12345678",
    });
  });
});
