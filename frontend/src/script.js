import { io } from "socket.io-client";
import Peer from 'peerjs'
import { PEER_CONFIG } from "./config.js";
import { ROOM_ID } from "./config.js";
import { mountVideoStream, removeVideo } from "./helpers/DOMhelpers.js";
import { connectToNewUser, disonnectUser } from "./services/socket-service.js";

const peer = new Peer(undefined, PEER_CONFIG);

const socket = io();

const userVideoElement = document.createElement('video');
let videoStream;
const peers = {};
const mountedVideos = new Set();

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then((stream) => {
  videoStream = stream;
  mountVideoStream(mountedVideos, userVideoElement, stream);
}).catch(err => {
  console.error('Failed to get media devices:', err);
});

peer.on('open', (id) => {
  console.log('✅ Peer open with ID:', id);

  if (videoStream) {
    socket.emit('join-room', ROOM_ID, id);
  } else {
    const checkStream = setInterval(() => {
      if (videoStream) {
        clearInterval(checkStream);
        socket.emit('join-room', ROOM_ID, id);
      }
    }, 100);
  }
});

peer.on('call', (call) => {
  console.log('📞 Incoming call from:', call.peer);

  if (!videoStream) {
    console.error('No local stream yet');
    return;
  }

  // Проверяем, не подключены ли уже к этому пользователю
  if (peers[call.peer]) {
    console.log('Already connected to', call.peer);
    return;
  }

  call.answer(videoStream);

  call.on('stream', (remoteStream) => {
    console.log('✅ Received remote stream from', call.peer);

    // Проверяем, не показываем ли уже видео этого пользователя
    if (!mountedVideos.has(call.peer)) {
      const video = document.createElement('video');
      mountVideoStream(mountedVideos, video, remoteStream, call.peer);
    }
  });

  call.on('close', () => {
    console.log('Call closed:', call.peer);
    delete peers[call.peer];
  });

  call.on('error', (err) => {
    console.error('Call error:', err);
  });

  peers[call.peer] = call;
});

peer.on('error', (err) => {
  console.error('Peer error:', err);
});

peer.on('disconnected', () => {
  console.log('Peer disconnected, reconnecting...');
  peer.reconnect();
});
socket.on('user-connected', (userId) => connectToNewUser(peers, peer, userId, videoStream, mountedVideos)); 
socket.on('user-disconnected', (userId) => disonnectUser(peers, mountedVideos, userId));
socket.on('connect_error', (err) => console.error('Socket connection error:', err));
