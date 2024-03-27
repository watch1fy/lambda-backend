import { Request, Response, NextFunction } from "express";
import { verifyRequestOrigin } from "lucia";

async function csrfLucia(req: Request, res: Response, next: NextFunction) {
  if (req.method === "GET") {
    return next();
  }
  const originHeader = req.headers.origin ?? null;
  // NOTE: You may need to use `X-Forwarded-Host` instead

  // Determining if it is a forwarded req like with a reverse proxy or not
  const useXForwardedHost = req.headers['X-Forwarded-Host'] !== undefined;
  // Conditionally accessing the original hostname by useXForwardedHos
  const hostHeader = (useXForwardedHost ? req.headers['X-Forwarded-Host'] as string : req.headers.host) ?? null;

  if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
    return res.status(403).end();
  }
}

export default csrfLucia;
