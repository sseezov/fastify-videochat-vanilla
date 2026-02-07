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
  reply.redirect(`/${uuidv4()}`)
});

fastify.get('/:room', (request, reply) => {
  reply.view('room.pug', {
    roomId: request.params.room
  })
});

try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}