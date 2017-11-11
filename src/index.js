/* eslint-disable no-console */
const logger = require('winston');
const Peer = require('peer');

const app = require('./app');
const port = app.get('port');
const server = app.listen(port);

// PeerJS Server
app.use('/peerjs', Peer.ExpressPeerServer(server, {
  debug: true
}));

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info(`Feathers application started on ${app.get('host')}:${port}`)
);
