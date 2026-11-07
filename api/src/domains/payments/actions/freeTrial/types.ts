import type { z } from 'zod'
import type { claimFreeTrialResponseSchema } from './schemas'

export type ClaimFreeTrialResponse = z.infer<typeof claimFreeTrialResponseSchema>
