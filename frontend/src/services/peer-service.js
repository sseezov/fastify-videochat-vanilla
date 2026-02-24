import { mountVideoStream } from "../helpers/DOMhelpers";

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
}
