import serverless from 'serverless-http'
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from 'cors'
import helmet from 'helmet'
import { generateId } from "lucia";
import { User } from "./mongo/index.js";
import { lucia } from "./lucia/lucia.js";
import csrfLucia from './middlewares/csrf.js';
import verifyLucia from './middlewares/verify.js';
import { allowedDomains } from './lib/constants.js';

const app: express.Application = express();

app.disable('x-powered-by')
app.use(cors({
  origin: allowedDomains,
  credentials: true
}))
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ strict: false }))
app.use(csrfLucia)
app.use(verifyLucia)

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

  req.headers.origin ? sessionCookie.attributes.domain = new URL(req.headers.origin).hostname : null
  res.setHeader('Set-Cookie', sessionCookie.serialize())

  return res.status(201)
    .json({
      message: "Created new guest session"
    })
})

app.get("/verifysession", async (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user || !res.locals.session)
    return res.status(401).json({
      message: "Session not found"
    })

  return res.status(200)
    .json({
      message: "Session exists"
    })
})

app.use((req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverless(app);
