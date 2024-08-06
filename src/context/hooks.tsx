import {
  useCallback,
  useContext,
} from 'react'
import { AudioTrack, PlayState } from '../types'
import { waveformCtx } from '.'
import { hashCode } from '../utils'

type TrackOptions = {
  reset?: boolean     // load only passed tracks, as opposed
                      // to appending to existing tracks
                      // default value is false
  endpoint?: string   // optional endpoint for media files
  noDedupe?: boolean  // do not dedupe tracks; will still assign unique IDs
}

export const useWaveform = () => {
  const { current, loading, metadata, playState, tracks, _: {
    setCurrent,
    setLoading,
    setPlayState,
    setTracks,
  } } = useContext(waveformCtx)

  const ingestMedia = useCallback((filenames: string[], endpoint?: string): AudioTrack[] => {
    const tracks: AudioTrack[] = filenames.map((filename, index: number) => ({
      id: hashCode(filename, index + 1),
      src: endpoint ? `${endpoint}/${encodeURIComponent(filename)}` : filename,
    }))

    return tracks
  }, [])

  const loadTracks = useCallback((
    tracks: (AudioTrack | string)[],
    options: TrackOptions = { reset: false },
  ) => {
    const { noDedupe, endpoint, reset } = options

    if (!loading) {
      setLoading(true)

      // If tracks are passed as strings, convert them to AudioTrack objects
      const audioTracks: AudioTrack[] = typeof tracks[0] === 'string'
        ? ingestMedia(tracks as string[], endpoint)
        : tracks as AudioTrack[]

      if (reset) {
        setTracks(audioTracks)
      } else {
        setTracks((prev: AudioTrack[]) => [...prev, ...audioTracks]
          .reduce((acc: AudioTrack[], curr: AudioTrack, index: number) => {
          // dedupe
          if (!acc.find(item => item.id === curr.id)) {
            return [...acc, curr]
          } else if (noDedupe) {
            // if noDedupe is set, append the track with a unique ID
            return [...acc, { ...curr, id: `${curr.id}-${index}` }]
          }
          return acc
        }, []))
      }
      setLoading(false)
    }
  }, [ingestMedia, loading, setLoading, setTracks])

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
