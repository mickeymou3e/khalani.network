import WS from "jest-websocket-mock";

import { SocketEventCode } from "./types";
import { WebSocketClient } from "./WebSocketClient";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        public_key: "test token",
        nonce: 0,
        signature: "test signature",
      }),
  })
) as any;

describe("WebSocketClient", () => {
  let mockServer: WS;

  beforeEach(() => {
    mockServer = new WS(process.env.NEXT_PUBLIC_WS_URL as string);
  });

  afterEach(() => {
    mockServer.close();
  });

  it("should connect to the websocket server and send initial subscription message to server", async () => {
    const socketClient = new WebSocketClient(
      process.env.NEXT_PUBLIC_WS_URL as string
    );

    socketClient.authenticate("token");
    socketClient.subscribe(SocketEventCode.RfqOrderBook, "eur/usd");

    await mockServer.connected;

    await expect(mockServer).toReceiveMessage(
      '{"event":"authenticate","auth":{"token":"token","type":"jwt"}}'
    );
    await expect(mockServer).toReceiveMessage(
      '{"event":"subscribe","channels":["rfq-orderbook-eur/usd"]}'
    );
  });

  it("should connect to the websocket server, send initial subscription and then unsubscribe", async () => {
    const socketClient = new WebSocketClient(
      process.env.NEXT_PUBLIC_WS_URL as string
    );
    socketClient.authenticate("token");
    socketClient.subscribe(SocketEventCode.RfqOrderBook, "eur/usd");

    await mockServer.connected;
    await mockServer.nextMessage;
    await mockServer.nextMessage;

    socketClient.unsubscribe(SocketEventCode.RfqOrderBook, "eur/usd");

    await mockServer.nextMessage;

    expect(mockServer).toHaveReceivedMessages([
      '{"event":"authenticate","auth":{"token":"token","type":"jwt"}}',
      '{"event":"subscribe","channels":["rfq-orderbook-eur/usd"]}',
      '{"event":"unsubscribe","channels":["rfq-orderbook-eur/usd"]}',
    ]);
  });

  it("should connect to the websocket server, send initial subscription and receive messages, channel is set, should not accept messages on the wrong channel", async () => {
    const socketClient = new WebSocketClient(
      process.env.NEXT_PUBLIC_WS_URL as string
    );
    socketClient.authenticate("token");
    const messageHandler = jest.fn();
    const expectedMessage = { msg: "Hello World" };

    await mockServer.connected;

    socketClient.subscribe(
      SocketEventCode.RfqOrderBook,
      "eur/usd",
      messageHandler
    );

    mockServer.send(
      JSON.stringify({
        channel: "rfq-orderbook-UNKNOWN",
        payload: expectedMessage,
      })
    );

    expect(messageHandler).not.toHaveBeenCalledWith(expectedMessage);
  });

  it("should connect to the websocket server, send initial subscription, immediately unsubscribe and expect that data won't arrive", async () => {
    const socketClient = new WebSocketClient(
      process.env.NEXT_PUBLIC_WS_URL as string
    );
    socketClient.authenticate("token");
    const messageHandler = jest.fn();
    const expectedMessage = { msg: "Hello World" };

    await mockServer.connected;

    socketClient.subscribe(
      SocketEventCode.RfqOrderBook,
      "eur/usd",
      messageHandler
    );
    socketClient.unsubscribe(SocketEventCode.RfqOrderBook, "eur/usd");

    mockServer.send(
      JSON.stringify({
        channel: "rfq-orderbook-eur/usd",
        payload: expectedMessage,
      })
    );

    expect(messageHandler).not.toHaveBeenCalledWith(expectedMessage);
  });
});
