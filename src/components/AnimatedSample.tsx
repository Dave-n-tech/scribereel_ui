import { useEffect, useState } from 'react'

export type StyleName = 'punch' | 'classic' | 'neon' | 'bold' | 'minimal'

const animatedWords: Partial<Record<StyleName, string[]>> = {
  punch: ['watch', 'this', 'now'],
  neon: ['GLOW', 'VIBE', 'FLOW'],
  bold: ['HYPE', 'GO', 'WOW'],
}

type AnimatedSampleProps = {
  style: StyleName
  fallback: string
}

function AnimatedSample({ style, fallback }: AnimatedSampleProps) {
  const [index, setIndex] = useState(0)
  const words = animatedWords[style]

  useEffect(() => {
    if (!words) return
    const interval = window.setInterval(() => setIndex((current) => (current + 1) % words.length), 900)
    return () => window.clearInterval(interval)
  }, [words])

  return <span className={`style-caption-word ${style === 'punch' && index === 1 ? 'hot' : ''}`}>{words?.[index] ?? fallback}</span>
}

export default AnimatedSample
