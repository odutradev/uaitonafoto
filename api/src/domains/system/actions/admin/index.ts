import { addAdminUserCreditsBodySchema, addAdminUserCreditsParamsSchema, addAdminUserCreditsResponseSchema, adminMetricsQuerySchema, adminMetricsResponseSchema, listAdminUsersQuerySchema, listAdminUsersResponseSchema } from './schemas'
import { buildPaginatedResponse, getPaginationOptions } from '@factories/pagination/utils'
import subscriptionRepository from '@domains/payments/repositories/subscriptions'
import transactionRepository from '@domains/payments/repositories/transactions'
import eventRepository from '@domains/events/repositories/events'
import photoRepository from '@domains/events/repositories/photos'
import userRepository from '@domains/users/repositories/users'
import logRepository from '@domains/system/repositories/logs'
import defineAction from '@factories/defineAction'

import type { AddAdminUserCreditsBody, AddAdminUserCreditsParams, AddAdminUserCreditsResponse, AdminMetricsQuery, AdminMetricsResponse, AdminPeriod, AdminUserItem, ListAdminUsersQuery, ListAdminUsersResponse } from './types'
import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'

const MonthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const MonthsByPeriod: Partial<Record<AdminPeriod, number>> = { '90d': 3, '6m': 6, '12m': 12 }

interface PeriodBucket {
  label: string
  start: string
  end: string
}

const countdownOffsets = (count: number): number[] => Array.from({ length: count }, (_, index) => count - 1 - index)

const getRecentMonthsBuckets = (count = 6): PeriodBucket[] => {
  const now = new Date()

  return countdownOffsets(count).map((offset) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - offset, 1)
    const year = monthDate.getFullYear()
    const month = monthDate.getMonth()
    const start = new Date(year, month, 1, 0, 0, 0, 0).toISOString()
    const nextMonth = new Date(year, month + 1, 1, 0, 0, 0, 0)
    const end = new Date(nextMonth.getTime() - 1).toISOString()
    const shortYear = String(year).slice(-2)
    return { label: `${MonthNames[month]}/${shortYear}`, start, end }
  })
}

const getDailyBuckets = (now: Date): PeriodBucket[] => {
  return countdownOffsets(7).map((offset) => {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset)
    const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0).toISOString()
    const end = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999).toISOString()
    const dayLabel = String(day.getDate()).padStart(2, '0')
    return { label: `${dayLabel}/${MonthNames[day.getMonth()]}`, start, end }
  })
}

const getFiveDayBuckets = (now: Date): PeriodBucket[] => {
  return countdownOffsets(6).map((offset) => {
    const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (offset + 1) * 5 + 1)
    const endDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset * 5)
    const start = new Date(startDay.getFullYear(), startDay.getMonth(), startDay.getDate(), 0, 0, 0, 0).toISOString()
    const end = new Date(endDay.getFullYear(), endDay.getMonth(), endDay.getDate(), 23, 59, 59, 999).toISOString()
    const label = `${String(startDay.getDate()).padStart(2, '0')}/${MonthNames[startDay.getMonth()]}`
    return { label, start, end }
  })
}

const getPeriodBucketsAndRange = (
  period: AdminPeriod = '30d'
): { buckets: PeriodBucket[]; periodStart: string } => {
  const now = new Date()

  if (period === '7d') {
    const buckets = getDailyBuckets(now)
    return { buckets, periodStart: buckets[0].start }
  }

  if (period === '30d') {
    const buckets = getFiveDayBuckets(now)
    return { buckets, periodStart: buckets[0].start }
  }

  const monthCount = MonthsByPeriod[period]
  if (monthCount) {
    const months = getRecentMonthsBuckets(monthCount)
    return { buckets: months, periodStart: months[0].start }
  }

  const months = getRecentMonthsBuckets(12)
  return { buckets: months, periodStart: new Date(0).toISOString() }
}

