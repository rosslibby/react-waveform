import { CSSProperties } from 'react'

export const playerStyles = {
  display: 'none',
  position: 'absolute',
  left: '-99999px',
  top: '-99999px',
  opacity: 0,
  visibility: 'hidden',
} as CSSProperties

type WaveStyles = {
  duration: number
  activeColor: string
  defaultColor: string
  pastColor: string
  radius: string
  activeHeight: string
  segments: number
  gap: string
}

export const waveStyles = (props: WaveStyles): CSSProperties => ({
  '--duration': `${props.duration}ms`,
  '--active-color': props.activeColor,
  '--default-color': props.defaultColor,
  '--past-color': props.pastColor,
  '--radius': props.radius,
  '--active-height': props.activeHeight,
  alignItems: 'center',
  display: 'grid',
  gridAutoFlow: 'column',
  gap: props.gap,
  gridTemplateColumns: `repeat(${props.segments}, 1fr)`,
  height: '100%',
  position: 'relative',
  width: '100%',
}) as CSSProperties

type SegmentStyles = {
  active: boolean
  past: boolean
  height: string
}

export const segmentStyles = (props: SegmentStyles): CSSProperties => {
  const { active, past, height } = props
  const color = active
    ? 'active'
    : past
      ? 'past'
      : 'default'

  return {
    backgroundColor: `var(--${color}-color)`,
    borderRadius: `var(--radius)`,
    display: 'block',
    height: height,
    maxHeight: '100%',
    position: 'relative',
    transition: 'all var(--duration) ease',
  }
}
