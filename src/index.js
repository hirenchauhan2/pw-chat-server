/* eslint-disable no-console */
const logger = require('winston');
const Peer = require('peer');
const fs = require('fs');
const app = require('./app');
const port = app.get('port');
const server = app.listen(port);

// PeerJS Server
app.use('/peerjs', Peer.ExpressPeerServer(server, {
  debug: true,
  ssl: {
    key: fs.readFileSync('./config/sslcerts/key.pem'),
    cert: fs.readFileSync('./config/sslcerts/cert.pem')
  }
}));

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info(`Feathers application started on ${app.get('host')}:${port}`)
);
