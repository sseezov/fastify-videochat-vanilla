import Fastify from 'fastify'
import fastifyView from '@fastify/view';
import path from 'node:path'
import pug from 'pug'
import { v4 as uuidv4 } from 'uuid';

const __dirname = import.meta.dirname;

const fastify = Fastify({
  logger: true
})

fastify.register(fastifyView, {
  engine: {
    pug
  },
  root: path.join(__dirname, 'views')
});

fastify.get('/', (request, reply) => {
  // Renders the 'home.pug' file located in the 'views' directory
  reply.view('home.pug', { 
    name: 'World',
    title: 'Fastify Pug Example'
  });
});

fastify.get('/:room', (request, reply) => {
  reply.sendFile('index.html');
});

try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}