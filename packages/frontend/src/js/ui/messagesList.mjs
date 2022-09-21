import { sanitize } from '../utils.mjs';

export default class MessagesList {
  constructor(element) {
    this.element = element;
  }

  add(from, side, text) {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, 0);
    const minutes = String(date.getMinutes()).padStart(2, 0);
    const time = `${hours}:${minutes}`;
    const item = document.createElement('div');
    const lastMessage = Array.from(this.element.querySelectorAll('.chat__message')).pop();

    if (lastMessage && !lastMessage.classList.contains('chat__message--system')) {
      const lastMessageUser = lastMessage.querySelector('.chat__message-name').innerText;

      if (lastMessageUser === from) {
        item.classList.add('chat__message-block');

        item.innerHTML = `
          <div class="chat__message-text">${sanitize(text)}</div>
          <div class="chat__message-time">${time}</div>`;

        const lastMessageRight = lastMessage.querySelector('.chat__message-right');
        lastMessageRight.append(item);
        this.element.scrollTop = this.element.scrollHeight;

        return;
      }
    }

    item.classList.add('chat__message');
    if (side === 'right') item.classList.add('chat__message--right');

    item.innerHTML = `
      <div class="chat__message-left">
        <div class="chat__message-photo"
        style="background-image: url(/src/img/${from}.png?t=${Date.now()})" 
        data-role="user-avatar" data-user="${sanitize(from)}"></div>
      </div>
      <div class="chat__message-right">
        <div class="chat__message-name">${sanitize(from)}</div>
        <div class="chat__message-block">
          <div class="chat__message-text">${sanitize(text)}</div>
          <div class="chat__message-time">${time}</div>
        </div>
      </div>`;

    this.element.append(item);
    this.element.scrollTop = this.element.scrollHeight;
  }

  addSystemMessage(message) {
    const item = document.createElement('div');

    item.classList.add('chat__message', 'chat__message--system');
    item.textContent = message;

    this.element.append(item);
    this.element.scrollTop = this.element.scrollHeight;
  }

  setScrollMargin() {
    this.element.style.marginRight = `
      ${-1 * (this.element.offsetWidth - this.element.clientWidth)}px`;
  }
}
