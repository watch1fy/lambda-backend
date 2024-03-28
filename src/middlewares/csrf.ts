import { Request, Response, NextFunction } from "express";
import { verifyRequestOrigin } from "lucia";
import { allowedDomains } from "../lib/constants.js";

async function csrfLucia(req: Request, res: Response, next: NextFunction) {
  if (req.method === "GET") {
    return next();
  }
  const originHeader = req.headers.origin ?? null;

  if (!originHeader || !verifyRequestOrigin(originHeader, allowedDomains)) {
    return res.status(403).end();
  }

  return next()
}

export default csrfLucia;
