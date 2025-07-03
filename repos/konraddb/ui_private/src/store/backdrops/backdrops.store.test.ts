import { Backdrops } from "@/definitions/types";

import {
  backdropsReducer,
  BackdropsState,
  hideBackdrop,
  initialState,
  openBackdrop,
} from "./backdrops.store";

describe("backdropsSlice", () => {
  describe("backdropsReducer", () => {
    test("Should handle initial state", () => {
      const action = { type: "unknown_action" };
      const expectedState: BackdropsState = {
        currentBackdrop: null,
        parameters: null,
      };

      expect(backdropsReducer(initialState, action)).toEqual(expectedState);
    });

    test("Should handle openBackdrop action", () => {
      const expectedPayload = {
        payload: Backdrops.LOGIN,
        type: "backdrops/openBackdrop",
      };

      expect(openBackdrop(Backdrops.LOGIN)).toEqual(expectedPayload);
    });

    test("Should handle hideBackdrop action", () => {
      const expectedPayload = { type: "backdrops/hideBackdrop" };

      expect(hideBackdrop()).toEqual(expectedPayload);
    });

    test("Should handle openBackdrop reducer", () => {
      const expectedState: BackdropsState = {
        currentBackdrop: Backdrops.LOGIN,
        parameters: null,
      };

      expect(
        backdropsReducer(initialState, openBackdrop(Backdrops.LOGIN))
      ).toEqual(expectedState);
    });

    test("Should handle hideBackdrop reducer", () => {
      const stateWithBackdrop: BackdropsState = {
        currentBackdrop: Backdrops.LOGIN,
        parameters: null,
      };
      const expectedState: BackdropsState = {
        currentBackdrop: null,
        parameters: null,
      };

      expect(backdropsReducer(stateWithBackdrop, hideBackdrop())).toEqual(
        expectedState
      );
    });
  });
});
