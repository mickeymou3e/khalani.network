import { AncillaryFeature } from "@/definitions/types";

import { calculateTxSettings } from "./ancillary";

describe("ancillary utils", () => {
  describe("calculateTxSettings", () => {
    const createTxSettingsMock = (gasLimit: string) => ({
      gas_limit: gasLimit,
      gas_price: "",
      max_fee_per_gas: "",
      max_priority_fee_per_gas: "",
    });

    it("should return correct tx settings for Pool operation", () => {
      const result = calculateTxSettings(AncillaryFeature.Pool, 5);
      const expected = createTxSettingsMock("550000");

      expect(result).toEqual(expected);
    });

    it("should return correct tx settings for Redeem operation", () => {
      const result = calculateTxSettings(AncillaryFeature.Redeem, 3);
      const expected = createTxSettingsMock("350000");

      expect(result).toEqual(expected);
    });

    it("should return correct tx settings for BridgeIn operation", () => {
      const result = calculateTxSettings(AncillaryFeature.BridgeIn);
      const expected = createTxSettingsMock("350000");

      expect(result).toEqual(expected);
    });

    it("should return correct tx settings for Retire operation", () => {
      const result = calculateTxSettings(AncillaryFeature.Retire, 2);
      const expected = createTxSettingsMock("140000");

      expect(result).toEqual(expected);
    });

    it("should return correct tx settings for RetirePool operation", () => {
      const result = calculateTxSettings(AncillaryFeature.RetirePool);
      const expected = createTxSettingsMock("250000");

      expect(result).toEqual(expected);
    });
  });
});
