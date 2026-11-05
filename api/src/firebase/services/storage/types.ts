import type { Bucket, File } from '@google-cloud/storage'

export type StorageBucket = Bucket
export type StorageFile = File

export interface UploadFileOptions {
  path: string
  file: Buffer | Uint8Array | string
  contentType?: string
  isPublic?: boolean
  metadata?: Record<string, string | number | boolean>
  cacheControl?: string
  resumable?: boolean
  bucketName?: string
}

export interface UploadFileResult {
  path: string
  name: string
  bucket: string
  size: number
  contentType: string
  publicUrl: string
}

export interface DeleteFileOptions {
  bucketName?: string
  ignoreNotFound?: boolean
}

export interface DeleteFilesResult {
  deleted: string[]
  failed: string[]
}

export interface StorageFileMetadata {
  name: string
  bucket: string
  size: number
  contentType?: string
  timeCreated?: string
  updated?: string
  md5Hash?: string
  metadata?: Record<string, string>
}

export interface SignedUrlOptions {
  expiresInMs?: number
  expires?: Date | string | number
  bucketName?: string
  responseDisposition?: string
  responseType?: string
}

export interface SignedUploadUrlOptions {
  expiresInMs?: number
  expires?: Date | string | number
  contentType?: string
  bucketName?: string
}

export interface ListFilesOptions {
  prefix?: string
  maxResults?: number
  pageToken?: string
  bucketName?: string
}

export interface ListFileItem {
  name: string
  size?: number
  contentType?: string
  updated?: string
  publicUrl: string
}

export interface ListFilesResult {
  files: ListFileItem[]
  nextPageToken?: string
}

