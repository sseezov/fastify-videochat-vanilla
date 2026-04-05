import styles from './Chat.module.css';

export default function Chat() {
  return (
    <div class={styles.chat}>
      <div id="chat-messages" class={styles.messages}></div>
      <form id="chat-form" class={styles.input}>
        <input type="text" id="chat-input" placeholder="Введите сообщение..." />
        <button type="submit" id="chat-send">Отправить</button>
      </form>
    </div>
  );
}