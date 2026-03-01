import { mountVideoStream } from "../helpers/DOMhelpers.js";

export const handleOpen = (id, getVideoStream, socket, ROOM_ID) => {
  console.log('✅ Peer open with ID:', id);

  if (getVideoStream()) {
    socket.emit('join-room', ROOM_ID, id);
  } else {
    const checkStream = setInterval(() => {
      if (getVideoStream()) {
        clearInterval(checkStream);
        socket.emit('join-room', ROOM_ID, id);
      }
    }, 100);
  }
};

export const handleCall = (call, getVideoStream, peers, mountedVideos) => {
  console.log('📞 Incoming call from:', call.peer);
  const videoStream = getVideoStream();

  if (!videoStream) {
    console.error('No local stream yet');
    return;
  }

  call.answer(videoStream);

  call.on('stream', (remoteStream) => {
    console.log('✅ Received remote stream from', call.peer);

    // Проверяем, не показываем ли уже видео этого пользователя
    if (!mountedVideos.has(call.peer)) {
      mountVideoStream(mountedVideos, remoteStream, call.peer);
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
}
