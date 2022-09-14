export default class PhotoUploader {
  constructor(element) {
    this.element = element;
    this.closeButton = this.element.querySelector('[data-role="upload-close"]');
    this.overlay = this.element.querySelector('[data-role="popup-overlay"]');

    this.closeButton.addEventListener('click', () => this.hide());
    this.element.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.hide();
      }
    });
  }

  show() {
    this.element.classList.remove('hidden');
  }

  hide() {
    this.element.classList.add('hidden');
  }
}
