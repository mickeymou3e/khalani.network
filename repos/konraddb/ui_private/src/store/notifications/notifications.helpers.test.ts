import {
  limitBuyOrderMock,
  limitSellOrderMock,
  marketBuyOrderMock,
  marketSellOrderMock,
} from "@/definitions/__mocks__";

import { createPlaceOrderSuccessMessage } from "./notifications.helpers";

jest.mock("next-i18next", () => ({
  i18n: {
    t: (key: any, options: any = {}) =>
      `${key} ${Object.values(options).join("")}`.trim(),
  },
}));

describe("notifications helpers", () => {
  describe("createPlaceOrderSuccessMessage", () => {
    it("should return MARKET SELL related translation key", () => {
      const result = createPlaceOrderSuccessMessage(marketSellOrderMock);

      expect(result).toBe("trade-page:orderTicket:marketSellOrderCreated");
    });

    it("should return MARKET BUY related translation key", () => {
      const result = createPlaceOrderSuccessMessage(marketBuyOrderMock);

      expect(result).toBe("trade-page:orderTicket:marketBuyOrderCreated");
    });

    it("should return LIMIT BUY related translation key", () => {
      const result = createPlaceOrderSuccessMessage(limitBuyOrderMock);

      expect(result).toBe("trade-page:orderTicket:limitBuyOrderCreated");
    });

    it("should return LIMIT SELL related translation key", () => {
      const result = createPlaceOrderSuccessMessage(limitSellOrderMock);

      expect(result).toBe("trade-page:orderTicket:limitSellOrderCreated");
    });
  });
});
