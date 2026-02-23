export const mountVideoStream = (mountedVideos, htmlVideoElement, stream, userId) => {
  if (userId !== 'local' && mountedVideos.has(userId)) {
    console.log('Video for', userId, 'already mounted');
    return;
  }

  htmlVideoElement.srcObject = stream;

  htmlVideoElement.addEventListener('loadedmetadata', () => {
    htmlVideoElement.play().catch(e => console.log('Play error:', e));
  });

  // Добавляем data-атрибут для идентификации
  htmlVideoElement.setAttribute('data-user-id', userId);

  document.getElementById('video-grid').append(htmlVideoElement);

  // Запоминаем, что видео этого пользователя уже показано
  if (userId !== 'local') {
    mountedVideos.add(userId);
  }

  console.log('Mounted video for', userId, 'Total videos:', mountedVideos.size + 1);
}

// Функция для удаления видео
export const removeVideo = (mountedVideos, userId) => {
  console.log('remove video');
  const videoToRemove = document.querySelector(`video[data-user-id="${userId}"]`);
  
  if (videoToRemove) {
    videoToRemove.remove();
    mountedVideos.delete(userId);
    console.log('Removed video for', userId);
  }
}