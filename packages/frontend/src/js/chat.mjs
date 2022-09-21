import LoginWindow from './ui/loginWindow.mjs';
import ChatWindow from './ui/chatWindow.mjs';
import NickName from './ui/nickName.mjs';
import ChatUsers from './ui/chatUsers.mjs';
import UserPhoto from './ui/userPhoto.mjs';
import PhotoUploader from './ui/photoUploader.mjs';
import MessagesList from './ui/messagesList.mjs';
import MessageSender from './ui/messageSender.mjs';
import WSClient from './wsClient.mjs';
import UsersCounter from './ui/usersCounter.mjs';
import SetPhoto from './ui/setPhoto.mjs';

export default class Chat {
  constructor() {
    let apiURL = process.env.API_URL;
    if (location.hostname === 'localhost') apiURL = `ws://${location.host}`;
    this.wsClient = new WSClient(`${apiURL}/websocket`, this.onMessage.bind(this));

    this.ui = {
      loginWindow: new LoginWindow(
        document.querySelector('#login'),
        this.onLogin.bind(this)
      ),
      chatWindow: new ChatWindow(
        document.querySelector('#chat'),
        this.onMenuClick.bind(this)
      ),
      nickName: new NickName(document.querySelector('[data-role="user-nick"]')),
      chatUsers: new ChatUsers(document.querySelector('[data-role="chat-users"]')),
      messagesList: new MessagesList(
        document.querySelector('[data-role="messages-list"]')
      ),
      messageSender: new MessageSender(
        document.querySelector('[data-role="message-sender"]'),
        this.onSend.bind(this)
      ),
      photoUploader: new PhotoUploader(
        document.querySelector('[data-role="photo-uploader"]')
      ),
      userPhoto: new UserPhoto(
        document.querySelector('[data-role="user-photo"]'),
        this.onUpload.bind(this)
      ),
      usersCounter: new UsersCounter(
        document.querySelector('[data-role="users-counter"]')
      ),
      setPhoto: new SetPhoto(
        document.querySelector('[data-role="set-photo"]'),
        this.setAvatar.bind(this)
      ),
    };

    this.ui.loginWindow.show();
  }

  async onLogin(nick) {
    await this.wsClient.connect();
    this.wsClient.sendHello(nick);
    this.ui.loginWindow.hide();
    this.ui.chatWindow.show();
    this.ui.messagesList.setScrollMargin();
    this.ui.nickName.set(nick);
    this.ui.userPhoto.set(`/users/${nick}.png?t=${Date.now()}`);
  }

  onUpload(data) {
    this.ui.setPhoto.show(data);
  }

  onSend(message) {
    this.wsClient.sendTextMessage(message);
    this.ui.messageSender.clear();
  }

  onMenuClick() {
    this.ui.photoUploader.show();
  }

  onMessage({ type, from, data }) {
    if (type === 'hello') {
      this.ui.chatUsers.add(from);
      this.ui.messagesList.addSystemMessage(`${from} вошел в чат`);
      this.setUsersCounter();
    } else if (type === 'user-list') {
      for (const item of data) {
        this.ui.chatUsers.add(item);
      }
      this.setUsersCounter();
    } else if (type === 'bye') {
      this.ui.chatUsers.remove(from);
      this.ui.messagesList.addSystemMessage(`${from} вышел из чата`);
      this.setUsersCounter();
    } else if (type === 'text-message') {
      let side = 'left';
      if (from === this.ui.nickName.get()) side = 'right';
      this.ui.messagesList.add(from, side, data.message);
    } else if (type === 'photo-changed') {
      const avatars = document.querySelectorAll(
        `[data-role="user-avatar"][data-user="${data.nick}"]`
      );
      for (const avatar of avatars) {
        avatar.style.backgroundImage = `url(/users/${data.nick}.png?t=${Date.now()})`;
      }
    }
  }

  setAvatar() {
    const avatarURL = this.ui.setPhoto.getCroppedAvatar();

    this.ui.userPhoto.set(avatarURL);

    fetch('/upload-photo', {
      method: 'post',
      body: JSON.stringify({
        nick: this.ui.nickName.get(),
        image: avatarURL,
      }),
    });

    this.ui.photoUploader.hide();
  }

  setUsersCounter() {
    const usersCount = this.ui.chatUsers.getUsersCount();
    this.ui.usersCounter.set(usersCount);
  }
}
