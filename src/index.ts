import serverless from "serverless-http";
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from 'cors'
const app: express.Application = express();

app.use(cors())
app.use(bodyParser.json({ strict: false }))

app.get("/health", (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({
    message: "The server responded 200 and is healthy",
  });
});

app.post("/guestsignin", (req: Request, res: Response, next: NextFunction) => {
  const body = req.body
})

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
