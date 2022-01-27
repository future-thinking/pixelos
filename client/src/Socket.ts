import { Socket } from "socket.io-client";
import socketIOClient from "socket.io-client";

export interface IMeta {
  uuid: number;
  playerNumber: number;
}
class SocketSingleton {
  static _instance: SocketSingleton;

  static getInstance(): SocketSingleton {
    return this._instance || (this._instance = new SocketSingleton());
  }

  socket: Socket;

  meta: IMeta | null = null;

  constructor() {
    this.socket = socketIOClient(useBackend());

    this.socket.on("ping", () => {
      this.socket.emit("pong");
    });

    this.socket.on("meta", (meta: IMeta) => {
      this.meta = meta;
    });
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
