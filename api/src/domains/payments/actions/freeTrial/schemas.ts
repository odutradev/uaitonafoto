import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

import { userSchema } from '@domains/users/actions/auth/schemas'

extendZodWithOpenApi(z)

export const claimFreeTrialResponseSchema = z
  .object({
    user: userSchema
  })
  .openapi('ClaimFreeTrialResponse')
