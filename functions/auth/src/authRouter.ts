import express, { Router, Response, Request } from "express";
import { lucia } from "../../../lib/lucia/lucia.js";
import { User } from "../../../lib/mongo/index.js";
import { generateId } from "lucia";
import { generateRamdomName, generateAvatarURL } from "../../../lib/functions/index.js";

const authRouter: express.Router = Router();

authRouter.get("/health", (req: Request, res: Response) => {

  // #swagger.tags = ['Auth']
  // #swagger.summary = 'This is an endpoint that checks if the lambda is working fine or not.'
  // #swagger.description = 'This is an endpoint that checks if the lambda is working fine or not. It return 200 if the server is healthy else return 500(Internal Server Error)'


  /* 
    #swagger.responses[200] = {
      description: 'Auth lambda function is healthy.',
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

authRouter.post("/signin/guest", async (req: Request, res: Response) => {

  // #swagger.tags = ['Auth']
  // #swagger.summary = 'This is an endpoint for guset sign in.'
  // #swagger.description = 'This is an endpoint for guest sign in and creation of guest session to manage parties, videos and messages. It creates a random username and avatar for the guest and return it.'

  if (res.locals?.session || res.locals?.user)

    /*
      #swagger.responses[409] = {
        description: 'There is a conflict when trying to create guest session as the session already exists for the user.',
        schema: { message: 'Session already exists' }
      } 
    */
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


    /*
      #swagger.responses[201] = {
        description: 'Succesfully created a guest session with a guest user.',
        schema: { 
          message: 'Created new guest session',
          user: { $ref: '#/definitions/User' }
        }
      } 
    */
    return res.status(201)
      .json({
        message: "Created new guest session",
        user
      })

  } catch (error) {
    console.log("Error: ", error)


    /*
      #swagger.responses[500] = {
        description: 'Internal Server Error',
        schema: { 
          message: 'Internal Server Error',
          error: new Error('Internal Server Error')
        }
      } 
    */
    res.status(500)
      .json({
        message: "Internal Server Error",
        error
      })
  }

})

authRouter.get("/session-verify", async (req: Request, res: Response) => {

  // #swagger.tags = ['Auth']
  // #swagger.summary = 'This is an endpoint for verifying session.'
  // #swagger.description = 'This is an endpoint for verifying session that was sent with the request as cookie. A middleware check for the session validity and sets the local response attributes in express response. If any of those attributes are null, it means the session is not valid'

  if (!res.locals?.user || !res.locals?.session)


    /* #swagger.responses[401] = {
        description: 'Returns 401 (unauthorized), that means the session that the user sent was invalid. Hence the user was not authorized. One or more of the local session attributes were not present on the express reponse object.',
        schema: { 
          message: 'Session not found',
        }
    } */

    return res.status(401).json({
      message: "Session not found"
    })


  /*
    #swagger.responses[200] = {
      description: 'Returns 200, that means the session that the user sent was valid. All the local session attributes are present on the express reponse object.',
      schema: { 
        message: 'Session valid',
      }
    } 
  */

  return res.status(200)
    .json({
      message: "Session valid"
    })
})

authRouter.use((req: Request, res: Response) => {
  return res.status(404).json({
    message: "Not Found",
  });
});

export default authRouter;
