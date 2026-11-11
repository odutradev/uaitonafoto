import multer, { MulterError } from 'multer'

import { errorResponseSchema } from '@factories/errors/schemas'
import { AllowedMimeTypes } from './types'
import sendError from '@error/index'

import type { DocumentedMiddleware, ResponseConfig } from '@factories/defineAction/types'
import type { Request, Response, NextFunction } from 'express'
import type { AllowedMimeType } from './types'

export const MaxFileSize = 10 * 1024 * 1024

export const MimeExtensionMap: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
}

export const uploadResponses: Record<string, ResponseConfig> = {
  400: {
    description: 'Erro de validação no upload do arquivo ou arquivo ausente',
    schema: errorResponseSchema
  }
}

const multerInstance = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MaxFileSize
  },
  fileFilter: (_req, file, cb) => {
    if (AllowedMimeTypes.includes(file.mimetype as AllowedMimeType)) {
      cb(null, true)
    } else {
      cb(new MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname))
    }
  }
})

const upload = {
  single: (fieldName: string): DocumentedMiddleware => {
    const handler = (req: Request, res: Response, next: NextFunction): void => {
      const uploadHandler = multerInstance.single(fieldName)

      uploadHandler(req, res, (err) => {
        if (err) {
          if (err instanceof MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
              return sendError({
                res,
                code: 'bad_request',
                details: 'O arquivo enviado excede o limite máximo permitido de 10MB.'
              })
            }
          }

          if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.message === 'INVALID_FILE_TYPE') {
            return sendError({
              res,
              code: 'bad_request',
              details: 'Formato de arquivo inválido. Tipos permitidos: JPEG, PNG e WebP.'
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

    const uploadMiddlewareWithDocs: DocumentedMiddleware = Object.assign(handler, {
      responses: uploadResponses
    })

    return uploadMiddlewareWithDocs
  }
}

export default upload
