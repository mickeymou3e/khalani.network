import { Order } from "../DataGrid/types";
import {
  sortData,
  sortDataProvider,
} from "./useDataGridWithPagination.helpers";
import { initialState } from "./useDataGridWithPagination.reducer";

describe("useDataGrid helpers", () => {
  describe("sortData", () => {
    const dataProvider = [
      { name: "John", balance: "-1,200", balanceValue: -1200 },
      { name: "Albert", balance: "+2,700", balanceValue: 2700 },
      { name: "Bob", balance: "1,900", balanceValue: 1900 },
      { name: "Bart", balance: "-500", balanceValue: -500 },
    ];

    it("should order the data by name field in ascending order", () => {
      const expected = [
        { name: "Albert", balance: "+2,700", balanceValue: 2700 },
        { name: "Bart", balance: "-500", balanceValue: -500 },
        { name: "Bob", balance: "1,900", balanceValue: 1900 },
        { name: "John", balance: "-1,200", balanceValue: -1200 },
      ];

      const result = sortData(dataProvider, "name", Order.asc);

      expect(result).toEqual(expected);
    });

    it("should order the data by balanceValue field in descending order", () => {
      const expected = [
        { name: "Albert", balance: "+2,700", balanceValue: 2700 },
        { name: "Bob", balance: "1,900", balanceValue: 1900 },
        { name: "Bart", balance: "-500", balanceValue: -500 },
        { name: "John", balance: "-1,200", balanceValue: -1200 },
      ];

      const result = sortData(dataProvider, "balance", Order.desc);

      expect(result).toEqual(expected);
    });
  });

  describe("sortDataProvider", () => {
    const dataProvider = [
      { name: "John", age: 20 },
      { name: "Albert", age: 12 },
      { name: "Bob", age: 30 },
      { name: "Bart", age: 21 },
    ];

    it("should not apply paging if pageSize is zero", () => {
      const state = {
        ...initialState,
        orderBy: "name",
        order: Order.asc,
        currentPage: 1,
        pageSize: 0,
      };
      const expected = [
        { name: "Albert", age: 12 },
        { name: "Bart", age: 21 },
        { name: "Bob", age: 30 },
        { name: "John", age: 20 },
      ];

      const result = sortDataProvider(dataProvider, state);

      expect(result).toEqual(expected);
    });

    it("should show the items on the first page", () => {
      const state = {
        ...initialState,
        orderBy: "name",
        order: Order.asc,
        currentPage: 1,
        pageSize: 3,
      };
      const expected = [
        { name: "Albert", age: 12 },
        { name: "Bart", age: 21 },
        { name: "Bob", age: 30 },
      ];

      const result = sortDataProvider(dataProvider, state);

      expect(result).toEqual(expected);
    });

    it("should show the items on the second page", () => {
      const state = {
        ...initialState,
        orderBy: "name",
        order: Order.asc,
        currentPage: 2,
        pageSize: 3,
      };
      const expected = [{ name: "John", age: 20 }];

      const result = sortDataProvider(dataProvider, state);

      expect(result).toEqual(expected);
    });
  });
});
