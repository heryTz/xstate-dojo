import { assign, fromPromise, setup } from "xstate";
import { produce } from "immer";
import { FakeApi, type Api } from "./api";

type Field<T> = {
  value: T;
  error: string | null;
};

type SignupContext = {
  api: Api;
  email: Field<string>;
  password: Field<string>;
  error: string | null;
};

type SignupInput = {
  api?: Api;
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
  | { type: "submit" }
  | { type: "retry" };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signupApiActor = fromPromise<
  unknown,
  { api: Api; data: { email: string; password: string } }
>(async ({ input }) => {
  return input.api.signup(input.data);
});

export const signupMachine = setup({
  types: {
    context: {} as SignupContext,
    events: {} as SignupEvent,
    input: {} as SignupInput,
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
  context: ({ input }) => ({
    api: input.api ?? new FakeApi(),
    email: field(""),
    password: field(""),
    error: null,
  }),
  states: {
    editing: {
      on: {
        submit: {
          guard: "isValid",
          target: "submitting",
        },
      },
    },
    submitting: {
      on: {
        "change.*": {},
      },
      invoke: {
        src: "signupApiActor",
        input: ({ context }) => ({
          api: context.api,
          data: {
            email: context.email.value,
            password: context.password.value,
          },
        }),
        onDone: {
          target: "success",
        },
        onError: {
          target: "error",
          actions: assign(({ context, event }) =>
            produce(context, (draft) => {
              draft.error = (event.error as Error).message;
            }),
          ),
        },
      },
    },
    success: {},
    error: {
      on: {
        retry: {
          target: "submitting",
        },
      },
    },
  },
  on: {
    "change.email": {
      target: ".editing",
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
      target: ".editing",
      actions: assign(({ context, event }) =>
        produce(context, (draft) => {
          draft.password.value = event.value;
          if (event.value.length >= 8) {
            draft.password.error = null;
          } else {
            draft.password.error = "Password should be more than 8 characters";
          }
        }),
      ),
    },
  },
});
