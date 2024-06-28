import { IMessage } from "../types/index.js";
import mongoose, { Schema } from "mongoose";

export const MessageSchema = new Schema<IMessage>({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  party: {
    type: Schema.Types.ObjectId,
    ref: 'Party',
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  content: {
    type: String,
    required: true
  },
})

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema)

export default Message;
