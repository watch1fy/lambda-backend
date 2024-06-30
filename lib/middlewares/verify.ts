import { Request, Response, NextFunction } from "express";
import { lucia } from "../lucia/lucia.js";
import type { User, Session } from "lucia";

/**
 * 
 * @description This is a middleware that verifies the session if present using lucia.
 * It sets the local user and session object on the express response object if the verification is sucessful.
 * Else it sets them to {null}. Further this middleware is used by other API endpoints to determine if the user auth was succesful or not.
 * @param {Request} req This is the express request object
 * @param {Response} res This is the express response object
 * @param {NextFunction} next This is the middleware function that can be called if this middleware has done executing.
 * @returns {Promise<void | Response<any, Record<string, any>>>} The execution of the next middleware function
 */
async function verifyLucia(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
  if (!sessionId) {
    res.locals.user = null;
    res.locals.session = null;
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    res.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize());
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