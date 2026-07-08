// Stub auth client for development
export const authClient = {
  signUp: {
    email: async () => ({ error: null }),
  },
  signIn: {
    email: async () => ({ error: null }),
  },
}
