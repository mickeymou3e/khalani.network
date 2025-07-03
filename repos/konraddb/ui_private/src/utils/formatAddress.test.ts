import formatAddress from "./formatAddress";

describe("toFixedNumber", () => {
  it("should return short address", () => {
    const result = formatAddress("0xDa15bBfC5543e4f903f9aeDA13D296E0d29FDaF6");

    expect(result).toBe("0xDa15...FDaF6");
  });
  it("should return dash", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = formatAddress({ test: "test" });

    expect(result).toBe("-");
  });
  it("should return dash", () => {
    const result = formatAddress(undefined);

    expect(result).toBe("-");
  });
});
