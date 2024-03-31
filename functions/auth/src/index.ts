import serverless from 'serverless-http'
import express, { Request, Response, NextFunction, Router } from "express";
import bodyParser from "body-parser";
import cors from 'cors'
import helmet from 'helmet'
import { generateId } from "lucia";
import { User } from "../../../lib/mongo/index.js";
import { lucia } from "../../../lib/lucia/lucia.js";
import csrfLucia from '../../../lib/middlewares/csrf.js';
import verifyLucia from '../../../lib/middlewares/verify.js';
import { ALLOWED_DOMAINS } from '../../../lib/constants.js';

const app: express.Application = express();
const authRouter: express.Router = Router()

app.disable('x-powered-by')
app.use(cors({
  origin: ALLOWED_DOMAINS,
  credentials: true
}))
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ strict: false }))
app.use(csrfLucia)
app.use(verifyLucia)
app.use('/auth', authRouter)

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

export const handler = serverless(app);
