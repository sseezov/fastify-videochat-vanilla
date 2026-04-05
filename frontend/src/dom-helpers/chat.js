export const initChat = (socket) => {
  const input = document.querySelector('#chat-input')
  const form = document.querySelector('#chat-form')

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const { value } = input
    if (value.length > 0) {
      socket.emit('message', value)
      form.reset()
      input.focus()
    }
  })
}

export const addMessageToChat = (msg) => {
  const chat = document.querySelector('#chat-messages')
  const messageElement = document.createElement('span')
  messageElement.textContent = msg
  chat.append(messageElement)
}
