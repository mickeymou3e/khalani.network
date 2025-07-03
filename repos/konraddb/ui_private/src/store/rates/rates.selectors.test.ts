import {
  assignedAssetsMock,
  atomRateMock,
  balancesMock,
  btcRateMock,
  createMockApiInitialState,
  ethRateMock,
  jltRateMock,
} from "@/definitions/__mocks__";
import { AssetName } from "@/definitions/config";
import { selectAssetNameMap } from "@/services/balances";
import {
  selectAllAssetRateDetails,
  selectSelectedAssetRateDetails,
} from "@/store/rates/rates.selectors";
import { setupStore } from "@/store/store";

describe("Rates selectors", () => {
  describe("selectAllAssetRateDetails", () => {
    test("should select all asset rate details", () => {
      const store = setupStore({
        api: createMockApiInitialState({
          rates: {
            BTC: btcRateMock,
            ETH: ethRateMock,
            ATOM: atomRateMock,
            [AssetName["JLT-F23"]]: jltRateMock,
          },
        }),
      });
      const assetNameMap = selectAssetNameMap.resultFunc(balancesMock);
      const allAssetRateDetails = selectAllAssetRateDetails.resultFunc(
        store.getState(),
        assignedAssetsMock[0],
        assetNameMap,
        assignedAssetsMock
      );

      expect(allAssetRateDetails).toMatchSnapshot();
    });
  });

  describe("selectSelectedAssetRateDetails", () => {
    test("should select selected asset rate details", () => {
      const store = setupStore({
        api: createMockApiInitialState({
          rates: {
            BTC: btcRateMock,
            ETH: ethRateMock,
            ATOM: atomRateMock,
          },
        }),
      });
      const assetNameMap = selectAssetNameMap.resultFunc(balancesMock);
      const selectedAssetDetails = selectSelectedAssetRateDetails.resultFunc(
        store.getState(),
        assignedAssetsMock[0],
        assetNameMap
      );

      expect(selectedAssetDetails).toMatchSnapshot();
    });
  });
});
