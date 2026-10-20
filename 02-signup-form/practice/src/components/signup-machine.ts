import { assign, setup } from "xstate";
import { produce } from "immer";

type Field<T> = {
  value: T;
  error: string | null;
};

type SignupContext = {
  email: Field<string>;
  password: Field<string>;
};

function field<T>(defaultValue: T): Field<T> {
  return {
    value: defaultValue,
    error: null,
  };
}

type SignupEvent = { type: "change.email"; value: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const signupMachine = setup({
  types: {
    context: {} as SignupContext,
    events: {} as SignupEvent,
  },
}).createMachine({
  id: "signup",
  initial: "editing",
  context: {
    email: field(""),
    password: field(""),
  },
  states: {
    editing: {
      on: {
        "change.email": {
          actions: assign(({ context, event }) =>
            produce(context, (draft) => {
              draft.email.value = event.value;
              if (EMAIL_REGEX.test(event.value)) {
                draft.email.error = null;
              } else {
                draft.email.error = "Invalid email";
              }
            }),
          ),
        },
      },
    },
  },
});
