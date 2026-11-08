import expireGalleries from './expireGalleries'
import type { RoutineDivisionDefinition } from '@config/routine'

const routines = {
  expireGalleries
}

export const eventsRoutines: RoutineDivisionDefinition<typeof routines> = {
  name: 'events',
  routines
}

export default eventsRoutines
