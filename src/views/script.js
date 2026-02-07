const userVideoElement = document.createElement('video')
userVideoElement.muted = true;

let videoStream;

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then((stream) => {
  videoStream = stream;
  mountVideoStream(userVideoElement, stream);
  document.getElementById('video-grid').append(userVideoElement);
})

const mountVideoStream = (htmlVideoElement, stream) => {
  htmlVideoElement.srcObject = stream;
  htmlVideoElement.addEventListener('loadedmetadata', () => {
    htmlVideoElement.play()
  })
}