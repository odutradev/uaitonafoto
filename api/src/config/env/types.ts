import { z } from 'zod'

export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test'], {
    errorMap: () => ({ message: "NODE_ENV deve ser 'development', 'production' ou 'test'" })
  }),
  PORT: z.coerce
    .number({ invalid_type_error: 'PORT deve ser um número válido' })
    .int('PORT deve ser um número inteiro')
    .min(1, 'PORT deve ser maior que 0')
    .max(65535, 'PORT deve ser menor ou igual a 65535'),
  FRONTEND_URL: z
    .string()
    .url('FRONTEND_URL deve ser uma URL válida (ex: http://localhost:1000)'),
  CORS_ORIGIN: z
    .string()
    .min(1, 'CORS_ORIGIN não pode ser vazio'),
  JWT_SECRET: z
    .string()
    .min(16, 'JWT_SECRET deve ter no mínimo 16 caracteres para segurança'),
  MONGODB_URI: z
    .string()
    .regex(/^mongodb(\+srv)?:\/\//, 'MONGODB_URI deve ser uma string de conexão MongoDB válida (mongodb:// ou mongodb+srv://)'),
  MONGODB_DB_NAME: z
    .string()
    .min(1, 'MONGODB_DB_NAME não pode ser vazio'),
  FIREBASE_PROJECT_ID: z
    .string()
    .min(1, 'FIREBASE_PROJECT_ID não pode ser vazio'),
  FIREBASE_CLIENT_EMAIL: z
    .string()
    .email('FIREBASE_CLIENT_EMAIL deve ser um e-mail válido da conta de serviço Firebase'),
  FIREBASE_PRIVATE_KEY: z
    .string()
    .min(1, 'FIREBASE_PRIVATE_KEY não pode ser vazio'),
  FIREBASE_STORAGE_BUCKET: z
    .string()
    .min(1, 'FIREBASE_STORAGE_BUCKET não pode ser vazio'),
  EMAIL_HOST: z
    .string()
    .min(1, 'EMAIL_HOST não pode ser vazio')
    .optional(),
  EMAIL_PORT: z.coerce
    .number()
    .int()
    .positive()
    .optional(),
  EMAIL_USER: z
    .string()
    .min(1, 'EMAIL_USER não pode ser vazio')
    .optional(),
  EMAIL_PASS: z
    .string()
    .min(1, 'EMAIL_PASS não pode ser vazio')
    .optional(),
  EMAIL_FROM: z
    .string()
    .min(1, 'EMAIL_FROM não pode ser vazio')
    .optional(),
  ABACATEPAY_API_KEY: z
    .string()
    .min(1, 'ABACATEPAY_API_KEY não pode ser vazio'),
  ABACATEPAY_WEBHOOK_SECRET: z
    .string()
    .min(1, 'ABACATEPAY_WEBHOOK_SECRET não pode ser vazio'),
  ABACATEPAY_PIX_ONLY: z
    .preprocess(
      (val) => (val === '' ? undefined : val),
      z.enum(['true', 'false'], {
        errorMap: () => ({ message: "ABACATEPAY_PIX_ONLY deve ser 'true' ou 'false'" })
      }).optional()
    ),
  CHECKOUT_EXPIRATION_HOURS: z.coerce
    .number()
    .positive()
    .default(24),
  SWAGGER_ENABLED: z
    .enum(['true', 'false'])
    .optional(),
  ENABLE_ROUTINES: z
    .enum(['true', 'false'])
    .optional()
})

export type ServerEnv = z.infer<typeof serverEnvSchema>
