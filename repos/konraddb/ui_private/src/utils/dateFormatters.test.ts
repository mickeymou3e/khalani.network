import { formatDate, formatDateToIso } from "./dateFormatters";

describe("Should return date with month at the beginning", () => {
  it("should return correct date format", () => {
    const result = formatDate("2023-05-18T09:51:53.197Z");

    expect(result).toBe("May 18th 2023");
  });

  it("should return dash", () => {
    const result = formatDate("32dscvssdc3");

    expect(result).toBe("-");
  });

  it("should return dash", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = formatDate(undefined);

    expect(result).toBe("-");
  });
});

describe("Should return date as ISO", () => {
  it("should return correct date format", () => {
    const result = formatDateToIso("2023-05-18T09:51:53.197Z");

    expect(result[0]).toBe("2023-05-18");
    expect(result[1]).toBe("09:51:53");
  });
});
