# Installation

npm                               | yarn
--------------------------------- | ------------------------------------ |
`npm i react-waveform-visualizer` | `yarn add react-waveform-visualizer`

<br />

# Types

### AudioSample
```ts
interface AudioSample {
  id: number | string
  src: string
}
```

### ConfigOptions
```ts
type ConfigOptions = {
  colors: {
    active: string,
    default: string,
    past: string,
  },
  radius: string,
  activeHeight: string,
  gap: string,
}
```

<br />

# Components

## WaveformProvider
```tsx
import React from 'react'
import { WaveformProvider } from 'react-waveform-visuzalizer'

export default function App({ children }: {
  children: React.ReactNode,
}) {
  return (
    <WaveformProvider>
      {children}
    </WaveformProvider>
  )
}
```

`WaveformProvider` takes an optional argument of `options: ConfigOptions`. These options will apply to every `<Waveform />` component that _does not_ have its own `ConfigOptions` set.
```tsx
import React from 'react'
import { WaveformProvider, ConfigOptions } from 'react-waveform-visualizer'

const options: ConfigOptions = {
  colors: {
    active: 'rgba(255, 0, 0, 1)',
    default: 'rgba(255, 0, 0, 0.75)',
    past: 'rgba(255, 0, 0, 0.5)',
  },
  activeHeight: '0.375rem',
  gap: '2px',
  radius: '4px',
}

export default function App(props: React.ComponentProps) {
  return (
    <WaveformProvider options={options}>
      {props.children}
    </WaveformProvider>
  )
}
```

## Waveform
```tsx
// audio-player.tsx
import { AudioSample, Waveform } from 'react-waveform-visualizer'

export function AudioPlayer({ sample }: {
  sample: AudioSample
}) {
  return (
    <Waveform sample={sample} />
  )
}
```
`<Waveform />` can take three arguments:

- `sample: AudioSample`
- `columns: number` (optional)
- `options: ConfigOptions` (optional)

argument | description | type
--- | --- | ---
`sample` | An object containing the `id` and `src` of the track | `AudioSample`
`columns` | Specifies the number of segments in the rendered audio wave. Default value is `60` | `number`
`options` | Optional styling specifications. These options will override any default options or options set in the `WaveformProvider` | `ConfigOptions`

```tsx
// custom-audio-player.tsx
import { AudioSample, ConfigOptions, Waveform } from 'react-waveform-visualizer'

export function AudioPlayer({ sample, activeColor, gap }: {
  activeColor: string,
  gap: string,
  sample: AudioSample
}) {
  const options: Partial<ConfigOptions> = {
    colors: {
      active: activeColor,
    },
    gap: gap,
  }

  return (
    <Waveform sample={sample} options={options} />
  )
}
```

<br />

# Hooks

## useWaveform

The `useWaveform` hook exposes the following variables and functions:
name  | description | type | arguments
----- | ----------- | ---- | ---------
`armTrack` | Plays an audio sample from the `samples` array | Function | `id: number \| string`
`current` | The currently armed track | Object: `AudioSample` |
`loading` | Status of sample array population | `boolean` |
`loadSamples` | Populates the `samples` array with a list of audio sources, either replacing the array's contents or appending the passed items to the current array | Function | `samples: AudioSample[]`, `reset: boolean`
`metadata` | Data about the currently armed track, such as track duration, time elapsed (while playing) | Object: `Metadata` |
`samples` | Array of tracks that have been loaded | Object: `AudioSample[]`

### loadSamples
The `loadSamples` function takes the following arguments:
- `samples: AudioSample[]`
- `reset: boolean`

argument | description | type
--- | --- | ---
`samples` | Takes an array of objects specifying the audio tracks to be loaded and rendered as waveforms | `AudioSample[]`
`reset` | Indicates whether the passed `samples` will _replace_ or _be appended to_ the existing array. Default value is `false` | `boolean`

### samples (argument)
Each sample in the `samples` array is of type `AudioSample`, which includes two properties:
- `id: string | number`
- `src: string`

