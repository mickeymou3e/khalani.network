import { balancesMock } from "@/definitions/__mocks__";

import { selectAssetNameMap } from "./balances.api";

describe("Balances API", () => {
  describe("selectAssetNameMap", () => {
    it("should return a map of asset names", () => {
      const result = selectAssetNameMap.resultFunc(balancesMock);
      const expected = {
        ATOM: "Cosmos",
        BTC: "Bitcoin",
        ETH: "Ethereum",
        EUR: "Euro",
        LTC: "Litecoin",
        USD: "US Dollar",
      };

      expect(result).toEqual(expected);
    });
  });
});
