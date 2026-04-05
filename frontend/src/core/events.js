export const handlers = {
  id: 0,
  openModal: () => {
    document.querySelector('.modal-overlay').classList.remove('hidden')
  },
  closeModal: () => {
    document.querySelector('.modal-overlay').classList.add('hidden')
  },
  getId: function () { return ++this.id },
}

export const registerHandler = (handler) => {
  const id = handlers.getId()
  handlers[id] = handler
  return id
}

export const initEvents = () => {
  const handle = (e) => {
    const { id } = e.target.dataset
    if (e.type === 'submit') {
      e.preventDefault()
    }
    if (handlers[id]) {
      handlers[id](e)
    }
  }

  document.addEventListener('click', handle)
  document.addEventListener('submit', handle)
}
