import Fastify from 'fastify'
import fastifyView from '@fastify/view';
import path from 'node:path'
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'socket.io';
import fastifyStatic from '@fastify/static';
import ejs from 'ejs'
import { PeerServer } from 'peer';

const __dirname = import.meta.dirname;

const fastify = Fastify({
  // logger: true
})

fastify.register(fastifyView, {
  engine: {
    ejs
  },
  root: path.join(__dirname, 'views')
});

await fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/'
})

fastify.get('/', (request, reply) => {
  reply.redirect(`/${uuidv4()}`)
});

fastify.get('/:room', (request, reply) => {
  reply.view('room.ejs', {
    roomId: request.params.room
  })
});

const peerServer = PeerServer({
  port: 9000,
  path: '/peerjs',
  allow_discovery: true
})

try {
  await fastify.listen({ 
    port: 3000,
    host: '0.0.0.0'
  });
  
  const io = new Server(fastify.server);
  console.log(`server is listening on http://localhost:3000`);
  console.log('PeerJS: http://localhost:9000/peerjs')

  io.on('connection', (socket) => {    
    socket.on('join-room', (roomId) => {

      console.log(`Пользователь ${socket.id} присоединился к комнате ${roomId}`);
      socket.join(roomId)
      socket.to(roomId).emit('user-connected')
    })
  });
  
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}