import { useContext } from 'react'
import { waveformCtx } from '../context'
import { segmentStyles } from '../styles'

type SegmentProps = {
  active: boolean
  height: number
  past: boolean
}

export const Segment = ({
  active,
  height,
  past,
}: SegmentProps) => {
  const { playState } = useContext(waveformCtx)
  const segmentHeight = active
    ? `calc(${height}% + var(--active-height))`
    : `${height}%`
  const styles = segmentStyles({
    active,
    height: segmentHeight,
    past: past && !playState.completed,
  })

  return (
    <i style={styles} />
  )
}
