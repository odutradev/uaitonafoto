interface ProcessWithWarningSuppression {
  __punycode_warning_suppressed?: boolean
}

export const suppressPunycodeWarning = (): void => {
  const customProcess = process as unknown as ProcessWithWarningSuppression

  if (customProcess.__punycode_warning_suppressed) {
    return
  }

  customProcess.__punycode_warning_suppressed = true

  const originalEmitWarning = process.emitWarning

  process.emitWarning = (warning: string | Error, ...args: unknown[]): void => {
    if (typeof warning === 'string' && warning.includes('punycode')) {
      return
    }

    if (typeof warning === 'object' && warning !== null) {
      const code = (warning as { code?: string }).code
      const name = warning.name
      const message = warning.message || ''

      if (code === 'DEP0040' || (name === 'DeprecationWarning' && message.includes('punycode'))) {
        return
      }
    }

    Reflect.apply(originalEmitWarning, process, [warning, ...args])
  }
}

export default suppressPunycodeWarning
