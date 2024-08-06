const calculateAverages = (
  buffer: AudioBuffer,
  count: number,
): number[] => {
  const left = buffer.getChannelData(0)
  const right = buffer.getChannelData(1)
  const size = Math.floor(left.length / count)
  const averaged = [
    ...(Array(count))
  ].map(
    (_, index: number) => {
      const start = size * index
      let sum = 0
      for (let i = 0; i < size; i++) {
        sum += Math.max(
          Math.abs(left[start + i]),
          Math.abs(right[start + i]),
        )
      }

      return sum / size
    }
  )

  return averaged
}

export const generateSegments = async (
  src: string,
  count: number,
): Promise<{
  duration: number,
  segments: number[],
}> => {
  const audioContext = new AudioContext()

  try {
    const data: { duration: number, segments: number[] } = await fetch(src)
      .then(async (response) => {
        const data = await response.arrayBuffer()
        return data
      })
      .then((buffer) => audioContext.decodeAudioData(buffer))
      .then((audioBuffer) => {
        const averages = calculateAverages(audioBuffer, count)
        const multiplier = Math.pow(Math.max(...averages), -1)
        const normalized = averages.map(n => n * multiplier)
        const segmentsArray = normalized.map((point: number) => {
          const height = 100 * point // convert point to percentage
          if (height < 0) {
            return 0
          } else if (height > 50) {
            return height - 50
          }

          return height
        })

        return {
          duration: audioBuffer.duration * 1000 / count,
          segments: segmentsArray,
        }
      })
      .catch((err) => {
        throw new Error(err)
      })

    return data
  } catch (err) {
    console.error(err)
    return { duration: 0, segments: [] }
  }
}

// JS implementation of Java's String.hashCode()
export const hashCode = (filename: string, index: number): string => {
  // numbers [0-9], uppercase letters [A-Z], lowercase letters [a-z]
  const characterBounds: [number, number][] = [[48,57],[65,90],[97,122]]
  const [start, end] = characterBounds[Math.floor(Math.random() * characterBounds.length)]
  const numOptions = end - start + 1
  const hashCode: number = filename.split('')
    .reduce(
      (hash: number, char: string) => {
        return 0 | (31 * hash + char.charCodeAt(0))
      }, 0);
  const hashString = (new Date().getTime() * index) + hashCode.toString().split('')
    .reduce(
      (acc: string, char: string) => {
        const arr: string[] = []
        for (let i = 0; i < Number(char); i++) {
          const charIndex = Math.floor(Math.random() * numOptions) + start
          arr.push(String.fromCharCode(charIndex))
        }

        return acc + arr.join('')
      }, '')

  return hashString
}