export const getAdminMetrics = defineAction(
  {
    method: 'get',
    path: '/admin/metrics/details',
    summary: 'Obter métricas gerais da plataforma para administradores com filtro de período',
    tags: ['Admin', 'Sistema'],
    authenticate: true,
    schema: {
      query: adminMetricsQuerySchema
    },
    responses: {
      200: { description: 'Métricas gerais da plataforma', schema: adminMetricsResponseSchema }
    }
  },
  async ({
    ids,
    query,
    manageError
  }: ManageRequestBody<{ query?: AdminMetricsQuery }>): ManageRequestResponse<AdminMetricsResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const caller = await userRepository.findById(ids.userId)
    if (!caller || caller.role !== 'admin') {
      return manageError({ code: 'forbidden' })
    }

    const selectedPeriod: AdminPeriod = query?.period || '30d'
    const { buckets, periodStart } = getPeriodBucketsAndRange(selectedPeriod)

    const [
      totalUsers,
      adminsCount,
      trialClaimedCount,
      credits,
      totalEvents,
      closedEvents,
      totalPhotos,
      activeSubs,
      cancelledSubs,
      distribution,
      totalPaidTransactions,
      totalRevenue,
      timelineResults,
      newUsersInPeriod,
      newEventsInPeriod,
      photosInPeriod,
      revenueInPeriod,
      paidTxInPeriod
    ] = await Promise.all([
      userRepository.countAll(),
      userRepository.countByRole('admin'),
      userRepository.countTrialClaimed(),
      userRepository.sumCredits(),
      eventRepository.countAll(),
      eventRepository.countClosed(),
      photoRepository.countAll(),
      subscriptionRepository.countByStatus('ACTIVE'),
      subscriptionRepository.countByStatus('CANCELLED'),
      subscriptionRepository.countByPlanName(),
      transactionRepository.countPaid(),
      transactionRepository.sumPaidAmount(),
      Promise.all(
        buckets.map(async (bucket) => {
          const bucketRange = { since: bucket.start, until: bucket.end }
          const [newUsers, newEvents, transactions] = await Promise.all([
            userRepository.countAll(bucketRange),
            eventRepository.countAll(bucketRange),
            transactionRepository.countPaid(bucketRange)
          ])
          return {
            label: bucket.label,
            newUsers,
            newEvents,
            transactions
          }
        })
      ),
      userRepository.countAll({ since: periodStart }),
      eventRepository.countAll({ since: periodStart }),
      photoRepository.countAll({ since: periodStart }),
      transactionRepository.sumPaidAmount({ since: periodStart }),
      transactionRepository.countPaid({ since: periodStart })
    ])

    const activeEvents = Math.max(0, totalEvents - closedEvents)

    return {
      period: selectedPeriod,
      periodSummary: {
        newUsers: newUsersInPeriod,
        newEvents: newEventsInPeriod,
        photosUploaded: photosInPeriod,
        revenue: revenueInPeriod,
        paidTransactions: paidTxInPeriod
      },
      users: {
        total: totalUsers,
        admins: adminsCount,
        trialClaimed: trialClaimedCount,
        totalPaidCredits: credits.totalPaid,
        totalFreeCredits: credits.totalFree
      },
      events: {
        total: totalEvents,
        active: activeEvents,
        closed: closedEvents,
        totalPhotos,
        avgPhotosPerEvent: totalEvents > 0 ? Math.round(totalPhotos / totalEvents) : 0
      },
      plans: {
        activeSubscriptions: activeSubs,
        cancelledSubscriptions: cancelledSubs,
        totalRevenue,
        totalTransactions: totalPaidTransactions,
        averageTicket: totalPaidTransactions > 0 ? Math.round(totalRevenue / totalPaidTransactions) : 0,
        distribution
      },
      timeline: timelineResults
    }
  }
)

