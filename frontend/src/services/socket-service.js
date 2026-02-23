import { mountVideoStream, removeVideo } from "../helpers/DOMhelpers";

export const connectToNewUser = (peers, peer, userId, videoStream, mountedVideos) => {
  try {
    const call = peer.call(userId, videoStream);
    if (!call) {
      console.error('Failed to create call');
      return;
    }
    peers[userId] = call;

    call.on('stream', (remoteStream) => {
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

export const disonnectUser = (peers, mountedVideos, userId) => {
  console.log('👋 User disconnected:', userId);
  removeVideo(mountedVideos, userId);
  if (peers[userId]) {
    peers[userId].close();
    delete peers[userId];
  }
};