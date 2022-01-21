import { Socket } from "socket.io-client";
import socketIOClient from "socket.io-client";

class SocketSingleton {
  static _instance: SocketSingleton;

  static getInstance(): SocketSingleton {
    return this._instance || (this._instance = new SocketSingleton());
  }

  socket: Socket;

  constructor() {
    this.socket = socketIOClient(useBackend());
  }
}

function useBackend(): string {
  if (import.meta.env.MODE === "development") {
    return "http://localhost:8000";
  } else {
    return window.location.origin;
  }
}

export default function useSocket() {
  return SocketSingleton.getInstance().socket;
}
