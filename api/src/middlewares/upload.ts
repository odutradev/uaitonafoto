import multer, { MulterError } from 'multer'
import sendError from '@/error'
import type { Request, Response, NextFunction } from 'express'

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'] as const
export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number]

export const MIME_EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'application/pdf': 'pdf'
}

const multerInstance = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype as AllowedMimeType)) {
      cb(null, true)
    } else {
      cb(new MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname))
    }
  }
})

const upload = {
  single: (fieldName: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      const uploadHandler = multerInstance.single(fieldName)

      uploadHandler(req, res, (err) => {
        if (err) {
          if (err instanceof MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
              return sendError({
                res,
                code: 'bad_request',
                details: 'O arquivo enviado excede o limite máximo permitido de 5MB.'
              })
            }
          }

          if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.message === 'INVALID_FILE_TYPE') {
            return sendError({
              res,
              code: 'bad_request',
              details: 'Formato de arquivo inválido. Tipos permitidos: JPEG, PNG e PDF.'
            })
          }

          return sendError({
            res,
            code: 'bad_request',
            details: err.message || 'Erro ao processar o upload do arquivo.'
          })
        }

        next()
      })
    }
  }
}

export default upload