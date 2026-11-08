import LikeModel from './model'
import type { CreateLikePayload } from './types'

const DUPLICATE_KEY_ERROR = 11000

export const likeRepository = {
  create: async (payload: CreateLikePayload): Promise<boolean> => {
    try {
      await LikeModel.create(payload)
      return true
    } catch (error: any) {
      if (error?.code === DUPLICATE_KEY_ERROR) return false
      throw error
    }
  },

  remove: async (photoId: string, guestId: string): Promise<boolean> => {
    const result = await LikeModel.deleteOne({ photoId, guestId })
    return result.deletedCount > 0
  },

  findLikedPhotoIds: async (guestId: string, photoIds: string[]): Promise<Set<string>> => {
    const docs = await LikeModel.find({ guestId, photoId: { $in: photoIds } }, { photoId: 1 }).lean()
    return new Set(docs.map((doc) => String(doc.photoId)))
  },

  deleteByPhoto: async (photoId: string): Promise<void> => {
    await LikeModel.deleteMany({ photoId })
  },

  deleteByEvent: async (eventId: string): Promise<void> => {
    await LikeModel.deleteMany({ eventId })
  }
}

export default likeRepository
