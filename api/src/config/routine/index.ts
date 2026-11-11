import cron from 'node-cron'

import createLogger from '@utils/logger'
import env from '@config/env'

import type { RoutineDefinition, RoutineDivisionDefinition, RoutineRegistry, ScheduledRoutineEntry } from './types'

const logger = createLogger('routine')

export const registeredRoutines: RoutineRegistry = new Map()
export const activeScheduledTasks: Map<string, ScheduledRoutineEntry> = new Map()

export const defineRoutine = (routine: RoutineDefinition): RoutineDefinition => routine

export const isRoutineDefinition = (value: unknown): value is RoutineDefinition => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'cronExpression' in value &&
    typeof (value as RoutineDefinition).cronExpression === 'string' &&
    'handler' in value &&
    typeof (value as RoutineDefinition).handler === 'function'
  )
}

const extractRoutines = (
  obj: Record<string, unknown> | unknown[],
  prefix = ''
): Array<{ name: string; routine: RoutineDefinition }> => {
  const result: Array<{ name: string; routine: RoutineDefinition }> = []

  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (isRoutineDefinition(item)) {
        result.push({ name: item.name, routine: item })
      } else if (item && typeof item === 'object') {
        result.push(...extractRoutines(item as Record<string, unknown>, prefix))
      }
    }
    return result
  }

  for (const [key, value] of Object.entries(obj)) {
    const fullName = prefix ? `${prefix}.${key}` : key
    if (isRoutineDefinition(value)) {
      result.push({ name: fullName, routine: value })
    } else if (value && typeof value === 'object') {
      result.push(...extractRoutines(value as Record<string, unknown>, fullName))
    }
  }

  return result
}

export const registerRoutine = (division: RoutineDivisionDefinition): void => {
  const isAlreadyRegistered = registeredRoutines.has(division.name)
  registeredRoutines.set(division.name, division)

  if (!isAlreadyRegistered) {
    const routineCount = extractRoutines(division.routines as Record<string, unknown>).length
    logger.info(`Routine division registered: [${division.name}] with ${routineCount} routines`)
  }
}

export const registerRoutines = (divisions: RoutineDivisionDefinition[]): void => {
  for (const division of divisions) {
    registerRoutine(division)
  }
}

export const getRegisteredRoutineDivision = (name: string): RoutineDivisionDefinition | undefined => {
  return registeredRoutines.get(name)
}

export const getRegisteredRoutines = (): RoutineRegistry => {
  return registeredRoutines
}

export const getActiveScheduledTasks = (): Map<string, ScheduledRoutineEntry> => {
  return activeScheduledTasks
}

export const areRoutinesEnabled = (): boolean => {
  return env.ENABLE_ROUTINES !== 'false'
}

export const startRoutines = (divisions?: RoutineDivisionDefinition[]): void => {
  if (divisions) {
    registerRoutines(divisions)
  }

  if (!areRoutinesEnabled()) {
    logger.info('Routine scheduler disabled via ENABLE_ROUTINES=false')
    return
  }

  const targetDivisions = divisions ?? Array.from(registeredRoutines.values())

  for (const division of targetDivisions) {
    const routines = extractRoutines(division.routines as Record<string, unknown>)

    for (const { name, routine } of routines) {
      const routineKey = `${division.name}.${name}`

      if (activeScheduledTasks.has(routineKey)) {
        logger.warn(`Routine [${routineKey}] is already active. Skipping duplicate startup.`)
        continue
      }

      if (!cron.validate(routine.cronExpression)) {
        logger.error(`Invalid cron expression "${routine.cronExpression}" for routine [${routineKey}]`)
        continue
      }

      let isRunning = false

      const runTask = async (): Promise<void> => {
        if (isRunning) {
          logger.warn(`Routine [${routineKey}] is already running. Skipping execution.`)
          return
        }

        isRunning = true
        const startTime = Date.now()

        try {
          await routine.handler()
          const durationMs = Date.now() - startTime
          logger.info(`Routine [${routineKey}] completed in ${durationMs}ms`)
        } catch (error) {
          const durationMs = Date.now() - startTime
          logger.error(`Error running routine [${routineKey}] after ${durationMs}ms:`, error)
        } finally {
          isRunning = false
        }
      }

      if (routine.runOnInit) {
        runTask().catch((error) => {
          logger.warn(`Initial execution of routine [${routineKey}] failed:`, error)
        })
      }

      const task = cron.schedule(
        routine.cronExpression,
        () => {
          runTask().catch((error) => {
            logger.warn(`Scheduled execution of routine [${routineKey}] failed:`, error)
          })
        },
        {
          timezone: routine.timezone
        }
      )

      activeScheduledTasks.set(routineKey, {
        key: routineKey,
        division: division.name,
        name,
        definition: routine,
        task
      })

      logger.info(`Routine started: [${routineKey}] scheduled as "${routine.cronExpression}"`)
    }
  }
}

export const stopRoutine = (routineKey: string): boolean => {
  const entry = activeScheduledTasks.get(routineKey)
  if (!entry) return false

  try {
    entry.task.stop()
    activeScheduledTasks.delete(routineKey)
    logger.info(`Routine stopped: [${routineKey}]`)
    return true
  } catch (error) {
    logger.error(`Error stopping routine [${routineKey}]:`, error)
    return false
  }
}

export const stopRoutines = (): void => {
  for (const [key, entry] of activeScheduledTasks.entries()) {
    try {
      entry.task.stop()
    } catch (error) {
      logger.error(`Error stopping routine [${key}]:`, error)
    }
  }

  activeScheduledTasks.clear()
  logger.info('All scheduled routines have been stopped')
}

export * from './types'

