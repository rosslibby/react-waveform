import { ReactNode } from 'react'

export type ConfigOptions = {
  colors: {
    default: string
    active: string
    past: string
  }
  radius: string
  activeHeight: string
  gap: string
}

export interface ProviderProps {
  children: ReactNode
  options?: Partial<ConfigOptions>
}

export type ContextFunctions = {
  [key: string]: Function
}

export interface AudioSample {
  id: number | string
  src: string
}

export interface Metadata {
  ms: number
  seconds: number
  minutes: number
  duration: number
}

export interface PlayState {
  id: number | string
  playing: boolean
  elapsed: number
  completed: boolean
}

export interface WaveformContext {
  options: ConfigOptions
  playState: PlayState
  loading: boolean
  samples: AudioSample[]
  current: AudioSample | null
  metadata: Metadata
  _: ContextFunctions
}
