import {
  useCallback,
  useContext,
} from 'react'
import { AudioSample, PlayState } from '../types'
import { waveformCtx } from '.'

export const useWaveform = () => {
  const { current, loading, metadata, playState, samples, _: {
    setCurrent,
    setLoading,
    setPlayState,
    setSamples,
  } } = useContext(waveformCtx)

  const loadSamples = useCallback((
    samples: AudioSample[],
    reset: boolean = false, // load only passed samples, as opposed
                            // to appending to existing samples
  ) => {
    if (!loading) {
      setLoading(true)

      if (reset) {
        setSamples(samples)
      } else {
        setSamples((prev: AudioSample[]) => [...prev, ...samples]
          .reduce((acc: AudioSample[], curr: AudioSample) => {
          // dedupe
          if (!acc.find(item => item.id === curr.id)) {
            return [...acc, curr]
          }
          return acc
        }, []))
      }
      setLoading(false)
    }
  }, [loading, setLoading, setSamples])

  const armTrack = useCallback((id: number | string) => {
    if (playState.id === id) {
      setPlayState((prev: PlayState) => ({
        ...prev,
        playing: !prev.playing,
      }))
    }
    const newCurrent = samples.find((sample) => sample.id === id) || null
    setCurrent(newCurrent)
  }, [playState, samples, setCurrent, setPlayState])

  return {
    armTrack,
    current,
    loading,
    loadSamples,
    metadata,
    samples,
  }
}
