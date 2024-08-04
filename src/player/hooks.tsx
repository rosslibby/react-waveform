import { RefObject, useCallback, useContext, useEffect } from 'react'
import { waveformCtx } from '../context'
import { usePlayerControls } from '../wave/hooks'

export const useAudioPlayer = (audioRef: RefObject<HTMLAudioElement>) => {
  const { current, playState } = useContext(waveformCtx)
  const { playing, playPause } = usePlayerControls()

  const onPlaying = useCallback((e: Event) => {
    const audioEl = e.target as HTMLAudioElement
    playing(audioEl.currentTime)
  }, [playing])

  const onPlayPause = useCallback((e: Event) => {
    const audioEl = e.target as HTMLAudioElement
    playPause(audioEl.currentTime, audioEl.duration)
  }, [playPause])

  const onPause = useCallback((e: Event) => {
    const audioEl = e.target as HTMLAudioElement
    playPause(audioEl.currentTime, audioEl.duration, true)
  }, [playPause])

  const onEnded = useCallback((e: Event) => {
    const audioEl = e.target as HTMLAudioElement
    playPause(audioEl.currentTime, audioEl.duration)
  }, [playPause])

  useEffect(() => {
    let audioEl = audioRef.current || null

    if (!audioEl) {
      return
    }

    audioEl.onplay = onPlayPause
    audioEl.onpause = onPause
    audioEl.onended = onEnded
    audioEl.ontimeupdate = onPlaying

    if (playState.playing) {
      audioEl.play()
    } else if (!playState.playing) {
      audioEl.pause()
    }

    return () => {
      audioEl = null
    }
  }, [audioRef, onEnded, onPause, onPlaying, onPlayPause, playState])

  return { current }
}
