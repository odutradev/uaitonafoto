import type { claimFreeTrialResponseSchema } from './schemas'
import type { z } from 'zod'

export type ClaimFreeTrialResponse = z.infer<typeof claimFreeTrialResponseSchema>
