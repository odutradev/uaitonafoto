import type { FiltersRecord } from './types'

const serializeFilters = (filters: FiltersRecord): string =>
  Object.entries(filters).flatMap(([k, v]) => [k, String(v)]).join(',')

export const buildParams = (params?: unknown): Record<string, string | number | boolean> => {
  if (!params || typeof params !== 'object') return {}
  const { filters, ...rest } = params as Record<string, unknown>
  const clean = Object.fromEntries(
    Object.entries(rest).filter(([, v]) => v !== undefined && typeof v !== 'object')
  ) as Record<string, string | number | boolean>
  if (!filters || typeof filters !== 'object') return clean
  const serialized = serializeFilters(filters as FiltersRecord)
  return serialized ? { ...clean, filters: serialized } : clean
}
