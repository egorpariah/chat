export default class LoginWindow {
  constructor(element, onLogin) {
    this.element = element;
    this.onLogin = onLogin;

    const loginNickInput = element.querySelector('[data-role="login-nick-input"]');
    const loginButton = element.querySelector('[data-role="login-button"]');
    const loginError = element.querySelector('[data-role="login-error"]');

    loginButton.addEventListener('click', (e) => {
      e.preventDefault();

      loginError.textContent = '';

      const nick = loginNickInput.value.trim();

      if (!nick) {
        loginError.textContent = 'Введите никнейм';
      } else this.onLogin(nick);
    });
  }

  show() {
    this.element.classList.remove('hidden');
  }

  hide() {
    this.element.classList.add('hidden');
  }
}
