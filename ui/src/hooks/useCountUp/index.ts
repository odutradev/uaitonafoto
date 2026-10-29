import { useEffect, useState } from 'react'

const getStep = (value: number): number => {
  const abs = Math.abs(value)
  if (abs >= 100_000_000) return 1_000_000
  if (abs >= 1_000_000) return 100_000
  if (abs >= 100_000) return 10_000
  if (abs >= 10_000) return 1_000
  if (abs >= 100) return 5
  return 1
}

export const useCountUp = (target: number, duration = 2200, startDelay = 200): number => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    setCurrent(0)
    if (!target || isNaN(target) || target <= 0) {
      return
    }

    const step = getStep(target)
    let animationFrameId: number
    let timeoutId: ReturnType<typeof setTimeout>

    timeoutId = setTimeout(() => {
      const startTime = performance.now()

      const animate = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const rawValue = target * easeOut

        if (progress < 1) {
          const steppedValue = Math.round(rawValue / step) * step
          setCurrent(steppedValue)
          animationFrameId = requestAnimationFrame(animate)
        } else {
          setCurrent(target)
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }, startDelay)

    return () => {
      clearTimeout(timeoutId)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [target, duration, startDelay])

  return current
}

export default useCountUp
