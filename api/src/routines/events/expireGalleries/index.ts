import { purgeEventPhotos } from '@domains/events/utils/photoStorage'
import eventRepository from '@domains/events/repositories/events'
import { defineRoutine } from '@config/routine'
import runSequentially from '@utils/async'
import createLogger from '@utils/logger'

const logger = createLogger('events:expire-galleries-routine')

export const runExpireGalleries = async (): Promise<void> => {
  const expiredEvents = await eventRepository.listExpiredGalleries(new Date().toISOString())
  const cleanResults = await runSequentially(expiredEvents, async (event) => {
    try {
      await purgeEventPhotos(event.id)
      await eventRepository.markGalleryCleaned(event.id)
      return true
    } catch (error) {
      logger.error(`Failed to clean gallery of event ${event.id}:`, error)
      return false
    }
  })
  const cleanedCount = cleanResults.filter(Boolean).length

  if (cleanedCount > 0) {
    logger.info(`Routine completed: ${cleanedCount} expired galleries cleaned.`)
  }
}

export const expireGalleriesRoutine = defineRoutine({
  name: 'expireGalleries',
  description: 'Delete photos from events whose gallery availability has ended',
  cronExpression: '0 * * * *',
  runOnInit: true,
  handler: runExpireGalleries
})

export default expireGalleriesRoutine
