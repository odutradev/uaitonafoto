import sendEventNotifications from './sendEventNotifications'
import expireGalleries from './expireGalleries'

import type { RoutineDivisionDefinition } from '@config/routine'

const routines = {
  expireGalleries,
  sendEventNotifications
}

export const eventsRoutines: RoutineDivisionDefinition<typeof routines> = {
  name: 'events',
  routines
}

export default eventsRoutines
