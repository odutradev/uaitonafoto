export const formatPrivateKey = (key: string): string => {
  return key.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '').trim()
}

export const formatStorageBucket = (bucket: string): string => {
  return bucket.replace(/^gs:\/\//i, '').replace(/\/+$/, '').trim()
}
