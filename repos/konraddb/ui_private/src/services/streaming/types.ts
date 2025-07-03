export enum SocketEventCode {
  RfqOrderBook = "rfq-orderbook-",
}

export enum SocketEventMethod {
  Subscribe = "subscribe",
  Unsubscribe = "unsubscribe",
  Authenticate = "authenticate",
}

export enum SocketChannels {
  System = "system",
  Authentication = "authentication",
}

export enum AuthSubscriptionType {
  ApiToken = "api_token",
  Jwt = "jwt",
}

export type Callback = (data: unknown) => void;

export type SubscriptionKeys = {
  public_key: string;
  nonce: number;
  signature: string;
};

export type SubscriptionProps = {
  event: SocketEventMethod;
  channels?: string[];
};

export type AuthSubscriptionProps = {
  event: SocketEventMethod;
  auth: {
    type: string;
    token: string;
  };
};
