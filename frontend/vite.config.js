import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/socket.io': 'http://localhost:3000', // прокси для сокетов
      '/peerjs': 'http://localhost:9000'      // прокси для peerjs
    },
  },
});