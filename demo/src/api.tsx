import { useCallback, useEffect, useState } from 'react';
import { useWaveform } from '../../src';

export const useAudioServer = (endpoint: string) => {
  const { loadTracks } = useWaveform();
  const [loading, setLoading] = useState(false);
  const [samples, setSamples] = useState<string[]>([]);

  const getSamplesFromAPI = useCallback(async () => {
    if (loading) return;

    setLoading(true);

    await fetch(endpoint).then(async (res) => {
      const samples = await res.json();

      setSamples(samples);
      loadTracks(samples, { endpoint });
    }).finally(() => {
      setLoading(false);
    });
  }, [loading, loadTracks, setLoading, setSamples]);

  useEffect(() => {
    getSamplesFromAPI();
  }, []);

  return { loading, samples };
};
