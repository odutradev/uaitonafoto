import axios from 'axios'
import api from '@services/api'
import type { ListLotteriesResponse, LotteryItemResponse } from './types'

export const LOTTERY_METADATA: Record<string, { name: string; color: string }> = {
  megasena: { name: 'Mega-Sena', color: '#209869' },
  lotofacil: { name: 'Lotofácil', color: '#930089' },
  quina: { name: 'Quina', color: '#260085' },
  lotomania: { name: 'Lotomania', color: '#F78100' },
  duplasena: { name: 'Dupla Sena', color: '#A61324' },
  timemania: { name: 'Timemania', color: '#049645' },
  diadesorte: { name: 'Dia de Sorte', color: '#CB852B' },
  maismilionaria: { name: '+Milionária', color: '#1B3573' },
  federal: { name: 'Federal', color: '#144673' }
}

export const getLotteryMeta = (type?: string) => {
  if (!type) return null
  const key = type.toLowerCase().replace(/[^a-z]/g, '')
  return LOTTERY_METADATA[key] || { name: type.toUpperCase(), color: '#1976d2' }
}

const parseDateToIso = (dateStr?: string): string | null => {
  if (!dateStr) return null
  const parts = dateStr.trim().split('/')
  if (parts.length === 3) {
    const [day, month, year] = parts
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T20:00:00.000Z`
  }
  return null
}

export const fetchDirectFromCaixa = async (type: string, contestNumber?: number): Promise<LotteryItemResponse | null> => {
  const normalizedType = type.toLowerCase().trim()
  const meta = LOTTERY_METADATA[normalizedType] || { name: normalizedType.toUpperCase(), color: '#209869' }
  const url = contestNumber
    ? `https://servicebus2.caixa.gov.br/portaldeloterias/api/${normalizedType}/${contestNumber}`
    : `https://servicebus2.caixa.gov.br/portaldeloterias/api/${normalizedType}`

  const response = await axios.get<Record<string, unknown>>(url, { timeout: 6000 })
  const raw = response.data

  const contest = Number(raw.numero || raw.concurso)
  const nextContest = Number(raw.numeroConcursoProximo || raw.proximoConcurso) || contest + 1
  const drawDate = parseDateToIso((raw.dataProximoConcurso || raw.dataApuracao || raw.data) as string | undefined)

  let dezenas = ((raw.listaDezenas || raw.dezenasSorteadasOrdemSorteio || raw.dezenas || []) as unknown[]).map(String)
  if (normalizedType === 'duplasena' && dezenas.length > 6) {
    dezenas = dezenas.slice(0, 6)
  }

  return {
    type: normalizedType,
    name: meta.name,
    color: meta.color,
    contestNumber: contest,
    nextContestNumber: nextContest,
    drawDate,
    estimatedPrize: Number(raw.valorEstimadoProximoConcurso) || 0,
    accumulatedPrize: Number(raw.valorAcumuladoProximoConcurso) || 0,
    isAccumulated: Boolean(raw.acumulado ?? raw.acumulou),
    lastDrawnNumbers: dezenas
  }
}

export const getLotteries = async (): Promise<ListLotteriesResponse> => {
  try {
    const response = await api.get<ListLotteriesResponse>('/lotteries')
    const hasData = response.data && response.data.some((l) => l.contestNumber > 0 || l.estimatedPrize > 0)
    if (hasData) {
      return response.data
    }
  } catch {}

  try {
    const types = Object.keys(LOTTERY_METADATA)
    const directResults = await Promise.all(
      types.map(async (t) => {
        try {
          return await fetchDirectFromCaixa(t)
        } catch {
          const meta = LOTTERY_METADATA[t]
          return {
            type: t,
            name: meta.name,
            color: meta.color,
            contestNumber: 0,
            nextContestNumber: 0,
            drawDate: null,
            estimatedPrize: 0,
            accumulatedPrize: 0,
            isAccumulated: false
          }
        }
      })
    )
    return directResults.filter(Boolean) as ListLotteriesResponse
  } catch {
    const response = await api.get<ListLotteriesResponse>('/lotteries')
    return response.data
  }
}

export const getLotteryByType = async (type: string, contestNumber?: number): Promise<LotteryItemResponse> => {
  try {
    const response = await api.get<LotteryItemResponse>(`/lotteries/${type}`, {
      params: contestNumber ? { contestNumber } : undefined
    })
    if (
      response.data &&
      (response.data.contestNumber > 0 || (response.data.lastDrawnNumbers && response.data.lastDrawnNumbers.length > 0))
    ) {
      return response.data
    }
  } catch {}

  const direct = await fetchDirectFromCaixa(type, contestNumber)
  if (direct) return direct

  const response = await api.get<LotteryItemResponse>(`/lotteries/${type}`, {
    params: contestNumber ? { contestNumber } : undefined
  })
  return response.data
}

