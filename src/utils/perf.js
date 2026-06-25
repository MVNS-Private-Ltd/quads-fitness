export function isLowEndDevice() {
  if (typeof window === 'undefined') return false

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const cores = navigator.hardwareConcurrency || 4
  const mem = navigator.deviceMemory || 4 // in GB (if supported)
  const effectiveType = navigator.connection?.effectiveType || ''

  // Heuristic: treat as low-end if CPU/RAM is small or network is slow.
  const slowNetwork = ['2g', '3g'].includes(String(effectiveType).toLowerCase())
  const lowCpu = cores <= 4
  const lowMem = mem <= 4

  return Boolean(reducedMotion || lowCpu || lowMem || slowNetwork)
}

export function shouldReduce3DQuality() {
  return isLowEndDevice()
}

