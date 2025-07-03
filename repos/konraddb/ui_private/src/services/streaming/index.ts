import { WebSocketClient } from "./WebSocketClient";

export { WebSocketClient } from "./WebSocketClient";
export { SocketEventCode } from "./types";

export const socketClient = new WebSocketClient(
  process.env.NEXT_PUBLIC_WS_URL as string
);
export const neutralSocketClient = new WebSocketClient(
  process.env.NEXT_PUBLIC_NEUTRAL_WS_URL as string
);
