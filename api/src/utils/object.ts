export const filterObject = <T extends Record<string, unknown>>(obj: T, keysToExclude: string[]): Partial<T> => {
  return Object.keys(obj)
    .filter((key) => !keysToExclude.includes(key))
    .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {} as Partial<T>)
}

export const removeUndefined = <T extends object>(obj: T): T => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      ;(acc as Record<string, unknown>)[key] = value
    }
    return acc
  }, {} as T)
}
