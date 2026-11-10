import defineAction from '@factories/defineAction'
import { buildPaginatedResponse, getPaginationOptions } from '@factories/pagination/utils'
import userRepository from '@domains/users/repositories'
import UserModel from '@domains/users/repositories/model'
import EventModel from '@domains/events/repositories/events/model'
import PhotoModel from '@domains/events/repositories/photos/model'
import SubscriptionModel from '@domains/payments/repositories/subscriptions/model'
import TransactionModel from '@domains/payments/repositories/transactions/model'
import logRepository from '../../repositories'

import {
  addAdminUserCreditsBodySchema,
  addAdminUserCreditsParamsSchema,
  addAdminUserCreditsResponseSchema,
  adminMetricsQuerySchema,
  adminMetricsResponseSchema,
  listAdminUsersQuerySchema,
  listAdminUsersResponseSchema
} from './schemas'
import type {
  AddAdminUserCreditsBody,
  AddAdminUserCreditsParams,
  AddAdminUserCreditsResponse,
  AdminMetricsQuery,
  AdminMetricsResponse,
  AdminPeriod,
  AdminUserItem,
  ListAdminUsersQuery,
  ListAdminUsersResponse
} from './types'
import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const getRecentMonthsBuckets = (count = 6) => {
  const buckets = []
  const now = new Date()

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = d.getFullYear()
    const month = d.getMonth()
    const start = new Date(year, month, 1, 0, 0, 0, 0).toISOString()
    const nextMonth = new Date(year, month + 1, 1, 0, 0, 0, 0)
    const end = new Date(nextMonth.getTime() - 1).toISOString()
    const shortYear = String(year).slice(-2)
    const label = `${MONTH_NAMES[month]}/${shortYear}`

    buckets.push({ label, start, end })
  }

  return buckets
}

interface PeriodBucket {
  label: string
  start: string
  end: string
}

const getPeriodBucketsAndRange = (
  period: AdminPeriod = '30d'
): { buckets: PeriodBucket[]; periodStart: string } => {
  const now = new Date()
  const buckets: PeriodBucket[] = []

  if (period === '7d') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).toISOString()
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).toISOString()
      const dayStr = String(d.getDate()).padStart(2, '0')
      const monthStr = MONTH_NAMES[d.getMonth()]
      buckets.push({ label: `${dayStr}/${monthStr}`, start, end })
    }
    return { buckets, periodStart: buckets[0].start }
  }

  if (period === '30d') {
    for (let i = 5; i >= 0; i--) {
      const dStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (i + 1) * 5 + 1)
      const dEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i * 5)
      const start = new Date(dStart.getFullYear(), dStart.getMonth(), dStart.getDate(), 0, 0, 0, 0).toISOString()
      const end = new Date(dEnd.getFullYear(), dEnd.getMonth(), dEnd.getDate(), 23, 59, 59, 999).toISOString()
      const label = `${String(dStart.getDate()).padStart(2, '0')}/${MONTH_NAMES[dStart.getMonth()]}`
      buckets.push({ label, start, end })
    }
    return { buckets, periodStart: buckets[0].start }
  }

  if (period === '90d') {
    const months = getRecentMonthsBuckets(3)
    return { buckets: months, periodStart: months[0].start }
  }

  if (period === '6m') {
    const months = getRecentMonthsBuckets(6)
    return { buckets: months, periodStart: months[0].start }
  }

  if (period === '12m') {
    const months = getRecentMonthsBuckets(12)
    return { buckets: months, periodStart: months[0].start }
  }

  // 'all'
  const months = getRecentMonthsBuckets(12)
  return { buckets: months, periodStart: new Date(0).toISOString() }
}

