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

function stopScreenShare(screenStream) {
  if (screenStream) {
    screenStream.getTracks().forEach(track => track.stop());
    screenStream = null;
  }

  // Возвращаем обычное видео
  const videoTrack = localStream.getVideoTracks()[0];
  Object.values(peers).forEach(call => {
    const sender = call.peerConnection.getSenders().find(s => s.track?.kind === 'video');
    if (sender) {
      sender.replaceTrack(videoTrack);
    }
  });

  isScreenSharing = false;
  screenBtn.textContent = '🖥️ Демонстрация';
};

export const initShareScreen = (peers) => {
  const screenBtn = document.getElementById('screen-btn');
  let screenStream = null;
  let isScreenSharing = false;

  screenBtn.addEventListener('click', async () => {
    try {
      if (!isScreenSharing) {
        // Запрашиваем доступ к экрану
        navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        }).then((screenStream) => {
          const userScreenElement = document.createElement('video');
          userScreenElement.srcObject = screenStream;
          userScreenElement.autoplay = true;
          const main = document.querySelector('.main__videos')
          main.replaceChildren(userScreenElement);


          // Заменяем видеодорожку в peer соединениях
          const videoTrack = screenStream.getVideoTracks()[0];

          // Меняем трек во всех активных пирах
          Object.values(peers).forEach(call => {
            const sender = call.peerConnection.getSenders().find(s => s.track?.kind === 'video');
            if (sender) {
              sender.replaceTrack(videoTrack);
            }
          });

          // Обработка остановки демонстрации
          videoTrack.onended = () => {
            stopScreenShare(screenStream);
          };

          isScreenSharing = true;
          screenBtn.textContent = '🖥️ Остановить';

        }).catch(e => console.log(e))
          ;

      } else {
        stopScreenShare(screenStream);
      }
    } catch (err) {
      console.error('Screen share error:', err);
    }
  });
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
