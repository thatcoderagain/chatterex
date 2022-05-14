import { io } from 'socket.io-client';

class SocketIOService {
  public socket: any;

  constructor() {
    this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);
  }

  join(user: any) {
    this.socket.emit("joined", {
      user: user
    });
  }

  disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
  }
}

export default new SocketIOService();