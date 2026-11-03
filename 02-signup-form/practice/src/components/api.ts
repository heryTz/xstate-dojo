export function signupApi(input: { email: string; password: string }) {
  return new Promise<{ id: string; email: string }>((resolve) => {
    setTimeout(() => {
      resolve({ id: Date.now().toString(), email: input.email });
    }, 1_500);
  });
}
