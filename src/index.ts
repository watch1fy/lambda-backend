import serverless from 'serverless-http'
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from 'cors'
import cookie from 'cookie'
import { generateId } from "lucia";
import { User } from "./mongo/index.js";
import { lucia } from "./lucia/lucia.js";

const app: express.Application = express();
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}))
app.use(bodyParser.json({ strict: false }))

app.get("/health", (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({
    message: "The server responded 200 and is healthy",
  });
});

app.post("/guestsignin", async (req: Request, res: Response, next: NextFunction) => {
  const userGuestId = generateId(10)
  const _id = generateId(10)
  const user = new User({ _id, userGuestId })
  await user.save()

  const session = await lucia.createSession(_id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  return res.status(201)
    .cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
    .json({
      message: "Created new guest session"
    })
})

app.use((req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverless(app);
