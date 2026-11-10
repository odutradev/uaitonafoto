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
  adminMetricsResponseSchema,
  listAdminUsersQuerySchema,
  listAdminUsersResponseSchema
} from './schemas'
import type {
  AddAdminUserCreditsBody,
  AddAdminUserCreditsParams,
  AddAdminUserCreditsResponse,
  AdminMetricsResponse,
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

export const getAdminMetrics = defineAction(
  {
    method: 'get',
    path: '/admin/metrics',
    summary: 'Obter métricas gerais da plataforma para administradores',
    tags: ['Admin', 'Sistema'],
    authenticate: true,
    responses: {
      200: { description: 'Métricas gerais da plataforma', schema: adminMetricsResponseSchema }
    }
  },
  async ({ ids, manageError }: ManageRequestBody): ManageRequestResponse<AdminMetricsResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const caller = await userRepository.findById(ids.userId)
    if (!caller || caller.role !== 'admin') {
      return manageError({ code: 'forbidden' })
    }

    const monthBuckets = getRecentMonthsBuckets(6)

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
      timelineResults
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
        monthBuckets.map(async (bucket) => {
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
      )
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
        totalPhotos
      },
      plans: {
        activeSubscriptions: activeSubs,
        cancelledSubscriptions: cancelledSubs,
        totalRevenue,
        totalTransactions: totalPaidTransactions,
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
