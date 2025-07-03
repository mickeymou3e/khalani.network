import { createMockUiInitialState } from "@/definitions/__mocks__";
import { OrderType } from "@/definitions/types";
import { HoldingsActionTypes } from "@/store/ui/ui.types";

import {
  changeHideZeroBalances,
  changeOrderType,
  changeSelectedAsset,
  changeSelectedHolding,
  initialState,
  uiReducer,
} from "./ui.store";

describe("ui slice reducer", () => {
  test("should handle initial state", () => {
    const expectedState = createMockUiInitialState({});

    expect(uiReducer(initialState, { type: "unknown" })).toEqual(expectedState);
  });

  test("should handle asset change", () => {
    const expectedState = createMockUiInitialState({
      base: "DOGE",
      quote: "ETH",
    });

    const action = changeSelectedAsset({
      base: "DOGE",
      quote: "ETH",
    });

    expect(uiReducer(initialState, action)).toEqual(expectedState);
  });

  test("should handle selected holdings change", () => {
    const expectedState = createMockUiInitialState({
      selectedHolding: HoldingsActionTypes.Portfolio,
    });

    const action = changeSelectedHolding(HoldingsActionTypes.Portfolio);

    expect(uiReducer(initialState, action)).toEqual(expectedState);
  });

  test("should handle hideZeroBalances change", () => {
    const expectedState = createMockUiInitialState({
      hideZeroBalances: true,
    });

    const action = changeHideZeroBalances(true);

    expect(uiReducer(initialState, action)).toEqual(expectedState);
  });

  test("should handle ticket related changes", () => {
    const expectedState = createMockUiInitialState({
      orderType: OrderType.MARKET,
    });

    const action = changeOrderType(OrderType.MARKET);

    expect(uiReducer(initialState, action)).toEqual(expectedState);
  });
});
