import VideoGrid from './components/VideoGrid/VideoGrid.jsx';
import Controls from './components/Controls/Controls.jsx';
import Chat from './components/Chat/Chat.jsx';
import styles from './App.module.css';

export default function App() {
  return (
    <div class={styles.main}>
      <VideoGrid />
      <Controls />
      <Chat />
    </div>
  );
}