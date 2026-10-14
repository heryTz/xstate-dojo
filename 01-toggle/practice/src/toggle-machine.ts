import { setup } from "xstate";

export const toggleMachine = setup({}).createMachine({
  id: "toggle",
  initial: "off",
  states: {
    off: {
      on: {
        toggle: {
          target: "on",
        },
        break: {
          target: "broken",
        },
      },
    },
    on: {
      on: {
        toggle: {
          target: "off",
        },
        break: {
          target: "broken",
        },
      },
    },
    broken: {
      on: {
        repair: {
          target: "off",
        },
      },
    },
  },
});
