import { useWaveform, Waveform } from '../../src'
import { useLoading } from './loading'

export const Tracks = () => {
  const { armTrack, tracks } = useWaveform()
  const { progress } = useLoading()

  return (
    <div className="track-list">
      {tracks.length === 0 && <span>{progress}</span>}
      {tracks.map((track) => (
        <div key={track.id} className="track">
          <button onClick={() => armTrack(track.id)}>
            <span className="inner">
              <span className="icon">&#9658;</span>
            </span>
          </button>
          <Waveform track={track} />
        </div>
      ))}
    </div>
  )
}
