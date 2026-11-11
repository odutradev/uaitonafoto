import getErrorShape from '@utils/errorShape'
import { getStorageBucket } from './index'

import type { DeleteFileOptions, DeleteFilesResult, ListFilesOptions, ListFilesResult, SignedUploadUrlOptions, SignedUrlOptions, StorageFileMetadata, UploadFileOptions, UploadFileResult } from './types'
import type { File } from '@google-cloud/storage'

const sanitizePath = (path: string): string => {
  return path.replace(/^\/+/, '').trim()
}

export const getStorageFile = (path: string, bucketName?: string): File => {
  const bucket = getStorageBucket(bucketName)
  return bucket.file(sanitizePath(path))
}

export const uploadFile = async (options: UploadFileOptions): Promise<UploadFileResult> => {
  const {
    path,
    file: content,
    contentType = 'application/octet-stream',
    isPublic = false,
    metadata,
    cacheControl,
    resumable = false,
    bucketName
  } = options

  const bucket = getStorageBucket(bucketName)
  const cleanPath = sanitizePath(path)
  const file = bucket.file(cleanPath)

  const buffer = typeof content === 'string' ? Buffer.from(content) : Buffer.from(content)

  await file.save(buffer, {
    contentType,
    resumable,
    public: isPublic,
    metadata: {
      contentType,
      ...(cacheControl ? { cacheControl } : {}),
      ...(metadata ? { metadata } : {})
    }
  })

  if (isPublic) {
    try {
      await file.makePublic()
    } catch {
    }
  }

  const publicUrl = file.publicUrl()

  return {
    path: cleanPath,
    name: file.name,
    bucket: bucket.name,
    size: buffer.length,
    contentType,
    publicUrl
  }
}

export const fileExists = async (path: string, bucketName?: string): Promise<boolean> => {
  const file = getStorageFile(path, bucketName)
  const [exists] = await file.exists()
  return exists
}

export const deleteFile = async (path: string, options?: DeleteFileOptions): Promise<boolean> => {
  const file = getStorageFile(path, options?.bucketName)
  const ignoreNotFound = options?.ignoreNotFound ?? true

  try {
    await file.delete({ ignoreNotFound })
    return true
  } catch (error) {
    const { code, errors } = getErrorShape(error)
    if (ignoreNotFound && (code === 404 || errors?.[0]?.reason === 'notFound')) {
      return false
    }
    throw error
  }
}

export const deleteFiles = async (
  paths: string[],
  options?: DeleteFileOptions
): Promise<DeleteFilesResult> => {
  const deleted: string[] = []
  const failed: string[] = []

  await Promise.allSettled(
    paths.map(async (path) => {
      try {
        const success = await deleteFile(path, options)
        if (success) {
          deleted.push(path)
        } else {
          failed.push(path)
        }
      } catch {
        failed.push(path)
      }
    })
  )

  return { deleted, failed }
}

export const deleteDirectory = async (prefix: string, options?: { bucketName?: string }): Promise<void> => {
  const bucket = getStorageBucket(options?.bucketName)
  const cleanPrefix = sanitizePath(prefix)
  await bucket.deleteFiles({ prefix: cleanPrefix })
}

export const getFileMetadata = async (
  path: string,
  bucketName?: string
): Promise<StorageFileMetadata | null> => {
  const file = getStorageFile(path, bucketName)

  try {
    const [metadata] = await file.getMetadata()
    return {
      name: file.name,
      bucket: file.bucket.name,
      size: Number(metadata.size || 0),
      contentType: metadata.contentType,
      timeCreated: metadata.timeCreated,
      updated: metadata.updated,
      md5Hash: metadata.md5Hash,
      metadata: metadata.metadata as Record<string, string> | undefined
    }
  } catch (error) {
    const { code, errors } = getErrorShape(error)
    if (code === 404 || errors?.[0]?.reason === 'notFound') {
      return null
    }
    throw error
  }
}

export const getFileBuffer = async (path: string, bucketName?: string): Promise<Buffer> => {
  const file = getStorageFile(path, bucketName)
  const [buffer] = await file.download()
  return buffer
}

export const getSignedDownloadUrl = async (
  path: string,
  options?: SignedUrlOptions
): Promise<string> => {
  const file = getStorageFile(path, options?.bucketName)
  const expiresInMs = options?.expiresInMs ?? 60 * 60 * 1000
  const expires = options?.expires ?? Date.now() + expiresInMs

  const [url] = await file.getSignedUrl({
    action: 'read',
    expires,
    ...(options?.responseDisposition ? { responseDisposition: options.responseDisposition } : {}),
    ...(options?.responseType ? { responseType: options.responseType } : {})
  })

  return url
}

export const getSignedUploadUrl = async (
  path: string,
  options?: SignedUploadUrlOptions
): Promise<string> => {
  const file = getStorageFile(path, options?.bucketName)
  const expiresInMs = options?.expiresInMs ?? 15 * 60 * 1000
  const expires = options?.expires ?? Date.now() + expiresInMs

  const [url] = await file.getSignedUrl({
    action: 'write',
    expires,
    ...(options?.contentType ? { contentType: options.contentType } : {})
  })

  return url
}

export const getPublicUrl = (path: string, bucketName?: string): string => {
  const file = getStorageFile(path, bucketName)
  return file.publicUrl()
}

export const makeFilePublic = async (path: string, bucketName?: string): Promise<string> => {
  const file = getStorageFile(path, bucketName)
  await file.makePublic()
  return file.publicUrl()
}

export const makeFilePrivate = async (path: string, bucketName?: string): Promise<void> => {
  const file = getStorageFile(path, bucketName)
  await file.makePrivate()
}

export const listFiles = async (options?: ListFilesOptions): Promise<ListFilesResult> => {
  const bucket = getStorageBucket(options?.bucketName)
  const cleanPrefix = options?.prefix ? sanitizePath(options.prefix) : undefined

  const [files, nextQuery] = await bucket.getFiles({
    prefix: cleanPrefix,
    maxResults: options?.maxResults,
    pageToken: options?.pageToken,
    autoPaginate: false
  })

  return {
    files: files.map((f) => ({
      name: f.name,
      size: Number(f.metadata?.size || 0),
      contentType: f.metadata?.contentType,
      updated: f.metadata?.updated,
      publicUrl: f.publicUrl()
    })),
    nextPageToken: nextQuery?.pageToken
  }
}

export const storageUtils = {
  getStorageFile,
  uploadFile,
  fileExists,
  deleteFile,
  deleteFiles,
  deleteDirectory,
  getFileMetadata,
  getFileBuffer,
  getSignedDownloadUrl,
  getSignedUploadUrl,
  getPublicUrl,
  makeFilePublic,
  makeFilePrivate,
  listFiles
}

