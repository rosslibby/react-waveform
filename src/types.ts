import { ReactNode } from 'react'

export type ConfigColors = {
  default: string
  active: string
  past: string
}

export interface ConfigOptions {
  colors: ConfigColors
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

export interface AudioTrack {
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
  tracks: AudioTrack[]
  current: AudioTrack | null
  metadata: Metadata
  _: ContextFunctions
}
