export type FiltersRecord = Record<string, string | number | boolean>

export type ActionResponse<T> = T | { error: string }

export interface CreateActionParams<TArgs extends unknown[], TReturn> {
  name: string
  action: (...args: TArgs) => Promise<TReturn>
  log?: boolean
}

export interface PaginationParams {
  page?: number
  limit?: number
  filters?: FiltersRecord
}

export interface PaginatedMeta {
  totalPages: number
  total: number
  limit: number
  page: number
}

export interface PaginatedResponse<T> {
  meta: PaginatedMeta
  data: T[]
}

export interface ResponseDeleted {
  success: boolean
}
