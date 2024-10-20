import { Lucia } from "lucia";
import { adapter } from "./adapter.js";

/**
 * @description Lucia initialization to be used for authentication.
 */
export const lucia: Lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
      // sameSite is "none" when it is in production/deployed on aws
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }
  }
});

// IMPORTANT!
declare module "lucia" {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface Register {
    Lucia: typeof lucia;
  }
}