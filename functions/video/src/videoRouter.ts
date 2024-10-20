import express, { Router, Request, Response } from "express";
import { AWS_PUT_VIDEO_BUCKET, AWS_REGION } from '../../../lib/constants.js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
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

  // #swagger.tags = ['Video']
  // #swagger.summary = 'This is an endpoint that checks if the lambda is working fine or not.'
  // #swagger.description = 'This is an endpoint that checks if the lambda is working fine or not. It return 200 if the server is healthy else return 500(Internal Server Error)'


  /*
    #swagger.responses[200] = {
      description: 'Video lambda function is healthy.',
      schema: { message: 'The server responded 200 and is healthy' }
    } 
  */

  /*
    #swagger.responses[500] = {
      description: 'Internal Server Error.'
    } 
  */
  return res.status(200).json({
    message: "The server responded 200 and is healthy",
  });
});

videoRouter.post("/upload", async (req: Request, res: Response) => {

  // #swagger.tags = ['Video']
  // #swagger.summary = 'This is an endpoint that creates a pre-signed upload link to watchify s3 bucket.'
  // #swagger.description = 'This is an endpoint that creates a pre-signed upload link to watchify s3 bucket. It rejects the req if the upload file type is not a video file. The link expires in 2 minutes'


  /*
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'This is a required parameter that has two attributes filename to be uploaded and the extension to the file, fileExtenstion. They are used to created the key for the file in s3 bucket and to check for valid video file type.',
      required: 'true',
      schema: {
        filename: 'some video filename',
        fileExtension: 'MOV/mp4 etc'
      }
    }
  */
  const { filename, fileExtension }: { filename: string, fileExtension: string } = req.body

  if (
    !fileExtension ||
    !mime.getType(fileExtension)?.startsWith('video/') ||
    !filename
  )

    /*
      #swagger.responses[400] = {
        description: 'Returns 400, that means the file type was not a valid video file format or one of the parameter fileExtion/filename was missing.',
        schema: { 
          message: 'Incorrect body',
        }
      } 
    */
    return res.status(400).json({
      message: 'Incorrect body'
    })

  if (!res.locals?.user || !res.locals?.session)

    /*
      #swagger.responses[401] = {
        description: 'Returns 401 (unauthorized), that means the session that the user sent was invalid. Hence the user was not authorized. One or more of the local session attributes were not present on the express reponse object.',
        schema: { 
          message: 'Session not found',
        }
      } 
    */
    return res.status(401).json({
      message: 'Session not found'
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

    /*
      #swagger.responses[503] = {
        description: 'Could not generate PUT video url. This may be an error with the server or related to aws sdk.',
        schema: { 
          message: 'Could not generate PUT video url',
        }
      } 
    */
    return res.status(503).json({
      message: e.message || 'Could not generate PUT video url'
    })
  }

  /*
    #swagger.responses[201] = {
      description: 'Successfully created a pre-signed PUT (upload) url to upload the video file to the s3 bucket.',
      schema: { 
        message: 'Generated video put url',
        url: '<pre-signed-url>'
      }
    } 
  */
  return res.status(201)
    .json({
      message: "Generated video put url",
      url
    })
})

videoRouter.use((req: Request, res: Response) => {
  return res.status(404).json({
    message: "Not Found",
  });
});

export default videoRouter;
