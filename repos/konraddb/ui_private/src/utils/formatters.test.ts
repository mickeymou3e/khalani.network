import {
  formatNumber,
  formatPercentage,
  formatShortValue,
  formatUsdValue,
  formatValue,
  hideNumericValues,
  toFixedNumber,
} from "@/utils/formatters";

describe("formatters", () => {
  describe("formatNumber", () => {
    it("should return empty string if the input value is not a number", () => {
      const result = formatNumber(NaN);

      expect(result).toBe("");
    });

    it("should return the number only", () => {
      const result = formatNumber(320);

      expect(result).toBe("320.00");
    });

    it("should add thousand separators above 1K by default", () => {
      const result = formatNumber(1129320);

      expect(result).toBe("1,129,320.00");
    });

    it("should not add thousand separators above 1K if set explicitly", () => {
      const result = formatNumber(1129320, {
        withThousandSeparator: false,
      });

      expect(result).toBe("1129320.00");
    });

    it("should return the number with prefix", () => {
      const result = formatNumber(320, { prefix: "$" });

      expect(result).toBe("$320.00");
    });

    it("should return the number with token symbol", () => {
      const result = formatNumber(320, {
        token: "USDT",
      });

      expect(result).toBe("320.00 USDT");
    });

    it("should return the number with everything customized", () => {
      const result = formatNumber(320, {
        base: 4,
        prefix: "+",
        token: "USDT",
      });

      expect(result).toBe("+320.0000 USDT");
    });

    it("should show positive sign prefix", () => {
      const result = formatNumber(2, {
        showSign: true,
      });

      expect(result).toBe("+2.00");
    });

    it("should show negative sign prefix", () => {
      const result = formatNumber(-2, {
        showSign: true,
      });

      expect(result).toBe("-2.00");
    });

    it("should round the number to the given precision under the hood in order to avoid side effects", () => {
      const result = formatNumber(-0.012345, {
        base: 1,
        showSign: true,
      });

      expect(result).toBe("0.0");
    });

    it("should round the number to the given precision under the hood in order to avoid side effects", () => {
      const result = formatNumber(-0.05678, {
        base: 1,
        showSign: true,
      });

      expect(result).toBe("-0.1");
    });
  });

  describe("toFixedNumber", () => {
    it("should return the number with thousand separators and the default precision of 2", () => {
      const result = toFixedNumber(3200.4567);

      expect(result).toBe("3200.46");
    });

    it("should return the number with thousand separators and the precision of 4", () => {
      const result = toFixedNumber(3200.45678, 4);

      expect(result).toBe("3200.4568");
    });
  });

  describe("formatValue", () => {
    it("should return the number with thousand separators and the default precision of 2", () => {
      const result = formatValue(3200.4567);

      expect(result).toBe("3,200.46");
    });

    it("should return the number with thousand separators and the precision of 4", () => {
      const result = formatValue(3200.45678, 4);

      expect(result).toBe("3,200.4568");
    });
  });

  describe("formatShortValue", () => {
    it("should not touch the number if it is less than 1000", () => {
      const result = formatShortValue(320);

      expect(result).toBe("320.00");
    });

    it("should return the number with K suffix", () => {
      const result = formatShortValue(3200);

      expect(result).toBe("3.20k");
    });

    it("should return the number with M suffix", () => {
      const result = formatShortValue(3200000);

      expect(result).toBe("3.20m");
    });

    it("should return the number with B suffix", () => {
      const result = formatShortValue(3200000000);

      expect(result).toBe("3.20b");
    });
  });

  describe("formatUsdValue", () => {
    it("should return the number prepended with $", () => {
      const result = formatUsdValue(3200.4567);

      expect(result).toBe("$3,200.46");
    });
  });

  describe("formatPercentage", () => {
    it("should return the number appended with %, rounded to 0 digits", () => {
      const result = formatPercentage(9.45);

      expect(result).toBe("9%");
    });

    it("should return the number appended with %, rounded to 2 digits", () => {
      const result = formatPercentage(9.457, 2);

      expect(result).toBe("9.46%");
    });

    it("should return <1% if number is smaller than 1 and bigger than 0", () => {
      const result = formatPercentage(0.5);

      expect(result).toBe("<1%");
    });

    it("should return 0% if number is 0", () => {
      const result = formatPercentage(0);

      expect(result).toBe("0%");
    });
  });

  describe("hideNumericValues", () => {
    it("should return 6 asterisks in place of numbers by default", () => {
      const result = hideNumericValues("1234567890");

      expect(result).toBe("******");
    });

    it("should return 3 asterisks in place of numbers if number of asterisks are set", () => {
      const result = hideNumericValues("1234567890", 3);

      expect(result).toBe("***");
    });

    it("should return asterisks in place of numbers. Thousand separators, decimal points should be removed, other characters should stay", () => {
      const result = hideNumericValues("$1,234,567.89");

      expect(result).toBe("$******");
    });

    it("should return asterisks in place of numbers. Thousand separators, decimal points should be removed, other characters should stay", () => {
      const result = hideNumericValues("1,234,567.89 USD");

      expect(result).toBe("****** USD");
    });
  });
});
