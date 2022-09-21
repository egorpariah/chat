import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let dataRaw = '';

    req.on('data', (chunk) => (dataRaw += chunk));
    req.on('error', reject);
    req.on('end', () => resolve(JSON.parse(dataRaw)));
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (/\/img\/.+\.png/.test(req.url)) {
      const [, imageName] = req.url.match(/\/img\/(.+\.png)/) || [];
      const fallBackPath = path.resolve(__dirname, '../frontend/src/img/no-photo.png');
      const filePath = path.resolve(__dirname, './users/', imageName);

      if (fs.existsSync(filePath)) {
        return fs.createReadStream(filePath).pipe(res);
      } else {
        return fs.createReadStream(fallBackPath).pipe(res);
      }
    } else if (req.url.endsWith('/upload-photo')) {
      const body = await readBody(req);
      const nick = body.nick.replace(/\.\.\/|\//, '');
      const [, content] = body.image.match(/data:image\/.+?;base64,(.+)/) || [];
      const filePath = path.resolve(__dirname, './users/', `${nick}.png`);

      if (nick && content) {
        fs.writeFileSync(filePath, content, 'base64');

        broadcast(connections, { type: 'photo-changed', data: { nick } });
      } else {
        return res.end('fail');
      }
    }

    res.end('ok');
  } catch (e) {
    console.error(e);
    res.end('fail');
  }
});

const wss = new WebSocketServer({ server });
const connections = new Map();

wss.on('connection', (socket) => {
  connections.set(socket, {});

  socket.on('message', (messageData) => {
    const message = JSON.parse(messageData);
    let excludeItself = false;

    if (message.type === 'hello') {
      excludeItself = true;
      connections.get(socket).nickName = message.data.nick;
      sendMessageTo(
        {
          type: 'user-list',
          data: [...connections.values()].map((item) => item.nickName).filter(Boolean),
        },
        socket
      );
    }

    sendMessageFrom(connections, message, socket, excludeItself);
  });

  socket.on('close', () => {
    sendMessageFrom(connections, { type: 'bye' }, socket);
    connections.delete(socket);
  });
});

function broadcast(connections, message) {
  for (const connection of connections.keys()) {
    connection.send(JSON.stringify(message));
  }
}

function sendMessageTo(message, to) {
  to.send(JSON.stringify(message));
}

function sendMessageFrom(connections, message, from, excludeItself) {
  const socketData = connections.get(from);

  if (!socketData) {
    return;
  }

  message.from = socketData.nickName;

  for (const connection of connections.keys()) {
    if (connection === from && excludeItself) {
      continue;
    }

    connection.send(JSON.stringify(message));
  }
}

server.listen(PORT);
