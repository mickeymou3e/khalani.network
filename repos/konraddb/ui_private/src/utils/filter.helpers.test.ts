import { filterOptions } from "./filter.helpers";

describe("filterOptions helpers", () => {
  const dataProvider = [
    {
      startedOn: "2023-05-31T08:40:42.253Z",
      ip: "46.151.21.110",
      os: "Windows",
      browser: "Opera",
      location: "Germany",
      optional: [
        {
          city: "Koeln",
        },
      ],
    },
    {
      startedOn: "2023-05-31T07:35:44.83Z",
      ip: "46.151.21.110",
      os: "MacOS",
      browser: "Safari",
      location: "France",
    },
    {
      startedOn: "2023-05-31T07:25:55.637Z",
      ip: "46.151.21.110",
      os: "Windows",
      browser: "Chrome",
      location: "Poland",
      optional: [
        {
          city: "Warsaw",
        },
        {
          city: "Krakow",
        },
      ],
    },
  ];

  describe("filterOptions", () => {
    it("should return all options if filterText is empty", () => {
      const result = filterOptions(dataProvider, "");

      expect(result).toHaveLength(3);
    });

    it('should return 1 option if filterText is "Safari"', () => {
      const result = filterOptions(dataProvider, "Safari");

      expect(result).toHaveLength(1);
    });

    it('should return 1 option if filterText is "France"', () => {
      const result = filterOptions(dataProvider, "Fran");

      expect(result).toHaveLength(1);
    });

    it('should return 2 options if filterText is "France" and there is a selection', () => {
      const result = filterOptions(dataProvider, "France", "Germany");

      expect(result).toHaveLength(2);
    });

    it('should return 2 options if filterText is "Windows"', () => {
      const result = filterOptions(dataProvider, "Windows");

      expect(result).toHaveLength(2);
    });

    it('should return 1 option if filterText is "Warsaw"', () => {
      const result = filterOptions(dataProvider, "Warsaw");

      expect(result).toHaveLength(1);
    });

    it('should return 2 options if filterText is "Ko"', () => {
      const result = filterOptions(dataProvider, "Ko");

      expect(result).toHaveLength(2);
    });
  });
});
