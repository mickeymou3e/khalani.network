import { Backdrops } from "@/definitions/types";

import { RootState, store } from "../store";
import { selectCurrentBackdrop } from "./backdrops.selectors";

describe("backdropsSlice", () => {
  describe("backdropsSelectors", () => {
    test("Should select currentBackdrop as null when no backdrop is opened", () => {
      expect(selectCurrentBackdrop(store.getState())).toBeNull();
    });

    test("Should select currentBackdropOpened as the opened backdrop", () => {
      const stateWithBackdrop: RootState = {
        ...store.getState(),
        backdrops: {
          currentBackdrop: Backdrops.LOGIN,
        },
      };

      expect(selectCurrentBackdrop(stateWithBackdrop)).toEqual(Backdrops.LOGIN);
    });
  });
});
