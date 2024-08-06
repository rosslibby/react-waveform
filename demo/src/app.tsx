import { useEffect } from 'react'
import { AudioTrack, useWaveform } from '../../src'
import trackList from './audio-data.json'
import { Tracks } from './tracks'
import { Player } from './player'

export default function App() {
  const { loadTracks, tracks } = useWaveform()

  useEffect(() => {
    loadTracks(trackList as AudioTrack[])
  }, [loadTracks])

  return (
    <main>
      <Tracks />
      <Player />
    </main>
  )
}
