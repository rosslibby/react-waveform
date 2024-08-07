import { useCallback, useEffect, useState } from 'react'
import { useWaveform } from '../../src'

export const useLoading = () => {
  const { loading } = useWaveform()
  const [progress, setProgress] = useState<string>('')

  const updateProgress = useCallback(() => {
    setProgress(
      (progress) => progress.length % 3 === 0 ? '.' : progress + '.'
    )
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (loading) {
      interval = setInterval(() => {
        updateProgress()
      }, 1000 / 3)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [loading, updateProgress])
  
  return { progress }
}
