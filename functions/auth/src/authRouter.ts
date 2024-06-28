import express, { Router, Request, Response } from "express";
import { lucia } from "../../../lib/lucia/lucia.js";
import { User } from "../../../lib/mongo/index.js";
import { generateId } from "lucia";
import { generateRamdomName, generateAvatarURL } from "../../../lib/functions/index.js";

const authRouter: express.Router = Router();

authRouter.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "The server responded 200 and is healthy",
  });
});

authRouter.post("/guestsignin", async (req: Request, res: Response) => {
  if (res.locals?.session || res.locals?.user)
    return res.status(409).json({
      message: "Session already exists"
    })

  const userId = generateId(10)
  const _id = generateId(10)

  const name = generateRamdomName()
  const avatarUrl = generateAvatarURL(name)

  const user = new User({
    _id,
    userId,
    name,
    avatarUrl
  })
  await user.save()

  console.log()

  const session = await lucia.createSession(_id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  res.setHeader('Set-Cookie', sessionCookie.serialize())

  return res.status(201)
    .json({
      message: "Created new guest session",
      user
    })
})

authRouter.get("/verifysession", async (req: Request, res: Response) => {
  if (!res.locals?.user || !res.locals?.session)
    return res.status(401).json({
      message: "Session not found"
    })

  return res.status(200)
    .json({
      message: "Session exists"
    })
})

authRouter.use((req: Request, res: Response) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export default authRouter;