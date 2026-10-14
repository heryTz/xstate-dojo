import { describe, expect, it } from "bun:test";
import { createActor } from "xstate";
import { toggleMachine } from "./toggle-machine";

describe("toggle machine", () => {
  it(`use "off" as initial state`, () => {
    const actor = createActor(toggleMachine);
    actor.start();
    expect(actor.getSnapshot().value).toBe("off");
  });

  it(`switch from "off" to "on" when toggle`, () => {
    const actor = createActor(toggleMachine);
    actor.start();
    actor.send({ type: "toggle" });
    expect(actor.getSnapshot().value).toBe("on");
  });

  it(`switch from "on" to "off" when toggle`, () => {
    const actor = createActor(toggleMachine);
    actor.start();
    actor.send({ type: "toggle" });
    actor.send({ type: "toggle" });
    expect(actor.getSnapshot().value).toBe("off");
  });

  it(`break from  "off" to "broken"`, () => {
    const actor = createActor(toggleMachine);
    actor.start();
    actor.send({ type: "break" });
    expect(actor.getSnapshot().value).toBe("broken");
  });

  it(`break from  "on" to "broken"`, () => {
    const actor = createActor(toggleMachine);
    actor.start();
    actor.send({ type: "toggle" });
    actor.send({ type: "break" });
    expect(actor.getSnapshot().value).toBe("broken");
  });

  it(`toggle in "broken" does nothing`, () => {
    const actor = createActor(toggleMachine);
    actor.start();
    actor.send({ type: "break" });
    actor.send({ type: "toggle" });
    expect(actor.getSnapshot().value).toBe("broken");
  });

  it(`repair in "broken" to "off"`, () => {
    const actor = createActor(toggleMachine);
    actor.start();
    actor.send({ type: "break" });
    actor.send({ type: "repair" });
    expect(actor.getSnapshot().value).toBe("off");
  });
});
