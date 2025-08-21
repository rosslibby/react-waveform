import express from 'express';
import cors from 'cors';
import { getAudioTrack, getAudioTracks } from './controllers';

const hostname = 'localhost';
const port = 3030;

const app = express();
app.use(cors());
app.use(express.static('demo/dist'));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'demo/dist' });
});
app.get('/tracks', getAudioTracks);
app.get('/tracks/:trackId', getAudioTrack);

app.listen(port, hostname, () => {
  const url = new URL(`http://${hostname}:${port}`);
  console.log(`🚀 [server] running at ${url.href}`);
});
