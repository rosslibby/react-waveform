import { useWaveform, Waveform } from '../../src'
import { useLoading } from './loading'

const PlayPauseButton = ({ id }: { id: string | number }) => {
  const { armTrack, metadata } = useWaveform()
  const onClick = () => armTrack(id)
  const isPlaying = metadata.id === id && metadata.playing

  if (!isPlaying) {
    return (
      <button onClick={onClick}>
        <span className="inner">
          <span className="icon icon--play">&#9658;</span>
        </span>
      </button>
    )
  } else {
    return (
      <button onClick={onClick}>
        <span className="inner">
          <span className="icon icon--pause">&#x23F8;</span>
        </span>
      </button>
    )
  }
}

export const Tracks = () => {
  const { tracks } = useWaveform()
  const { progress } = useLoading()

  return (
    <div className="track-list">
      {tracks.length === 0 && <span>{progress}</span>}
      {tracks.map((track) => (
        <div key={track.id} className="track">
          <PlayPauseButton id={track.id} />
          <Waveform track={track} />
        </div>
      ))}
    </div>
  )
}
