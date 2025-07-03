import { assignedAssetsMock } from "@/definitions/__mocks__";

import { selectSelectedAsset } from "./assets.selectors";

describe("assets selectors", () => {
  describe("selectSelectedAsset", () => {
    it("should return the selected asset", () => {
      const selectedPairMock = {
        base: "BTC",
        quote: "EUR",
        pair: "BTC/EUR",
      };

      const result = selectSelectedAsset.resultFunc(
        selectedPairMock,
        assignedAssetsMock
      );

      expect(result).toEqual(assignedAssetsMock[0]);
    });
  });
});
