import PhotoUploader from './photoUploader.mjs';

export default class ChatWindow {
  constructor(element, onMenuClick) {
    this.element = element;
    this.onMenuClick = onMenuClick;
    this.menuButton = element.querySelector('[data-role="menu-open"]');

    this.menuButton.addEventListener('click', (e) => {
      this.onMenuClick();
    });
  }

  show() {
    this.element.classList.remove('hidden');
  }

  hide() {
    this.element.classList.add('hidden');
  }
}
