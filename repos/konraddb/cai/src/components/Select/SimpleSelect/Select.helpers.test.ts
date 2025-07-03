import {
  BTCAssetMock,
  ETHAssetMock,
  USDCAssetMock,
  XRPAssetMock,
} from "@/definitions/__mocks__";

import { filterOptions, findText } from "./Select.helpers";
import { SimpleSelectOption } from "./SimpleSelect";

const assetOptions: SimpleSelectOption[] = [
  {
    value: "item1",
    assets: [BTCAssetMock],
  },
  {
    value: "item2",
    assets: [USDCAssetMock],
  },
  {
    value: "item3",
    assets: [ETHAssetMock, USDCAssetMock],
  },
  {
    value: "item4",
    assets: [XRPAssetMock],
  },
];

describe("Select helpers", () => {
  describe("filterOptions", () => {
    describe("products provided", () => {
      test("Should return all values when no filter text is provided", () => {
        const filteredOptions = filterOptions(assetOptions, "", "item1");

        expect(filteredOptions).toHaveLength(4);
      });

      test("Should return 2 values when 'USDC' filter text is applied", () => {
        const filteredOptions = filterOptions(assetOptions, "USDC", "item1");

        expect(filteredOptions).toHaveLength(3);
      });

      test("Should return 2 values when 'ETH' or 'USDC' filter text is applied", () => {
        let filteredOptions = filterOptions(assetOptions, "ETH", "item1");
        expect(filteredOptions).toHaveLength(2);

        filteredOptions = filterOptions(assetOptions, "USDC", "item1");
        expect(filteredOptions).toHaveLength(3);
      });

      test("Should return 1 value when 'Nonexistent Item' filter text applied", () => {
        const filteredOptions = filterOptions(
          assetOptions,
          "Nonexistent Item",
          "item1"
        );

        expect(filteredOptions).toHaveLength(1);
      });
    });
  });

  describe("findText", () => {
    describe("products provided", () => {
      test("Should return true when no filter text is provided", () => {
        const result = findText(assetOptions, "");

        expect(result).toBe(true);
      });

      test("Should return true when 'USDC' filter text is applied", () => {
        const result = findText(assetOptions, "USDC");

        expect(result).toBe(true);
      });

      test("Should return true when 'USD Coin' filter text is applied", () => {
        const result = findText(assetOptions, "USD Coin");

        expect(result).toBe(true);
      });

      test("Should return true when 'USDC' or 'ETH' filter text is applied", () => {
        let result = findText(assetOptions, "USDC");
        expect(result).toBe(true);

        result = findText(assetOptions, "ETH");
        expect(result).toBe(true);
      });

      test("Should return false when 'Nonexistent Item' filter text applied", () => {
        const result = findText(assetOptions, "Nonexistent Item");

        expect(result).toBe(false);
      });
    });
  });
});
