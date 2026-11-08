import type { ScheduledTask } from 'node-cron'

export interface RoutineDefinition {
  name: string
  cronExpression: string
  runOnInit?: boolean
  description?: string
  timezone?: string
  handler: () => Promise<void> | void
}

export interface RoutineDivisionDefinition<TRoutines = Record<string, unknown>> {
  name: string
  routines: TRoutines
}

export type RoutineRegistry = Map<string, RoutineDivisionDefinition>

export interface ScheduledRoutineEntry {
  key: string
  division: string
  name: string
  definition: RoutineDefinition
  task: ScheduledTask
}
