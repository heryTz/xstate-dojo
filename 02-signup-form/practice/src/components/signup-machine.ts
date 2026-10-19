import { setup } from "xstate";

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

export const signupMachine = setup({
  types: {
    context: {} as SignupContext,
  },
}).createMachine({
  id: "signup",
  initial: "editing",
  context: {
    email: field(""),
    password: field(""),
  },
  states: {
    editing: {},
  },
});
