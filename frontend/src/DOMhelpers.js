export const mountVideoStream = (mountedVideos, htmlVideoElement, stream, userId) => {
  htmlVideoElement.srcObject = stream;
  htmlVideoElement.setAttribute('data-user-id', userId);
  htmlVideoElement.addEventListener('loadedmetadata', () => {
    htmlVideoElement.play().catch(e => console.log('Play error:', e));
  });

  document.getElementById('video-grid').append(htmlVideoElement);

  if (userId !== 'local') {
    mountedVideos.add(userId);
  }
}

export const removeVideo = (mountedVideos, userId) => {
  const videoToRemove = document.querySelector(`video[data-user-id="${userId}"]`);

  if (videoToRemove) {
    videoToRemove.remove();
    mountedVideos.delete(userId);
  }
}