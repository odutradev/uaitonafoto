import type { RoutineDivisionDefinition } from '@config/routine'

﻿import expireGalleries from './expireGalleries'

const routines = {
  expireGalleries
}

export const eventsRoutines: RoutineDivisionDefinition<typeof routines> = {
  name: 'events',
  routines
}

export default eventsRoutines
