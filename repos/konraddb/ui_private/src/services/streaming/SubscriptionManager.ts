import {
  AuthSubscriptionProps,
  AuthSubscriptionType,
  SocketEventMethod,
  SubscriptionProps,
} from "./types";

export class SubscriptionManager {
  private subscriptions: Record<string, SubscriptionProps> = {};

  private authSubscription: AuthSubscriptionProps | null = null;

  public authenticate = (token: string) => {
    const loginMessage = {
      event: SocketEventMethod.Authenticate,
      auth: {
        token,
        type: AuthSubscriptionType.Jwt,
      },
    };

    this.authSubscription = loginMessage;

    return loginMessage;
  };

  public addSubscription = (eventChannel: string) => {
    const subscriptionKey = JSON.stringify(eventChannel);
    const subscriptionMessage = {
      event: SocketEventMethod.Subscribe,
      channels: [eventChannel],
    };

    this.subscriptions[subscriptionKey] = subscriptionMessage;

    return subscriptionMessage;
  };

  public removeSubscription = (eventChannel: string) => {
    const subscriptionKey = JSON.stringify(eventChannel);
    const subscriptionMessage = {
      event: SocketEventMethod.Unsubscribe,
      channels: [eventChannel],
    };

    delete this.subscriptions[subscriptionKey];

    return subscriptionMessage;
  };

  public getSubscriptions = (): SubscriptionProps[] =>
    Object.values(this.subscriptions);

  public getAuthSubscription = (): AuthSubscriptionProps | null =>
    this.authSubscription;
}
