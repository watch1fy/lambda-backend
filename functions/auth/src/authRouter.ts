import express, { Router, Request, Response, NextFunction } from "express";
import { lucia } from "../../../lib/lucia/lucia.js";
import { User } from "../../../lib/mongo/index.js";
import { generateId } from "lucia";

const authRouter: express.Router = Router();


authRouter.get("/health", (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({
    message: "The server responded 200 and is healthy",
  });
});

authRouter.post("/guestsignin", async (req: Request, res: Response, next: NextFunction) => {
  const userGuestId = generateId(10)
  const _id = generateId(10)
  const user = new User({ _id, userGuestId })
  await user.save()

  const session = await lucia.createSession(_id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  req.headers.origin ? sessionCookie.attributes.domain = new URL(req.headers.origin).hostname : null
  res.setHeader('Set-Cookie', sessionCookie.serialize())

  return res.status(201)
    .json({
      message: "Created new guest session"
    })
})

authRouter.get("/verifysession", async (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user || !res.locals.session)
    return res.status(401).json({
      message: "Session not found"
    })

  return res.status(200)
    .json({
      message: "Session exists"
    })
})

authRouter.use((req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export default authRouter;