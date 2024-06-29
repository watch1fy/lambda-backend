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

authRouter.post("/signin/guest", async (req: Request, res: Response) => {
  if (res.locals?.session || res.locals?.user)
    return res.status(409).json({
      message: "Session already exists"
    })

  try {

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

  } catch (error) {
    console.log("Error: ", error)
    res.status(500)
      .json({
        message: "Internal Server Error"
      })
  }

})

authRouter.get("/session-verify", async (req: Request, res: Response) => {
  if (!res.locals?.user || !res.locals?.session)
    return res.status(401).json({
      message: "Session not found"
    })

  return res.status(200)
    .json({
      message: "Session exists"
    })
})

authRouter.use((res: Response) => {
  return res.status(404).json({
    message: "Not Found",
  });
});

export default authRouter;