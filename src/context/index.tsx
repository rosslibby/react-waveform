import { createContext, useEffect, useState } from 'react'
import {
  WaveformContext,
  AudioSample,
  PlayState,
  Metadata,
  ProviderProps,
  ConfigOptions,
} from '../types'
import { AudioPlayer } from '../player'

const initialPlayState: PlayState = {
  id: '',
  elapsed: 0,
  playing: false,
  completed: false,
}

const initialMetadata: Metadata = {
  ms: 0,
  seconds: 0,
  minutes: 0,
  duration: 0,
}

const defaultOptions: ConfigOptions = {
  colors: {
    default: '#6871ff',
    active: '#68ffc9',
    past: '#68ffc9',
  },
  radius: '1.5px',
  activeHeight: '30%',
  gap: '1px',
}

export const waveformCtx = createContext<WaveformContext>({
  options: defaultOptions,
  playState: initialPlayState,
  loading: false,
  samples: [],
  current: null,
  metadata: initialMetadata,
  _: {},
})

export function WaveformProvider({
  children,
  options = defaultOptions,
}: ProviderProps) {
  const [metadata, setMetadata] = useState<Metadata>(initialMetadata)
  const [playState, setPlayState] = useState<PlayState>(initialPlayState)
  const [loading, setLoading] = useState<boolean>(false)
  const [samples, setSamples] = useState<AudioSample[]>([])
  const [playing, setPlaying] = useState<boolean>(false)
  const [current, setCurrent] = useState<AudioSample | null>(null)

  useEffect(() => {
    if (current) {
      setPlayState({
        ...initialPlayState,
        playing: true,
        id: current.id,
      })
    }
  }, [current, setMetadata, setPlayState])

  const values = {
    options: { ...defaultOptions, ...options },
    current,
    loading,
    metadata,
    playing,
    playState,
    samples,
  }
  const fns = {
    setCurrent,
    setLoading,
    setMetadata,
    setPlaying,
    setPlayState,
    setSamples,
  }

  return (
    <waveformCtx.Provider value={{ ...values, _: fns }}>
      {children}
      <AudioPlayer />
    </waveformCtx.Provider>
  )
}
