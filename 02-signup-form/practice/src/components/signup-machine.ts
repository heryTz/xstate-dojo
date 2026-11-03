import { assign, fromPromise, setup } from "xstate";
import { produce } from "immer";
import { signupApi } from "./api";

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

type SignupEvent =
  | { type: "change.email"; value: string }
  | { type: "change.password"; value: string }
  | { type: "submit" };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signupApiActor = fromPromise(async () => {
  return signupApi({ email: "test", password: "123" });
});

export const signupMachine = setup({
  types: {
    context: {} as SignupContext,
    events: {} as SignupEvent,
  },
  guards: {
    isValid: ({ context }) => {
      return context.email.error === null && context.password.error === null;
    },
  },
  actors: { signupApiActor },
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
        "change.password": {
          actions: assign(({ context, event }) =>
            produce(context, (draft) => {
              draft.password.value = event.value;
              if (event.value.length >= 8) {
                draft.password.error = null;
              } else {
                draft.password.error =
                  "Password should be more than 8 characters";
              }
            }),
          ),
        },
        submit: {
          guard: "isValid",
          target: "submitting",
        },
      },
    },
    submitting: {
      invoke: {
        src: "signupApiActor",
        onDone: {
          target: "success",
          actions: ({ event }) => {
            console.log("action=>", event.output);
          },
        },
      },
    },
    success: {},
  },
});
