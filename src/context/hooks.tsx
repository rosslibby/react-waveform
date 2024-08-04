import {
  useCallback,
  useContext,
} from 'react'
import { AudioTrack, PlayState } from '../types'
import { waveformCtx } from '.'

export const useWaveform = () => {
  const { current, loading, metadata, playState, tracks, _: {
    setCurrent,
    setLoading,
    setPlayState,
    setTracks,
  } } = useContext(waveformCtx)

  const loadTracks = useCallback((
    tracks: AudioTrack[],
    reset: boolean = false, // load only passed tracks, as opposed
                            // to appending to existing tracks
  ) => {
    if (!loading) {
      setLoading(true)

      if (reset) {
        setTracks(tracks)
      } else {
        setTracks((prev: AudioTrack[]) => [...prev, ...tracks]
          .reduce((acc: AudioTrack[], curr: AudioTrack) => {
          // dedupe
          if (!acc.find(item => item.id === curr.id)) {
            return [...acc, curr]
          }
          return acc
        }, []))
      }
      setLoading(false)
    }
  }, [loading, setLoading, setTracks])

  const armTrack = useCallback((id: number | string) => {
    if (playState.id === id) {
      setPlayState((prev: PlayState) => ({
        ...prev,
        playing: !prev.playing,
      }))
    }
    const newCurrent = tracks.find((track) => track.id === id) || null
    setCurrent(newCurrent)
  }, [playState, tracks, setCurrent, setPlayState])

  return {
    armTrack,
    current,
    loading,
    loadTracks,
    metadata,
    tracks,
  }
}
