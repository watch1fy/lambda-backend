import { Types } from "mongoose"

export interface IUser {
  _id: string,
  userId: string
  name: string
  avatarUrl: string
}

export interface ISession {
  _id: string
  user_id: string
  expires_at: Date
}

export interface IMessage {
  author: Types.ObjectId
  party: Types.ObjectId
  createdAt?: Date
  content: string
}

export interface IParty {
  creator: Types.ObjectId
  partyId: string
  createdAt?: Date
  expiresAt?: Date
  status?: 'waiting' | 'started'
  media?: {
    isCustomMedia: boolean
    url: string
  }
  settings?: {
    allowPlayPause: boolean,
    allowSeek: boolean,
    allowRewindForward: boolean
  }
}
