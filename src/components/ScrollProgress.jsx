import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function updateProgress() {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(pct)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return <div className="scroll-progress" style={{ width: `${progress}%` }} />
}
