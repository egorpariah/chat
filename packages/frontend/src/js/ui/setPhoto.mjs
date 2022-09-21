import Cropper from 'cropperjs';

export default class SetPhoto {
  constructor(element, setAvatar) {
    this.element = element;
    this.setAvatar = setAvatar;

    this.saveButton = element.querySelector('[data-role="save-button"]');
    this.cancelButton = element.querySelector('[data-role="cancel-button"]');

    this.saveButton.addEventListener('click', () => {
      this.setAvatar();
      this.hide();
    });

    this.cancelButton.addEventListener('click', () => {
      this.hide();
    });
  }

  show(data) {
    const imgCanvas = this.element.querySelector('[data-role="set-photo-img"]');
    imgCanvas.src = data;

    this.cropper = new Cropper(imgCanvas, {
      dragMode: 'move',
      aspectRatio: 1,
      viewMode: 3,
      minContainerWidth: 284,
      minContainerHeight: 284,
      minCanvasHeight: 284,
    });
    this.element.classList.remove('hidden');
  }

  hide() {
    this.element.classList.add('hidden');
    this.cropper.destroy();
  }

  getCroppedAvatar() {
    let canvas;

    canvas = this.cropper.getCroppedCanvas({
      width: 284,
      height: 284,
    });

    return canvas.toDataURL();
  }
}
