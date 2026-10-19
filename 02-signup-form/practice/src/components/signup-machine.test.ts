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
});
