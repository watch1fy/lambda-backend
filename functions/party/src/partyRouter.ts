import express, { Router, Request, Response } from "express";
import { Party, Message } from "../../../lib/mongo/index.js";

const partyRouter: express.Router = Router();

partyRouter.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "The server responded 200 and is healthy",
  });
});

partyRouter.post("/create", async (req: Request, res: Response) => {
  const { settings } = req.body

  if (!res.locals?.user || !res.locals?.session)
    return res.status(401).json({
      message: "Session not found"
    })

  const creator = res.locals.user
  const party = new Party({ settings, creator: creator.id })
  await party.save()

  return res.status(201)
    .json({
      message: "Created new guest session party",
      party
    })
})

partyRouter.get("/:id", async (req: Request, res: Response) => {
  const partyId = req.params.id

  if (!res.locals?.user || !res.locals?.session)
    return res.status(401).json({
      message: "Session not found"
    })

  const party = await Party.findOne({ partyId }).exec()

  if (new Date() > party.expiresAt) {
    await Party.deleteMany({ partyId })
    await Message.deleteMany({ partyId })

    return res.status(400)
      .json({
        message: 'Requested Party has expired'
      })
  }

  return res.status(200)
    .json({
      party
    })
})

partyRouter.delete("/:id", async (req: Request, res: Response) => {
  if (!res.locals?.user || !res.locals?.session)
    return res.status(401).json({
      message: "Session not found"
    })

  try {
    const partyId = req.params.id
    await Party.deleteMany({ partyId })
    await Message.deleteMany({ partyId })

    return res.status(200)
      .json({
        message: "Party data deleted"
      })
  } catch (error) {
    console.error("Error deleting party data:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
})

partyRouter.use((res: Response) => {
  return res.status(404).json({
    message: "Not Found",
  });
});

export default partyRouter;
