import { io } from "socket.io-client";
import Peer from 'peerjs'

const url = new URL(window.location.href);
const ROOM_ID = url.pathname.slice(1)

const peer = new Peer(undefined,{
  path: '/peerjs',
  host: '/',
  port: 9000
});

const socket = io('/')

const userVideoElement = document.createElement('video')
userVideoElement.muted = true;

let videoStream;

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then((stream) => {
  videoStream = stream;
  mountVideoStream(userVideoElement, stream);
  document.getElementById('video-grid').append(userVideoElement);
})

const mountVideoStream = (htmlVideoElement, stream) => {
  htmlVideoElement.srcObject = stream;
  htmlVideoElement.addEventListener('loadedmetadata', () => {
    htmlVideoElement.play()
  })
}

peer.on('open', (id) => {
  console.log('open', id);
  socket.emit('join-room', ROOM_ID, id)
})

socket.on('user-connected', (userId) => {
  connectToNewUser(userId)
})

const connectToNewUser = (userId, stream) => {
  console.log('connect', userId);
}
