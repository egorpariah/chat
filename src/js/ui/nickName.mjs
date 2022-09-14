export default class NickName {
  constructor(element) {
    this.element = element;
  }

  set(nick) {
    this.nick = nick;
    this.element.textContent = nick;
  }

  get() {
    return this.nick;
  }
}
