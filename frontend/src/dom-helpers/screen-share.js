import { controls } from "../../assets/svg";

export const initShareScreen = (peers, getLocalStream) => {
  const screenBtn = document.getElementById('screen-btn');
  let sharing = false;
  let screenStream = null;

  const stopSharing = () => {
    if (!screenStream) return;

    screenStream.getTracks().forEach(track => track.stop());
    document.getElementById('screen-video')?.remove();

    const localTrack = getLocalStream().getVideoTracks()[0];
    Object.values(peers).forEach(call => {
      const sender = call.peerConnection.getSenders().find(s => s.track?.kind === 'video');
      if (sender) sender.replaceTrack(localTrack);
    });

    sharing = false;
    screenBtn.innerHTML = `${controls.screen} Демонстрация`;
    screenBtn.classList.remove('disabled')
    screenStream = null;
  };

  screenBtn.addEventListener('click', async () => {
    if (sharing) return stopSharing();

    try {
      screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true, audio: true
      });

      const video = document.createElement('video');
      video.id = 'screen-video';
      video.srcObject = screenStream;
      video.autoplay = true;
      document.querySelector('.main__videos').replaceChildren(video);

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