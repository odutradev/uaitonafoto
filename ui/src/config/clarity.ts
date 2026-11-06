declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void
  }
}

export const initClarity = (): void => {
  const clarityId = import.meta.env.VITE_CLARITY_PROJECT_ID
  if (!clarityId || typeof window === 'undefined') return

  if (window.clarity) return

  ;(function (
    c: Record<string, unknown>,
    l: Document,
    a: string,
    r: string,
    i: string,
    t?: HTMLScriptElement,
    y?: HTMLElement
  ) {
    const queueTarget = c as { [key: string]: { (...args: unknown[]): void; q?: unknown[] } }
    queueTarget[a] =
      queueTarget[a] ||
      function (...args: unknown[]) {
        ;(queueTarget[a].q = queueTarget[a].q || []).push(args)
      }
    t = l.createElement(r) as HTMLScriptElement
    t.async = true
    t.src = `https://www.clarity.ms/tag/${i}`
    y = l.getElementsByTagName(r)[0] as HTMLElement
    y?.parentNode?.insertBefore(t, y)
  })(window as unknown as Record<string, unknown>, document, 'clarity', 'script', clarityId)
}

export default initClarity
