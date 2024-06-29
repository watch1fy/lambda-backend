import express, { Router, Request, Response } from "express";
import { AWS_PUT_VIDEO_BUCKET, AWS_REGION } from '../../../lib/constants.js';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import mime from "mime";

const videoRouter: express.Router = Router()

const s3Client: S3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY as string
  }
})

videoRouter.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "The server responded 200 and is healthy",
  });
});

videoRouter.post("/upload", async (req: Request, res: Response) => {
  const { filename, fileExtension }: { filename: string, fileExtension: string } = req.body

  if (
    !fileExtension ||
    !mime.getType(fileExtension)?.startsWith('video/') ||
    !filename
  )
    return res.status(400).json({
      message: 'Incorrect body'
    })

  if (!res.locals?.user || !res.locals?.session)
    return res.status(401).json({
      message: 'No user/guest session found'
    })

  const session = res.locals.session;

  const command = new PutObjectCommand({
    Bucket: AWS_PUT_VIDEO_BUCKET,
    Key: `session-${session.id}/${filename}.${fileExtension}`
  })

  let url: string
  try {
    url = await getSignedUrl(s3Client, command, { expiresIn: 120 });
  } catch (e) {
    return res.status(503).json({
      message: e.message || 'Could not generate PUT video url'
    })
  }

  return res.status(201)
    .json({
      message: "Generated video put url",
      url
    })
})

videoRouter.use((res: Response) => {
  return res.status(404).json({
    message: "Not Found",
  });
});

export default videoRouter;
