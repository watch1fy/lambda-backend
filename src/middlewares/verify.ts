import { Request, Response, NextFunction } from "express";
import { lucia } from "../lucia/lucia.js";
import type { User, Session } from "lucia";
import deleteSessionUser from "../lib/functions/deleteUser.js";

async function verifyLucia(req: Request, res: Response, next: NextFunction) {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
  if (!sessionId) {
    res.locals.user = null;
    res.locals.session = null;
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    // Deleting and ending the session when the session tries to refresh
    // session.fresh indicates if the session is trying to refresh or not 
    await deleteSessionUser(user.id)
    res.appendHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize());
  }
  if (!session) {
    res.appendHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize());
  }
  res.locals.user = user;
  res.locals.session = session;
  return next();
}

declare global {
  namespace Express {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
  }
}

export default verifyLucia;