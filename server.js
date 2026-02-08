import Fastify from 'fastify'
import fastifyView from '@fastify/view';
import path from 'node:path'
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'socket.io';
import fastifyStatic from '@fastify/static';
import ejs from 'ejs'

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

try {
  await fastify.listen({ 
    port: 3000,
    host: '0.0.0.0'
  });
  
  const io = new Server(fastify.server);
  console.log(`server is listening on http://localhost:3000`);

  io.on('connection', (socket) => {
    console.log('Пользователь подключился:', socket.id);
    
    socket.on('join-room', (roomId) => {
      console.log(`Пользователь ${socket.id} присоединился к комнате ${roomId}`);
    })
  });
  
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}