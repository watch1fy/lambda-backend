import serverless from 'serverless-http'
import express, { Request, Response, NextFunction, Router } from "express";
import bodyParser from "body-parser";
import cors from 'cors'
import helmet from 'helmet'
import csrfLucia from '../../../lib/middlewares/csrf.js';
import verifyLucia from '../../../lib/middlewares/verify.js';
import videoRouter from './videoRouter.js';
import { ALLOWED_DOMAINS } from '../../../lib/constants.js';


const app: express.Application = express();


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
app.use('/video', videoRouter)



export const handler = serverless(app);
