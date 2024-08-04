import { useRef } from 'react'
import { playerStyles } from '../styles'
import { useAudioPlayer } from './hooks'

export const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const { current } = useAudioPlayer(audioRef)

  return current ? (
    <audio
      style={playerStyles}
      src={current.src}
      controls
      ref={audioRef}
    />
  ): null
}
