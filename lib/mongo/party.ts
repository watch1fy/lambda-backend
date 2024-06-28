import { IParty } from "../types/index.js";
import mongoose, { Schema } from "mongoose";

export const PartySchema = new mongoose.Schema<IParty>({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  partyId: {
    type: String,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  expiresAt: {
    type: Date,
    default: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  },
  status: {
    type: String,
    enum: ['waiting', 'started'],
    default: 'waiting'
  },
  media: {
    type: {
      isCustomMedia: {
        type: Boolean,
        default: false
      },
      url: {
        type: String,
        default: 'https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/high.mp4'
      }
    }
  },
  settings: {
    type: {
      allowPlayPause: {
        type: Boolean,
        default: true
      },
      allowSeek: {
        type: Boolean,
        default: false
      },
      allowRewindForward: {
        type: Boolean,
        default: false
      }
    }
  }
})

const Party = mongoose.models.Party || mongoose.model('Party', PartySchema)

export default Party
