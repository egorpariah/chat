export default class UsersCounter {
  constructor(element) {
    this.element = element;
  }

  set(users) {
    let ending = '';
    if (users === 1) {
      ending = '';
    } else if (1 < users && users < 5) {
      ending = 'а';
    } else {
      ending = 'ов';
    }

    this.element.innerText = `${users} участник${ending}`;
  }
}
