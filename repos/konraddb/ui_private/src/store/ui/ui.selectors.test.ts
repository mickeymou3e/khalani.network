import { OrderType } from "@/definitions/types";
import { RootState } from "@/store/store";
import { HoldingsActionTypes } from "@/store/ui/ui.types";

import {
  selectHideZeroBalances,
  selectSelectedHolding,
  selectSelectedPair,
  selectSelectedTicketValues,
  selectTradeSettings,
} from "./ui.selectors";

describe("ui slice selectors", () => {
  describe("selectTradeSettings", () => {
    test("Should select trade settings", () => {
      const tradeContents = {
        base: "BTC",
        quote: "EUR",
      };

      const state = {
        ui: {
          trade: tradeContents,
        },
      } as RootState;

      const result = selectTradeSettings(state);

      expect(result).toEqual(tradeContents);
    });
  });

  describe("selectSelectedPair", () => {
    test("Should select selected pair", () => {
      const state = {
        ui: {
          trade: {
            base: "BTC",
            quote: "EUR",
          },
        },
      } as RootState;

      const result = selectSelectedPair(state);

      expect(result).toEqual({
        base: "BTC",
        quote: "EUR",
        pair: "BTC/EUR",
      });
    });
  });

  describe("selectSelectedHolding", () => {
    test("Should select selected holding", () => {
      const state = {
        ui: {
          trade: {
            holdings: {
              selected: HoldingsActionTypes.Orders,
              hideZeroBalances: true,
            },
          },
        },
      } as RootState;

      const result = selectSelectedHolding(state);

      expect(result).toEqual(HoldingsActionTypes.Orders);
    });
  });

  describe("selectHideZeroBalances", () => {
    test("Should select hide zero balances", () => {
      const state = {
        ui: {
          trade: {
            holdings: {
              selected: HoldingsActionTypes.Orders,
              hideZeroBalances: true,
            },
          },
        },
      } as RootState;

      const result = selectHideZeroBalances(state);

      expect(result).toEqual(true);
    });
  });

  describe("selectSelectedTicketValues", () => {
    test("Should select selected ticket values", () => {
      const state = {
        ui: {
          trade: {
            ticket: {
              orderType: OrderType.LIMIT,
            },
          },
        },
      } as RootState;

      const result = selectSelectedTicketValues(state);

      expect(result).toEqual({
        orderType: OrderType.LIMIT,
      });
    });
  });
});
