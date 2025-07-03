import {
  customerCodeMock,
  jltCustodyWalletCode,
  jltWithMarketPriceMock,
  maticPolygonCustodyWalletCode,
  tradedBalancesMock,
} from "@/definitions/__mocks__";

import {
  selectBalancesList,
  selectCryptoBalanceAssets,
  selectCryptoBalancesList,
  selectFiatBalanceAssets,
  selectFiatBalancesList,
} from "./balances.selectors";

describe("Balances selectors and utils", () => {
  describe("selectBalancesList", () => {
    it("should return a list of balances with formatted values", () => {
      const result = selectBalancesList.resultFunc(
        [maticPolygonCustodyWalletCode, jltCustodyWalletCode],
        customerCodeMock,
        tradedBalancesMock,
        [jltWithMarketPriceMock]
      );

      expect(result).toMatchSnapshot();
    });
  });

  describe("selectCryptoBalancesList", () => {
    it("should return a list of crypto balances", () => {
      const intermediateResult = selectBalancesList.resultFunc(
        [maticPolygonCustodyWalletCode, jltCustodyWalletCode],
        customerCodeMock,
        tradedBalancesMock,
        [jltWithMarketPriceMock]
      );
      const result = selectCryptoBalancesList.resultFunc(intermediateResult);

      expect(result).toMatchSnapshot();
    });
  });

  describe("selectFiatBalancesList", () => {
    it("should return a list of fiat balances", () => {
      const intermediateResult = selectBalancesList.resultFunc(
        [maticPolygonCustodyWalletCode, jltCustodyWalletCode],
        customerCodeMock,
        tradedBalancesMock,
        [jltWithMarketPriceMock]
      );
      const result = selectFiatBalancesList.resultFunc(intermediateResult);

      expect(result).toMatchSnapshot();
    });
  });

  describe("selectCryptoBalanceAssets", () => {
    it("should return a list of balance assets without fiat currencies", () => {
      const result = selectCryptoBalanceAssets.resultFunc(tradedBalancesMock);
      const expected = [
        {
          value: "JLT-F23",
          assets: [
            {
              icon: "JLT-F23",
              label: "JLT-F23",
              description: "JLT-F23",
            },
          ],
        },
      ];

      expect(result).toEqual(expected);
    });
  });

  describe("selectFiatBalanceAssets", () => {
    it("should return a list of balance assets with fiat currencies", () => {
      const result = selectFiatBalanceAssets.resultFunc(tradedBalancesMock);
      const expected = [
        {
          value: "EUR",
          assets: [
            {
              icon: "EUR",
              label: "EUR",
              description: "Euro",
            },
          ],
        },
      ];

      expect(result).toEqual(expected);
    });
  });
});
