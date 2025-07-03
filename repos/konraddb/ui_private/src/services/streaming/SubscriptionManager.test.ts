import { SubscriptionManager } from "./SubscriptionManager";
import { SocketEventCode } from "./types";

describe("SubscriptionManager", () => {
  it("should handle adding authentication subscription", () => {
    const manager = new SubscriptionManager();
    const expected = {
      event: "authenticate",
      auth: { token: "test token", type: "jwt" },
    };
    manager.authenticate("test token");

    expect(manager.getAuthSubscription()).toEqual(expected);
  });

  it("should generate a single subscription", () => {
    const manager = new SubscriptionManager();
    const expected = [
      { event: "subscribe", channels: ["rfq-orderbook-eur/usd"] },
    ];

    manager.addSubscription(`${SocketEventCode.RfqOrderBook}eur/usd`);

    expect(manager.getSubscriptions()).toEqual(expected);
  });

  it("should handle adding multiple subscriptions", () => {
    const manager = new SubscriptionManager();
    const expected = [
      { event: "subscribe", channels: ["rfq-orderbook-eur/usd"] },
      { event: "subscribe", channels: ["rfq-orderbook-btc/usd"] },
    ];

    manager.addSubscription(`${SocketEventCode.RfqOrderBook}eur/usd`);
    manager.addSubscription(`${SocketEventCode.RfqOrderBook}btc/usd`);

    expect(manager.getSubscriptions()).toEqual(expected);
  });

  it("should handle removing a single subscription from existing subscriptions", () => {
    const manager = new SubscriptionManager();
    manager.addSubscription(`${SocketEventCode.RfqOrderBook}eur/usd`);
    manager.addSubscription(`${SocketEventCode.RfqOrderBook}btc/usd`);
    const expectedDeleteMessage = {
      event: "unsubscribe",
      channels: ["rfq-orderbook-eur/usd"],
    };
    const remainingMessages = [
      { event: "subscribe", channels: ["rfq-orderbook-btc/usd"] },
    ];

    const deleted = manager.removeSubscription(
      `${SocketEventCode.RfqOrderBook}eur/usd`
    );

    expect(deleted).toEqual(expectedDeleteMessage);
    expect(manager.getSubscriptions()).toEqual(remainingMessages);
  });
});
