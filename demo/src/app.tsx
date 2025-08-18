import { Tracks } from './tracks'
import { Player } from './player'
import { useAudioServer } from './api'

export default function App() {
  useAudioServer('http://localhost:3030/tracks');

  return (
    <main>
      <Tracks />
      <Player />
    </main>
  )
}
