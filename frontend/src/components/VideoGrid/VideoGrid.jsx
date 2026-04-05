// components/VideoGrid.jsx
import styles from './VideoGrid.module.css';

export default function VideoGrid() {
  return (
    <div class={styles.videos}>
      <div id="video-grid" class={styles.grid}></div>
    </div>
  );
}