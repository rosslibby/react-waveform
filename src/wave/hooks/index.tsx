import { useCallback, useContext, useEffect, useState } from 'react'
import { generateSegments } from '../../utils'
import { AudioSample, Metadata, PlayState } from '../../types'
import { waveformCtx } from '../../context'

export const useWave = (sample: AudioSample, count: number = 60) => {
  const { playState, _: fns } = useContext(waveformCtx)
  const { setMetadata, setSamples } = fns
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [segments, setSegments] = useState<number[]>([])
  const isCurrent = playState.id === sample.id
  const isCurrentPlaying = isCurrent && playState.playing
  const createSegments = useCallback(async () => {
    const { duration, segments } = await generateSegments(sample.src, count)
    setDuration(duration)
    setSegments(segments)
  }, [count, sample, setDuration, setSegments, setSamples])

  // Track the current segment of the sample being played
  const updateActiveIndex = useCallback(() => {
    setActiveIndex((prev: number) => {
      return prev + 1
    })
  }, [setActiveIndex])

  // Set active index to 0 when the current sample has finished playing
  const resetActiveIndex = useCallback(() => {
    setActiveIndex(0)
  }, [setActiveIndex])

  const updateMetadata = useCallback((duration: number) => {
    setMetadata((prev: Metadata) => ({
      ms: 0,
      seconds: 0,
      minutes: 0,
      duration,
    }))
  }, [setMetadata])

  // Set metadata when sample is armed
  useEffect(() => {
    if (isCurrentPlaying) {
      updateMetadata(duration)
    }
  }, [duration, isCurrentPlaying, updateMetadata])

  useEffect(() => {
    if (
      (isCurrent && playState.completed)
      || (!isCurrent && activeIndex > 0)
    ) {
      resetActiveIndex()
    }
  }, [activeIndex, isCurrent, playState.completed, resetActiveIndex])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isCurrentPlaying && !interval) {
      interval = setInterval(() => {
        updateActiveIndex()
      }, duration)
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [duration, isCurrentPlaying, updateActiveIndex])

  useEffect(() => {
    createSegments()
  }, [createSegments])

  return {
    activeIndex,
    duration,
    isCurrentPlaying,
    segments,
    updateMetadata,
  }
}

export const usePlayerControls = () => {
  const { _: { setMetadata, setPlayState } } = useContext(waveformCtx)

  const playPause = useCallback(
    (elapsed: number, duration: number, pause: boolean = false) => {
      setPlayState((prev: PlayState) => ({
        ...prev,
        elapsed,
        ...(pause ? { playing: false } : {}),
        completed: elapsed === duration,
      }))
    }, [setPlayState]
  )

  const playing = useCallback((currentTime: number) => {
    const ms = currentTime * 1000 // currentTime comes in as a
                                  // decimal of a second, so we must
                                  // convert it to milliseconds
    setPlayState((prev: PlayState) => ({
      ...prev,
      elapsed: ms,
    }))
    setMetadata((prev: Metadata) => ({
      ...prev,
      ms,
      seconds: Math.floor(ms / 1000),
      minutes: Math.floor(ms / 60000),
    }))
  }, [setMetadata, setPlayState])

  return { playing, playPause }
}
