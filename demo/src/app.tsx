import { useEffect } from 'react'
import { useWaveform } from '../../src'
import trackList from './local-tracks.json'
import { Tracks } from './tracks'
import { Player } from './player'

export default function App() {
  const { loadTracks } = useWaveform()

  useEffect(() => {
    loadTracks(trackList, { endpoint: 'http://localhost:8000/media' })
  }, [loadTracks])

  return (
    <main>
      <Tracks />
      <Player />
    </main>
  )
}
