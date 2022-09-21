export default class ChatUsers {
  constructor(element) {
    this.element = element;
    this.items = new Set();
  }

  buildDOM() {
    const fragment = document.createDocumentFragment();

    this.element.innerHTML = '';

    for (const nick of this.items) {
      const element = document.createElement('div');
      element.classList.add('chat__user');
      element.innerHTML = `
        <div class="chat__avatar" 
        style="background-image: url(/users/${nick}.png?t=${Date.now()})" 
        data-role="user-avatar" data-user="${nick}"></div>
        <div class="chat__nick">${nick}</div>`;
      fragment.append(element);
    }

    this.element.append(fragment);
  }

  add(nick) {
    this.items.add(nick);
    this.buildDOM();
  }

  remove(nick) {
    this.items.delete(nick);
    this.buildDOM();
  }

  getUsersCount() {
    return this.element.childElementCount;
  }
}
