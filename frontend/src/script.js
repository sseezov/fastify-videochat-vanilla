import { io } from "socket.io-client";
import Peer from 'peerjs'

const peer = new Peer("pick-an-id");

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
socket.emit('join-room', ROOM_ID)

socket.on('user-connected', userId => {
  connectToNewUser()
})

const connectToNewUser = (userId, stream) => {
  console.log('new user');
}
