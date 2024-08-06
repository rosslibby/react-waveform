import { useWaveform, Waveform } from '../../src'

export const Player = () => {
  const { current } = useWaveform()

  return current ? (
    <div className="player">
      <Waveform
        track={current}
        columns={180}
        options={{
          colors: {
            active: '#9ad0ffc4',
            default: '#0b0c0e30',
            past: '#7aa7ff40',
          },
          activeHeight: '20%',
        }}
      />
    </div>
  ) : (
    <div className="player">
      <h2>No track is currently armed.</h2>
    </div>
  )
}
