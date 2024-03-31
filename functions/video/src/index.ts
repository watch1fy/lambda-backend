import serverless from 'serverless-http'
import express, { Request, Response, NextFunction, Router } from "express";
import bodyParser from "body-parser";
import cors from 'cors'
import helmet from 'helmet'
import csrfLucia from '../../../lib/middlewares/csrf.js';
import verifyLucia from '../../../lib/middlewares/verify.js';
import { ALLOWED_DOMAINS, AWS_PUT_VIDEO_BUCKET, AWS_REGION } from '../../../lib/constants.js';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import mime from 'mime'

const app: express.Application = express();
const videoRouter: express.Router = Router()

const s3Client: S3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY as string
  }
})

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

videoRouter.get("/health", (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({
    message: "The server responded 200 and is healthy",
  });
});

videoRouter.post("/video-put-url", async (req: Request, res: Response, next: NextFunction) => {
  const { filename, fileExtension }: { filename: string, fileExtension: string } = req.body

  if (
    !fileExtension ||
    !mime.getType(fileExtension)?.startsWith('video/') ||
    !filename
  )
    return res.status(400).json({
      message: 'Incorrect body'
    })

  if (!res.locals.user || !res.locals.session)
    return res.status(401).json({
      message: 'No user/guest session found'
    })

  const session = res.locals.session;

  const command = new PutObjectCommand({
    Bucket: AWS_PUT_VIDEO_BUCKET,
    Key: `session-${session.id}/${filename}-${Date.now()}.${fileExtension}`
  })

  let url: string
  try {
    url = await getSignedUrl(s3Client, command, { expiresIn: 600 });
  } catch (e) {
    return res.status(503).json({
      message: e.message || 'Could not generate get video url'
    })
  }

  return res.status(201)
    .json({
      message: "Generated video put url",
      url
    })
})

videoRouter.post("/video-get-url", async (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user || !res.locals.session)
    return res.status(401).json({
      message: 'No user/guest session found'
    })

  const command = new GetObjectCommand({
    Bucket: '',
    Key: ''
  })

  let url: string
  try {
    url = await getSignedUrl(s3Client, command);
  } catch (e) {
    return res.status(503).json({
      message: e.message || 'Could not generate get video url'
    })
  }

  return res.status(200)
    .json({
      message: "Generated video get url",
      url
    })
})

videoRouter.use((req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverless(app);
