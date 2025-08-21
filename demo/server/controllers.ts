import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const samplesDir = path.join(process.cwd(), 'demo', 'server', 'samples');

export function getAudioTracks(req: Request, res: Response) {
  const tracks = fs.readdirSync(samplesDir, { encoding: 'utf-8' });
  res.json(tracks);
}

export function getAudioTrack(req: Request, res: Response) {
  const { trackId } = req.params;
  const trackName = decodeURIComponent(trackId);
  const filepath = path.join(samplesDir, trackName);
  const audioBuffer = fs.readFileSync(filepath);

  res.writeHead(200, {
    'Content-Type': 'audio/wav',
    'Content-Length': audioBuffer.length,
  });

  res.end(audioBuffer);
}
