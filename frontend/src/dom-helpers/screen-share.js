import { controls } from "../../assets/svg";

let sharing = false;

const stopSharing = (screenStream, peers, getLocalStream, userId, screenBtn) => {
  screenStream.getTracks().forEach(track => track.stop());
  const videoToReplace = document.querySelector(`video[data-user-id="${userId}"]`);
  
  videoToReplace.srcObject = getLocalStream();

  Object.values(peers).forEach(call => {
    const sender = call.peerConnection.getSenders().find(s => s.track?.kind === 'video');
    if (sender) sender.replaceTrack(getLocalStream().getVideoTracks()[0]);
  });

  sharing = false;
  screenBtn.innerHTML = `${controls.screen} Демонстрация`;
  screenBtn.classList.remove('disabled')
  screenStream = null;
};

export const initShareScreen = (peers, getLocalStream, userId) => {
  const screenBtn = document.getElementById('screen-btn');
  const videoBtn = document.querySelector('#video-btn');

  let screenStream = null;
  screenBtn.addEventListener('click', async () => {
    if (sharing) return stopSharing(screenStream, peers, getLocalStream, userId, screenBtn);
    try {
      screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true, audio: true
      });

      const videoToReplace = document.querySelector(`video[data-user-id="${userId}"]`);
      videoBtn.classList.add('disabled')
      videoToReplace.srcObject = screenStream;
      videoToReplace.autoplay = true;

      const videoTrack = screenStream.getVideoTracks()[0];
      Object.values(peers).forEach(call => {
        const sender = call.peerConnection.getSenders().find(s => s.track?.kind === 'video');
        if (sender) sender.replaceTrack(videoTrack);
      });

      videoTrack.onended = stopSharing;
      sharing = true;
      screenBtn.classList.add('disabled');

    } catch (e) {
      console.log(e);
    }
  });
};