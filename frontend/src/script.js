import { io } from "socket.io-client";
import Peer from 'peerjs'
import { PEER_CONFIG, SOCKET_URL } from "./config.js";
import { ROOM_ID } from "./config.js";
import { mountVideoStream, removeVideo } from "./DOMhelpers.js";

const peer = new Peer(undefined, PEER_CONFIG);

const socket = io(SOCKET_URL);

const userVideoElement = document.createElement('video');

let videoStream;
const peers = {}; // активные соединения
const mountedVideos = new Set(); // ОТСЛЕЖИВАЕМ какие видео уже показаны

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

socket.on('user-connected', (userId) => {
  console.log('👤 User connected:', userId);
  connectToNewUser(userId);
});

socket.on('user-disconnected', (userId) => {
  console.log('👋 User disconnected:', userId);
  removeVideo(mountedVideos, userId);
  if (peers[userId]) {
    peers[userId].close();
    delete peers[userId];
  }
});

const connectToNewUser = (userId) => {
  console.log('🔌 Connecting to:', userId);

  // Не подключаемся к себе
  if (userId === peer.id) {
    console.log('That\'s me, skipping');
    return;
  }

  // Проверяем, не подключены ли уже
  if (peers[userId]) {
    console.log('Already connected to', userId);
    return;
  }

  try {
    const call = peer.call(userId, videoStream);

    if (!call) {
      console.error('Failed to create call');
      return;
    }

    peers[userId] = call;

    call.on('stream', (remoteStream) => {
      console.log('✅ Connected to', userId, '- stream received');

      // Проверяем, не показываем ли уже видео этого пользователя
      if (!mountedVideos.has(userId)) {
        const video = document.createElement('video');
        mountVideoStream(mountedVideos, video, remoteStream, userId);
      }
    });

    call.on('close', () => {
      console.log('Connection closed:', userId);
      delete peers[userId];
    });

    call.on('error', (err) => {
      console.error('Call error with', userId, ':', err);
    });

  } catch (err) {
    console.error('Error creating call:', err);
  }
};

socket.on('connect', () => {
  console.log('✅ Socket connected');
});

socket.on('connect_error', (err) => {
  console.error('Socket connection error:', err);
});

peer.on('error', (err) => {
  console.error('Peer error:', err);
});

peer.on('disconnected', () => {
  console.log('Peer disconnected, reconnecting...');
  peer.reconnect();
});