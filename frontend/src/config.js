export const PEER_CONFIG = {
  path: '/peerjs',
  host: 'localhost',
  port: 9000
};

export const SOCKET_URL = 'http://localhost:3000';

export const ROOM_ID = new URL(window.location.href).pathname.slice(1);