import { Request, Response, NextFunction } from "express";
import { verifyRequestOrigin } from "lucia";
import { ALLOWED_DOMAINS } from "../constants.js";

/**
 * 
 * @description This is a middleware that is used to prevent csrf attacks (cross-site resource forgery).
 * It does this by verifying request origin. It checks if the origin where the req was originated is allowed to
 * make the req or not.
 * @param {Request} req This is the express request object
 * @param {Response} res This is the express response object
 * @param {NextFunction} next This is the middleware function that can be called if this middleware has done executing.
 * @returns {Promise<void | Response<any, Record<string, any>>>} The execution of the next middleware function
 */
async function csrfLucia(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> {
  if (req.method === "GET") {
    return next();
  }
  const originHeader = req.headers.origin ?? null;

  if (!originHeader || !verifyRequestOrigin(originHeader, ALLOWED_DOMAINS)) {
    return res.status(403).end();
  }

  return next()
}

export default csrfLucia;
