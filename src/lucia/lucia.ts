import { Lucia, TimeSpan } from "lucia";
import { adapter } from "./adapter";

export const lucia: Lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production"
    }
  },
  sessionExpiresIn: new TimeSpan(2, "d")
});

// IMPORTANT!
declare module "lucia" {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface Register {
    Lucia: typeof lucia;
  }
}