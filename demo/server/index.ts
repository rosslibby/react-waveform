import http from 'http';
import fs from 'fs';
import path from 'path';

const hostname = 'localhost';
const port = 3030;

const getRoutes: Record<string, (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => void> = {
  '/tracks': getAudioTracks,
  '/tracks/:track': getAudioTrack,
};

const routes = {
  GET: getRoutes,
};

const server = http.createServer((req, res) => {
  handleRoute(req, res);
});

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  'Access-Control-Max-Age': 2592000,
};

function handleRoute(req: http.IncomingMessage, res: http.ServerResponse) {
  try {
    const method = req.method as keyof typeof routes;

    if (req.method === 'OPTIONS') {
      res.writeHead(204, headers);
      res.end();
      return;
    }

    const router = routes[method];

    if (!router) {
      throw new Error(`${req.method} not authorized for ${req.url}`);
    }

    const url = req.url as string;
    const routeName = getRouteName(Object.keys(router), url);

    if (!routeName) {
      throw new Error(`Page not found`);
    }

    const route = router[routeName as keyof typeof routes];
    route(req, res);
    return;
  } catch (err) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(err);
    return;
  }
}

function pathSegments(url: string): string[] {
  const segments = url.match(/(\/:?\w+)/g) || [];
  return segments;
}

function getRouteName(paths: string[], url: string): string | null {
  if (paths.includes(url)) {
    return url;
  } else {
    const urlSegments = pathSegments(url);
    const segments = paths.map(pathSegments);
    const match = segments.find((path) => {
      return path[0] === urlSegments[0] &&
        path.length === urlSegments.length;
    });
    return match?.join('') ?? null;
  }
}

function getAudioTracks(req: http.IncomingMessage, res: http.ServerResponse) {
  const filepath = path.join(process.cwd(), 'samples');
  const tracks = fs.readdirSync(filepath, { encoding: 'utf-8' });

  res.writeHead(200, {
    ...headers,
    'Content-Type': 'application/json',
  });
  res.end(JSON.stringify(tracks));
}

function getAudioTrack(req: http.IncomingMessage, res: http.ServerResponse) {
  const urlTrackName = req.url?.split('/').pop() as string;
  const trackName = decodeURIComponent(urlTrackName);
  const filepath = path.join(process.cwd(), 'samples', trackName);
  const audioBuffer = fs.readFileSync(filepath);

  res.writeHead(200, {
    ...headers,
    'Content-Type': 'audio/wav',
    'Content-Length': audioBuffer.length,
  });

  res.end(audioBuffer);
}

server.listen(port, hostname, () => {
  console.log(`⚡️ Listening on port ${port}`);
});
