export const mountVideoStream = (mountedVideos, stream, userId) => {
  const userVideoElement = document.createElement('video');

  userVideoElement.srcObject = stream;
  userVideoElement.setAttribute('data-user-id', userId);
  userVideoElement.addEventListener('loadedmetadata', () => {
    userVideoElement.play().catch(e => console.log('Play error:', e));
  });

  document.getElementById('video-grid').append(userVideoElement);

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

export const initControls = (stream, peers) => {
  const videoBtn = document.querySelector('#video-btn')
  const audioBtn = document.querySelector('#audio-btn')
  // отключаем звук и картинку по умолчанию
  stream.getVideoTracks()[0].enabled = false;
  stream.getAudioTracks()[0].enabled = false;

  videoBtn.addEventListener('click', () => {
    videoBtn.classList.toggle('disabled')
    stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
  })
  audioBtn.addEventListener('click', () => {
    audioBtn.classList.toggle('disabled')
    stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
  })
}
