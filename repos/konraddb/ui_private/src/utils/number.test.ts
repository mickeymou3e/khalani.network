import {
  calculatePrecision,
  calculatePrecisionBasedOnPrice,
  convertToBaseAmount,
  convertToPrecision,
  convertToQuoteAmount,
} from "@/utils/number";

describe("formatters", () => {
  describe("calculatePrecision", () => {
    test("checking decimals for numbers bigger or equal than 1", () => {
      const result = calculatePrecision(123.4564534);
      expect(result).toBe(2);
      const result2 = calculatePrecision(10.0);
      expect(result2).toBe(2);
      const result3 = calculatePrecision(1);
      expect(result3).toBe(2);
    });

    test("checking decimals for numbers smaller than 1 but bigger or equal than 0.1", () => {
      const result = calculatePrecision(0.1);
      expect(result).toBe(2);
    });

    test("checking decimals for numbers smaller than 0.1", () => {
      const result = calculatePrecision(0.000000002475);
      expect(result).toBe(10);
      const result2 = calculatePrecision(0.002343241);
      expect(result2).toBe(4);
      const result3 = calculatePrecision(0.02363241);
      expect(result3).toBe(3);
    });
  });

  describe("calculatePrecisionBasedOnPrice", () => {
    it("should return 4 as the precision of the price 27,000", () => {
      const result = calculatePrecisionBasedOnPrice(27_000);

      expect(result).toBe(4);
    });

    it("should return 4 as the precision of the price 10", () => {
      const result = calculatePrecisionBasedOnPrice(10);

      expect(result).toBe(4);
    });

    it("should return 2 as the precision of the price 0.1", () => {
      const result = calculatePrecisionBasedOnPrice(0.1);

      expect(result).toBe(2);
    });

    it("should return 0 as the precision of the price 0.009", () => {
      const result = calculatePrecisionBasedOnPrice(0.009);

      expect(result).toBe(0);
    });
  });

  describe("convertToBaseAmount", () => {
    test("converts a certain asset's quote amount to base amount", () => {
      const result = convertToBaseAmount(1000, 10);

      expect(result).toBe(100);
    });
  });

  describe("convertToQuoteAmount", () => {
    test("converts a certain asset's base amount to quote amount", () => {
      const result = convertToQuoteAmount(100, 10);

      expect(result).toBe(1000);
    });
  });

  describe("convertToPrecision", () => {
    test("converts tick size to precision", () => {
      expect(convertToPrecision(0.0001)).toBe(4);
      expect(convertToPrecision(0.01)).toBe(2);
    });

    test("throws an error if tick size is not valid", () => {
      expect(() => convertToPrecision(1)).toThrowError("Invalid tick size");
    });
  });
});
