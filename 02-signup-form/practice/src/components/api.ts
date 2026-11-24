import type { jest } from "bun:test";

export interface Api {
  signup(input: {
    email: string;
    password: string;
  }): Promise<{ id: string; email: string }>;
}

export class FakeApi implements Api {
  constructor(private params?: { signupFn?: jest.Mock<Api["signup"]> }) {}

  async signup(input: {
    email: string;
    password: string;
  }): Promise<{ id: string; email: string }> {
    return (
      this.params?.signupFn?.(input) ??
      new Promise<{ id: string; email: string }>((resolve, reject) => {
        setTimeout(() => {
          if (input.email === "failed@example.com") {
            reject(new Error('"failed@example.com" already used'));
          }
          resolve({ id: Date.now().toString(), email: input.email });
        }, 300);
      })
    );
  }
}
