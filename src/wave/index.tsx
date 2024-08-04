import { useContext, useRef } from 'react'
import { AudioSample, ConfigOptions } from '../types'
import { useWave } from './hooks'
import { Segment } from './segment'
import { waveformCtx } from '../context'
import { waveStyles } from '../styles'

type WaveProps = {
  columns?: number
  sample: AudioSample
  options?: Partial<ConfigOptions>
}

export const Waveform = ({
  columns = 60,
  sample,
  options = {},
}: WaveProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { options: ctxOptions } = useContext(waveformCtx)
  const configOptions = { ...ctxOptions, ...options }
  const {
    activeIndex,
    duration,
    isCurrentPlaying,
    segments,
  } = useWave(sample, columns)
  const styles = waveStyles({
    activeColor: configOptions.colors.active,
    defaultColor: configOptions.colors.default,
    duration,
    gap: configOptions.gap,
    pastColor: configOptions.colors.past,
    radius: configOptions.radius,
    segments: segments.length,
    activeHeight: configOptions.activeHeight,
  })

  return (
    <div style={styles} ref={containerRef}>
      {segments.map((segment: number, index: number) => (
        <Segment
          active={activeIndex === index && isCurrentPlaying}
          key={`segment-${sample.id}-${index}`}
          height={segment}
          past={activeIndex > index}
        />
      ))}
    </div>
  )
}
