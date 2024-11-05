import { createRoot } from 'react-dom/client'
import { WaveformProvider } from '../../src'
import App from './app'
import './styles.css'

const root = document.getElementById('root')!
createRoot(root).render(
  <WaveformProvider>
    <App />
  </WaveformProvider>
)