key | description | type
--- | --- | ---
`id` | The `id` _must be unique_, as it is used to synchronize waveforms throughout the application (e.g. if a track's waveform is playing in a list of tracks **and** is being displayed simultaneously in a separate component) | `string` or `number`
`src` | The `src` specifies the location of the audio file. | `string`

```tsx
import { useEffect } from 'react'
import { useWaveform, AudioSample, Waveform } from 'react-waveform-visualizer'

// Audio track URLs
const TRACK_LIST = [
  'https://demo3.bigfishaudio.net/demo/free11_1.mp3',
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/254249/break.ogg',
  'https://free-loops.com/data/mp3/d0/b8/bc44c037a3dfdb90838c13513e58.mp3',
  'https://free-loops.com/data/mp3/68/c0/af53529e97d928a43d8dd7272ae3.mp3',
]

// URLs mapped to an AudioSample array
const TRACKS = TRACK_LIST.map((url, index: number) => ({
  id: index,
  src: url,
}))

export function Tracks() {
  const { loadSamples } = useWaveform()

  useEffect(() => {
    loadSamples(TRACKS) // Load the tracks into the Waveform state
  }, [loadSamples])
}
```

### armTrack
`armTrack` plays the specified track through an `<audio>` element in `<WaveformProvider>`. Once a track is armed, any `<Waveform />` whose `sample` `id` matches the `armTrack` `id` will render the audio waveform.

The `armTrack` function takes only one argument:
- `id: string | number`

argument | description | type
--- | --- | ---
`id` | The `id` comes from the `samples` array, specifying a _loaded_ track for playback and visualization | `string` or `number`

```tsx
// play-button.tsx
import { useWaveform } from 'react-waveform-visualizer'

export function PlayButton({ id }: { id: string }) {
  const { armTrack } = useWaveform()

  return (
    <button onClick={() => armTrack(id)}>{'▶️'}</button>
  )
}
```

### current
`current` is the currently armed/playing track. If no track is armed, `current` will evaluate to `null`.

```tsx
import { useWaveform } from 'react-waveform-visualizer'
import { AudioPlayer } from './audio-player.tsx'

export function AudioPlayer() {
  const { current } useWaveform()

  return (
    <>

      {/* current is not null */}
      {current && (
        <div>
          <AudioPlayer sample={current} />
          <p>{`Currently playing track #${current.id}`}</p>
        </div>
      )}

      {/* current is null */}
      {!current && <p>No tracks are playing at this time.</p>}
    </>
  )
}
```

### samples
`samples` is an array of all loaded tracks. Samples are of type `AudioSample`.

```tsx
import { useWaveform } from 'react-waveform-visualizer'
import { AudioPlayer } from './audio-player'
import { PlayButton } from './play-button'

export function TrackList() {
  const { samples } useWaveform()

  return (
    <ul>
      {samples.map((sample) => (
        <li key={sample.id}>
          <PlayButton id={sample.id} />
          <span>{`Track ID #${sample.id}`}</span>
          <AudioPlayer sample={sample} />
        </li>
      ))}
    </li>
  )
}
```

### metadata
`metadata` returns an object (type `Metadata`) containing information about the currently armed track, including track duration and playthrough progress (milliseconds/seconds/minutes). `metadata` includes four properties:

key | description | type
--- | --- | ---
`duration` | The length of the track in seconds (decimal) | `number`
`minutes` | The number of minutes elapsed since playback started | `number`
`seconds` | The number of seconds elapsed since playback started | `number`
`ms` | The number of milliseconds elapsed since playback started | `number`

### `WaveformProvider` (React Context API )
The `WaveformProvider` maintains the state for all loaded audio samples, as well as play state.

<br />

# Usage

First, import the `WaveformProvider` to the root of your application:

```tsx
import { WaveformProvider } from 'react-waveform-visualizer';
````

Next, wrap the provider around the your root component, so that all child components will have access to the `WaveformProvider` state:

```tsx
root.render(
  <WaveformProvider>
    <App />
  </WaveformProvider>
);
```

Any child component of `WaveformProvider` can utilize the `useWaveform` hook and the `<Waveform />` component.

Finally, load samples, arm tracks, and render waveforms using the `useWaveform` hook and the `<Waveform />` component:

```json
// audio-tracks.json

[
  {
    "id": "1",
    "src": "https://demo3.bigfishaudio.net/demo/free11_1.mp3"
  },
  {
    "id": "1",
    "src": "https://s3-us-west-2.amazonaws.com/s.cdpn.io/254249/break.ogg"
  },
  {
    "id": "1",
    "src": "https://free-loops.com/data/mp3/d0/b8/bc44c037a3dfdb90838c13513e58.mp3"
  },
  {
    "id": "1",
    "src": "https://free-loops.com/data/mp3/68/c0/af53529e97d928a43d8dd7272ae3.mp3"
  }
]

```

```tsx
import { useEffect } from 'react';
import { useWaveform, AudioSample, Waveform } from 'react-waveform-visualizer';

// import audio tracks
import audioTracks from './track-data.json'

function TrackLibrary() {
  const { armTrack, current, loadSamples, samples } = useWaveform();

  // load the tracks into the WaveformProvider context
  useEffect(() => {
    loadSamples(audioTracks as AudioSample[])
  }, [loadSamples])

  return (
    <>
      <main>
        <ul>
          {/* List each track with a "play" button and its respective Waveform */}
          {samples.map((sample) => (
            <li key={sample.id}>
              <button onClick={() => armTrack(sample.id)}>{'▶️'}</button>
              <Waveform sample={sample} />
            </li>
          ))}
        </ul>
      </main>
      <footer>
        {/* Render the footer Waveform if a track is currently armed */}
        {current && (
          <Waveform
            sample={current}
            columns={120}
            options={{
              colors: {
                default: '#ffffff',
              },
              gap: '1px',
              radius: '8px',
            }}
          />
        )}
      </footer>
    </>
  );
}
```