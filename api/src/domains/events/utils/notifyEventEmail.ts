import galleryExpiringEmail from '@domains/events/emails/galleryExpiring'
import galleryExpiredEmail from '@domains/events/emails/galleryExpired'
import eventReminderEmail from '@domains/events/emails/eventReminder'
import eventCreatedEmail from '@domains/events/emails/eventCreated'
import eventSummaryEmail from '@domains/events/emails/eventSummary'
import guestRepository from '@domains/events/repositories/guests'
import photoRepository from '@domains/events/repositories/photos'
import eventRepository from '@domains/events/repositories/events'
import teamRemovedEmail from '@domains/events/emails/teamRemoved'
import teamInviteEmail from '@domains/events/emails/teamInvite'
import userRepository from '@domains/users/repositories/users'
import { buildFrontendUrl } from '@email/links'
import { formatDateTimeBR } from '@utils/date'
import runSequentially from '@utils/async'

import type { UserEntity } from '@domains/users/repositories/users/types'
import type { EventEntity } from '@domains/events/repositories/events/types'

const DayMs = 24 * 60 * 60 * 1000

const resolveUserName = (user: UserEntity): string => user.fullName || user.name || 'Organizador'

const buildEventLinks = (event: EventEntity, baseUrl?: string) => ({
  eventUrl: buildFrontendUrl(`/app/events/${event.id}`, baseUrl),
  guestUrl: buildFrontendUrl(`/e/${event.guestToken}`, baseUrl),
  screenUrl: buildFrontendUrl(`/e/${event.guestToken}/screen`, baseUrl)
})

const describeGuestPin = (event: EventEntity): string => {
  if (!event.settings.pinEnabled) return 'Sem PIN'
  if (event.settings.pinRotate) return `Rotativo, muda a cada ${event.settings.pinRotationMinutes} min`
  return event.settings.pin
}

const listTeamUsers = async (event: EventEntity): Promise<UserEntity[]> =>
  userRepository.findByIds(event.members.map((member) => member.userId))

const sendToTeam = async (event: EventEntity, send: (user: UserEntity) => Promise<unknown>): Promise<void> => {
  const teamUsers = await listTeamUsers(event)
  await runSequentially(teamUsers, send)
}

export const sendEventCreatedEmail = async (event: EventEntity, creator: UserEntity, baseUrl?: string): Promise<void> => {
  const { eventUrl, guestUrl } = buildEventLinks(event, baseUrl)

  await eventCreatedEmail.send({
    to: creator.email,
    variables: {
      userName: resolveUserName(creator),
      eventName: event.name,
      startsAt: formatDateTimeBR(new Date(event.startsAt)),
      endsAt: formatDateTimeBR(new Date(event.endsAt)),
      galleryExpiresAt: formatDateTimeBR(new Date(event.galleryExpiresAt)),
      pinDescription: describeGuestPin(event),
      guestUrl,
      eventUrl
    }
  })
}

export const sendTeamInviteEmail = async (event: EventEntity, member: UserEntity, inviterId: string, baseUrl?: string): Promise<void> => {
  const inviter = await userRepository.findById(inviterId)

  await teamInviteEmail.send({
    to: member.email,
    variables: {
      memberName: resolveUserName(member),
      inviterName: inviter ? resolveUserName(inviter) : 'O criador do evento',
      eventName: event.name,
      eventStartsAt: formatDateTimeBR(new Date(event.startsAt)),
      eventUrl: buildEventLinks(event, baseUrl).eventUrl
    }
  })
}

export const sendTeamRemovedEmail = async (event: EventEntity, memberId: string, baseUrl?: string): Promise<void> => {
  const member = await userRepository.findById(memberId)
  if (!member) return

  await teamRemovedEmail.send({
    to: member.email,
    variables: {
      memberName: resolveUserName(member),
      eventName: event.name,
      appUrl: buildFrontendUrl('/app', baseUrl)
    }
  })
}

export const sendEventReminderEmails = async (event: EventEntity): Promise<void> => {
  if (!(await eventRepository.claimNotification(event.id, 'reminderSentAt'))) return

  const { eventUrl, guestUrl, screenUrl } = buildEventLinks(event)

  await sendToTeam(event, (user) =>
    eventReminderEmail.send({
      to: user.email,
      variables: {
        userName: resolveUserName(user),
        eventName: event.name,
        startsAt: formatDateTimeBR(new Date(event.startsAt)),
        screenUrl,
        guestUrl,
        eventUrl
      }
    })
  )
}

export const sendEventSummaryEmails = async (event: EventEntity, baseUrl?: string): Promise<void> => {
  if (!(await eventRepository.claimNotification(event.id, 'summarySentAt'))) return

  const [photosCount, guestsCount] = await Promise.all([
    photoRepository.countApprovedByEvent(event.id),
    guestRepository.countByEvent(event.id)
  ])

  await sendToTeam(event, (user) =>
    eventSummaryEmail.send({
      to: user.email,
      variables: {
        userName: resolveUserName(user),
        eventName: event.name,
        photosCount,
        guestsCount,
        galleryExpiresAt: formatDateTimeBR(new Date(event.galleryExpiresAt)),
        eventUrl: buildEventLinks(event, baseUrl).eventUrl
      }
    })
  )
}

export const sendGalleryExpiringEmails = async (event: EventEntity): Promise<void> => {
  if (!(await eventRepository.claimNotification(event.id, 'galleryExpiringSentAt'))) return

  const daysLeft = Math.max(1, Math.ceil((new Date(event.galleryExpiresAt).getTime() - Date.now()) / DayMs))

  await sendToTeam(event, (user) =>
    galleryExpiringEmail.send({
      to: user.email,
      variables: {
        userName: resolveUserName(user),
        eventName: event.name,
        daysLeft,
        galleryExpiresAt: formatDateTimeBR(new Date(event.galleryExpiresAt)),
        eventUrl: buildEventLinks(event).eventUrl
      }
    })
  )
}

export const sendGalleryExpiredEmails = async (event: EventEntity): Promise<void> => {
  if (!(await eventRepository.claimNotification(event.id, 'galleryExpiredSentAt'))) return

  await sendToTeam(event, (user) =>
    galleryExpiredEmail.send({
      to: user.email,
      variables: {
        userName: resolveUserName(user),
        eventName: event.name,
        appUrl: buildFrontendUrl('/app')
      }
    })
  )
}
