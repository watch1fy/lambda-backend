import express, { Router, Request, Response } from "express";
import { Party, Message } from "../../../lib/mongo/index.js";
import { IParty } from "lib/types/index.js";

const partyRouter: express.Router = Router();

partyRouter.get("/health", (res: Response) => {

  // #swagger.tags = ['Party']
  // #swagger.summary = 'This is an endpoint that checks if the lambda is working fine or not.'
  // #swagger.description = 'This is an endpoint that checks if the lambda is working fine or not. It return 200 if the server is healthy else return 500(Internal Server Error)'


  /*
    #swagger.responses[200] = {
      description: 'Party lambda function is healthy.',
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

partyRouter.post("/create", async (req: Request, res: Response) => {

  // #swagger.tags = ['Party']
  // #swagger.summary = 'This is an endpoint for creating a party.'
  // #swagger.description = 'This is an endpoint for creating party that associates with a guest user and stores necessary party information.'

  try {

    /*
      #swagger.parameters['settings'] = {
        in: 'body',
        description: 'Settings for the party to be created, that is set at when the user is creating a party on watchify.',
        schema: {
          allowPlayPause: true,
          allowSeek: false,
          allowRewindForward: false,
        }
      }
    */
    const { settings } = req.body

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
        message: "Session not found"
      })

    const creator = res.locals.user
    const party = new Party({ settings, creator: creator.id })
    await party.save()

    /*
      #swagger.responses[201] = {
        description: 'Succesfully created a party.',
        schema: { 
          message: 'Created new guest session party',
          party: { $ref: '#/definitions/Party' }
        }
      } 
    */
    return res.status(201)
      .json({
        message: "Created new guest session party",
        party
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

partyRouter.get("/:id", async (req: Request, res: Response) => {

  // #swagger.tags = ['Party']
  // #swagger.summary = 'This is an endpoint for getting party details by partyId.'
  // #swagger.description = 'This is an endpoint for getting party details by partyId. It also retrieves all the data related to the party such as creator of the party, settings of the party, media being played and more.'

  /*
    #swagger.parameters['id'] = {
      description: 'This is a required dynamic parameter that represent the ID of the party to be fetched.',
      required: 'true',
      type: 'string'
    }
  */
  const partyId = req.params.id

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
      message: "Session not found"
    })

  try {
    const party: IParty = await Party.findOne({ partyId }).exec()

    if (!party?.expiresAt || new Date() > party.expiresAt) {
      await Party.deleteMany({ partyId })
      await Message.deleteMany({ partyId })


      /*
        #swagger.responses[400] = {
          description: 'Returns 400, that means the party was not found. This means that the party does not exists or the party existed but has expired.',
          schema: { 
            message: 'Requested party was not found or has expired',
          }
        } 
      */
      return res.status(400)
        .json({
          message: 'Requested party was not found or has expired'
        })
    }

    /*
      #swagger.responses[200] = {
        description: 'Returns 200, with all the party details.',
        schema: { 
          party: { $ref: '#/definitions/Party' },
        }
      } 
    */
    return res.status(200)
      .json({
        party
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

partyRouter.delete("/:id", async (req: Request, res: Response) => {

  // #swagger.tags = ['Party']
  // #swagger.summary = 'This is an endpoint for deleting a party by partyId.'
  // #swagger.description = 'This is an endpoint for deleting a party by partyId. It also deletes all the data related to the party such messages, videos associated with the party, settings of the party, media being played and more.'

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
      message: "Session not found"
    })

  try {

    /*
      #swagger.parameters['id'] = {
        description: 'This is a required dynamic parameter that represent the ID of the party to be deleted.',
        required: 'true',
        type: 'string'
      }
    */
    const partyId = req.params.id
    await Party.deleteMany({ partyId })
    await Message.deleteMany({ partyId })

    /*
      #swagger.responses[200] = {
        description: 'Returns 200, with the party deleted as per the user request, along with all it\'s data including media and messages.',
        schema: { 
          message: 'Party data deleted',
        }
      } 
    */
    return res.status(200)
      .json({
        message: "Party data deleted"
      })
  } catch (error) {
    console.error("Error deleting party data:", error);

    /*
      #swagger.responses[500] = {
        description: 'Internal Server Error',
        schema: { 
          message: 'Internal Server Error',
          error: new Error('Internal Server Error')
        }
      } 
    */
    return res.status(500).json({
      message: "Internal server error",
      error
    });
  }
})

partyRouter.use((res: Response) => {
  return res.status(404).json({
    message: "Not Found",
  });
});

export default partyRouter;