export const getAdminMetrics = defineAction(
  {
    method: 'get',
    path: '/admin/metrics',
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
      creditsAgg,
      totalEvents,
      closedEvents,
      totalPhotos,
      activeSubs,
      cancelledSubs,
      plansDistAgg,
      totalPaidTransactions,
      revenueAgg,
      timelineResults,
      newUsersInPeriod,
      newEventsInPeriod,
      photosInPeriod,
      revenueInPeriodAgg,
      paidTxInPeriod
    ] = await Promise.all([
      UserModel.countDocuments(),
      UserModel.countDocuments({ role: 'admin' }),
      UserModel.countDocuments({ freeTrialClaimedAt: { $exists: true, $ne: null } }),
      UserModel.aggregate([
        {
          $group: {
            _id: null,
            totalPaid: { $sum: '$paidCredits' },
            totalFree: { $sum: '$freeCredits' }
          }
        }
      ]),
      EventModel.countDocuments(),
      EventModel.countDocuments({ closedAt: { $exists: true, $ne: null } }),
      PhotoModel.countDocuments(),
      SubscriptionModel.countDocuments({ status: 'ACTIVE' }),
      SubscriptionModel.countDocuments({ status: 'CANCELLED' }),
      SubscriptionModel.aggregate([
        {
          $group: {
            _id: { $ifNull: ['$planName', 'Sem identificação'] },
            count: { $sum: 1 }
          }
        }
      ]),
      TransactionModel.countDocuments({ status: 'PAID' }),
      TransactionModel.aggregate([
        { $match: { status: 'PAID' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Promise.all(
        buckets.map(async (bucket) => {
          const [newUsers, newEvents, transactions] = await Promise.all([
            UserModel.countDocuments({ createdAt: { $gte: bucket.start, $lte: bucket.end } }),
            EventModel.countDocuments({ createdAt: { $gte: bucket.start, $lte: bucket.end } }),
            TransactionModel.countDocuments({
              status: 'PAID',
              createdAt: { $gte: bucket.start, $lte: bucket.end }
            })
          ])
          return {
            label: bucket.label,
            newUsers,
            newEvents,
            transactions
          }
        })
      ),
      UserModel.countDocuments({ createdAt: { $gte: periodStart } }),
      EventModel.countDocuments({ createdAt: { $gte: periodStart } }),
      PhotoModel.countDocuments({ createdAt: { $gte: periodStart } }),
      TransactionModel.aggregate([
        { $match: { status: 'PAID', createdAt: { $gte: periodStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      TransactionModel.countDocuments({ status: 'PAID', createdAt: { $gte: periodStart } })
    ])

    const totalPaidCredits = creditsAgg[0]?.totalPaid ?? 0
    const totalFreeCredits = creditsAgg[0]?.totalFree ?? 0
    const totalRevenue = revenueAgg[0]?.total ?? 0
    const activeEvents = Math.max(0, totalEvents - closedEvents)

    const distribution = plansDistAgg.map((item) => ({
      name: String(item._id || 'Geral'),
      count: Number(item.count || 0)
    }))

    return {
      period: selectedPeriod,
      periodSummary: {
        newUsers: newUsersInPeriod,
        newEvents: newEventsInPeriod,
        photosUploaded: photosInPeriod,
        revenue: revenueInPeriodAgg[0]?.total ?? 0,
        paidTransactions: paidTxInPeriod
      },
      users: {
        total: totalUsers,
        admins: adminsCount,
        trialClaimed: trialClaimedCount,
        totalPaidCredits,
        totalFreeCredits
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
    path: '/admin/users',
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
    const activeSubs = await SubscriptionModel.find({
      userId: { $in: userIds },
      status: 'ACTIVE'
    }).lean()

    const subMap = new Map<string, string>()
    for (const sub of activeSubs) {
      if (sub.userId) {
        subMap.set(sub.userId, sub.planName || 'Assinatura ativa')
      }
    }

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
    path: '/admin/users/:userId/credits',
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

    const activeSub = await SubscriptionModel.findOne({
      userId: targetUser.id,
      status: 'ACTIVE'
    }).lean()

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

    return {
      user: userItem,
      message: `${data.amount} crédito(s) adicionado(s) com sucesso.`
    }
  }
)