export const listAdminUsers = defineAction(
  {
    method: 'get',
    path: '/admin/users/list',
    summary: 'Listar usuários com dados detalhados para administração',
    tags: ['Admin', 'Sistema'],
    authenticate: true,
    schema: {
      query: listAdminUsersQuerySchema
    },
    responses: {
      200: { description: 'Lista paginada de usuários', schema: listAdminUsersResponseSchema }
    }
  },
  async ({
    ids,
    query,
    manageError
  }: ManageRequestBody<{ query: ListAdminUsersQuery }>): ManageRequestResponse<ListAdminUsersResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const caller = await userRepository.findById(ids.userId)
    if (!caller || caller.role !== 'admin') {
      return manageError({ code: 'forbidden' })
    }

    const { page, limit, offset } = getPaginationOptions(query)

    const { rows, count } = await userRepository.listPaginated({
      limit,
      offset,
      search: query?.search,
      role: query?.role
    })

    const userIds = rows.map((u) => u.id)
    const activeSubs = await subscriptionRepository.listActiveByUsers(userIds)
    const subMap = new Map(
      activeSubs
        .filter((subscription) => Boolean(subscription.userId))
        .map((subscription) => [subscription.userId, subscription.planName || 'Assinatura ativa'])
    )

    const userItems: AdminUserItem[] = rows.map((user) => {
      const activePlan = subMap.get(user.id)
      return {
        id: user.id,
        name: user.name,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        photoUrl: user.photoUrl,
        role: user.role,
        freeCredits: user.freeCredits ?? 0,
        paidCredits: user.paidCredits ?? 0,
        hasActiveSubscription: Boolean(activePlan),
        planName: activePlan,
        freeTrialClaimedAt: user.freeTrialClaimedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })

    return buildPaginatedResponse(
      {
        count,
        rows: userItems
      },
      page,
      limit
    )
  }
)

export const addAdminUserCredits = defineAction(
  {
    method: 'post',
    path: '/admin/users/:userId/credits/add',
    summary: 'Conceder créditos a um usuário (somente admin)',
    tags: ['Admin', 'Sistema'],
    authenticate: true,
    schema: {
      params: addAdminUserCreditsParamsSchema,
      body: addAdminUserCreditsBodySchema
    },
    responses: {
      200: { description: 'Créditos concedidos com sucesso', schema: addAdminUserCreditsResponseSchema }
    }
  },
  async ({
    ids,
    params,
    data,
    manageError
  }: ManageRequestBody<{
    params: AddAdminUserCreditsParams
    body: AddAdminUserCreditsBody
  }>): ManageRequestResponse<AddAdminUserCreditsResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const caller = await userRepository.findById(ids.userId)
    if (!caller || caller.role !== 'admin') {
      return manageError({ code: 'forbidden' })
    }

    const targetUser = await userRepository.findById(params.userId)
    if (!targetUser) {
      return manageError({ code: 'user_not_found', details: 'Usuário não encontrado.' })
    }

    const updatedUser = await userRepository.addCredits(params.userId, data.type, data.amount)
    if (!updatedUser) {
      return manageError({ code: 'internal_error', details: 'Não foi possível conceder créditos ao usuário.' })
    }

    const activeSub = await subscriptionRepository.findActiveByUser(targetUser.id)

    await logRepository.create({
      category: 'admin',
      level: 'info',
      action: 'ADMIN_CREDITS_ADDED',
      title: 'Créditos concedidos pelo administrador',
      description: `Concedido ${data.amount} crédito(s) ${data.type === 'paid' ? 'pago(s)' : 'cortesia'} para ${targetUser.email}${data.reason ? ` - Motivo: ${data.reason}` : ''}`,
      userId: caller.id,
      userName: caller.fullName || caller.name,
      userEmail: caller.email,
      targetId: targetUser.id,
      targetName: targetUser.fullName || targetUser.name,
      details: {
        amount: data.amount,
        creditType: data.type,
        reason: data.reason,
        previousPaidCredits: targetUser.paidCredits,
        previousFreeCredits: targetUser.freeCredits,
        newPaidCredits: updatedUser.paidCredits,
        newFreeCredits: updatedUser.freeCredits
      }
    })

    const userItem: AdminUserItem = {
      id: updatedUser.id,
      name: updatedUser.name,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      photoUrl: updatedUser.photoUrl,
      role: updatedUser.role,
      freeCredits: updatedUser.freeCredits ?? 0,
      paidCredits: updatedUser.paidCredits ?? 0,
      hasActiveSubscription: Boolean(activeSub),
      planName: activeSub?.planName,
      freeTrialClaimedAt: updatedUser.freeTrialClaimedAt,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    }

    return { user: userItem }
  }
)
