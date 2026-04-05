import styles from './Controls.module.css';
import { AudioIcon, VideoIcon, ScreenIcon, LeaveIcon } from '../../../assets/icons.jsx';

export default function Controls() {
  return (
    <div class={styles.controls}>
      <button id="audio-btn" class={`${styles.btn} ${styles.disabled}`}>
        <AudioIcon /> Звук
      </button>

      <button id="video-btn" class={`${styles.btn} ${styles.disabled}`}>
        <VideoIcon /> Видео
      </button>

      <button id="screen-btn" class={styles.btn}>
        <ScreenIcon /> Демонстрация
      </button>

      <button id="leave-btn" class={`${styles.btn} ${styles.danger}`}>
        <LeaveIcon /> Покинуть
      </button>
    </div>
  );
}