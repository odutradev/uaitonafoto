import { sendEventReminderEmails, sendEventSummaryEmails, sendGalleryExpiringEmails } from '@domains/events/utils/notifyEventEmail'
import eventRepository from '@domains/events/repositories/events'
import { defineRoutine } from '@config/routine'
import runSequentially from '@utils/async'
import createLogger from '@utils/logger'

import type { EventEntity } from '@domains/events/repositories/events/types'

const logger = createLogger('events:notifications-routine')

const HourMs = 60 * 60 * 1000
const DayMs = 24 * HourMs

export const ReminderHoursAhead = 24
export const MinReminderLeadHours = 36
export const SummaryLookbackHours = 48
export const GalleryExpiringDaysAhead = 3

const hasReminderLeadTime = (event: EventEntity): boolean =>
  new Date(event.startsAt).getTime() - new Date(event.createdAt).getTime() >= MinReminderLeadHours * HourMs

const hasLongGallery = (event: EventEntity): boolean =>
  new Date(event.galleryExpiresAt).getTime() - new Date(event.endsAt).getTime() > GalleryExpiringDaysAhead * DayMs

const notifySafely = (label: string, notify: (event: EventEntity) => Promise<void>) => async (event: EventEntity): Promise<void> => {
  try {
    await notify(event)
  } catch (error) {
    logger.warn(`Failed to send ${label} for event ${event.id}:`, error)
  }
}

export const runSendEventNotifications = async (): Promise<void> => {
  const now = Date.now()
  const nowIso = new Date(now).toISOString()

  const [upcomingEvents, endedEvents, expiringGalleries] = await Promise.all([
    eventRepository.listPendingReminders(nowIso, new Date(now + ReminderHoursAhead * HourMs).toISOString()),
    eventRepository.listPendingSummaries(new Date(now - SummaryLookbackHours * HourMs).toISOString(), nowIso),
    eventRepository.listGalleriesExpiringSoon(nowIso, new Date(now + GalleryExpiringDaysAhead * DayMs).toISOString())
  ])

  const remindableEvents = upcomingEvents.filter(hasReminderLeadTime)
  const warnableGalleries = expiringGalleries.filter(hasLongGallery)

  await runSequentially(remindableEvents, notifySafely('reminder', sendEventReminderEmails))
  await runSequentially(endedEvents, notifySafely('summary', sendEventSummaryEmails))
  await runSequentially(warnableGalleries, notifySafely('gallery expiring warning', sendGalleryExpiringEmails))

  const notifiedCount = remindableEvents.length + endedEvents.length + warnableGalleries.length
  if (notifiedCount > 0) {
    logger.info(`Routine completed: ${remindableEvents.length} reminders, ${endedEvents.length} summaries, ${warnableGalleries.length} gallery warnings.`)
  }
}

export const sendEventNotificationsRoutine = defineRoutine({
  name: 'sendEventNotifications',
  description: 'Email event teams with reminders, post-event summaries and gallery expiration warnings',
  cronExpression: '*/15 * * * *',
  runOnInit: true,
  handler: runSendEventNotifications
})

export default sendEventNotificationsRoutine
