import { SubscriptionManager } from "./SubscriptionManager";
import {
  Callback,
  SocketChannels,
  SocketEventCode,
  SubscriptionProps,
} from "./types";

const createEventChannel = (eventCode: SocketEventCode, payload?: string) =>
  payload ? `${eventCode}${payload}` : eventCode;

export class WebSocketClient {
  private static readonly RECONNECT_INTERVAL = 5000;
  private static readonly TIMEOUT_INTERVAL = 10000;

  private client: WebSocket;
  private subscriptionManager: SubscriptionManager;
  private eventHandlers: Record<string, Callback> = {};
  private messageTimeoutId: ReturnType<typeof setTimeout>;
  private reconnectTimeoutId: ReturnType<typeof setTimeout>;
  private url: string;

  public constructor(url: string) {
    this.subscriptionManager = new SubscriptionManager();
    this.url = url;
  }

  private get isConnected() {
    return this.client?.readyState === WebSocket.OPEN;
  }

  private get isConnecting() {
    return this.client?.readyState === WebSocket.CONNECTING;
  }

  private initialize = () => {
    if (this.isConnecting) return;

    this.isConnected && this.close();

    clearTimeout(this.messageTimeoutId);
    this.client = new WebSocket(this.url);
    this.client.onopen = this.handleConnect;
    this.client.onclose = this.handleClose;
    this.client.onmessage = this.handleMessage;
    this.client.onerror = this.handleError;
  };

  private reInitialize = () => {
    clearTimeout(this.reconnectTimeoutId);
    this.reconnectTimeoutId = setTimeout(
      this.initialize,
      WebSocketClient.RECONNECT_INTERVAL
    );
  };

  private sendMessage(message: SubscriptionProps) {
    !this.isConnected && this.initialize();

    if (!this.isConnected) return;

    this.client.send(JSON.stringify(message));
  }

  private processSubscriptions() {
    const authMessage = this.subscriptionManager.getAuthSubscription();
    const subscriptions = Object.values(
      this.subscriptionManager.getSubscriptions()
    );

    if (authMessage) this.sendMessage(authMessage);
    subscriptions.forEach((subscription) => this.sendMessage(subscription));
  }

  private handleConnect = () => {
    this.processSubscriptions();
  };

  private handleMessage = (evt: MessageEvent) => {
    const { channel, payload } = JSON.parse(evt.data);

    if (
      [SocketChannels.Authentication, SocketChannels.System].includes(channel)
    )
      return;

    clearTimeout(this.messageTimeoutId);
    this.messageTimeoutId = setTimeout(() => {
      this.close();
    }, WebSocketClient.TIMEOUT_INTERVAL);

    this.eventHandlers?.[channel]?.(payload);
  };

  private handleClose = () => this.reInitialize();

  private handleError = () => this.reInitialize();

  public authenticate = (token: string) => {
    this.subscriptionManager.authenticate(token);
    this.handleConnect();
  };

  public subscribe = (
    eventCode: SocketEventCode,
    payload?: string,
    callback?: Callback
  ) => {
    const eventChannel = createEventChannel(eventCode, payload?.toLowerCase());
    const msg = this.subscriptionManager.addSubscription(eventChannel);
    this.eventHandlers[eventChannel] = callback!;

    this.sendMessage(msg);
  };

  public unsubscribe = (eventCode: SocketEventCode, payload?: string) => {
    const eventChannel = createEventChannel(eventCode, payload?.toLowerCase());
    const msg = this.subscriptionManager.removeSubscription(eventChannel);

    this.sendMessage(msg);

    delete this.eventHandlers[eventChannel];
  };

  public close = () => this.client.close();

  public showConnections = () => this.subscriptionManager.getSubscriptions();
}
