import { selectRemainingForRedemption } from "@/components/features/PoolPage/store/pool.selectors";
import { Symbols } from "@/definitions/types";

describe("Pool selectors", () => {
  describe("selectRemainingForRedemption", () => {
    const selectedEatAsset1 = {
      id: "1",
      balanceValue: 995,
    } as any;
    const selectedEatAsset2 = {
      id: "2",
      balanceValue: 100,
    } as any;

    const poolBalance = {
      balanceValue: 395,
    } as any;

    const selection1 = {
      id: "1",
      amountValue: 5,
    } as any;
    const selection2 = {
      id: "2",
      amountValue: 3,
    } as any;

    test("should return 0 if there is no selected asset", () => {
      const result = selectRemainingForRedemption.resultFunc(
        null,
        poolBalance,
        [selection1, selection2]
      );

      expect(result).toEqual({
        formattedValue: Symbols.NoBalance,
        value: 0,
      });
    });

    describe("pool balance is smaller than selected EAT asset balance", () => {
      test("should return pool balance if there is no selection yet", () => {
        const result = selectRemainingForRedemption.resultFunc(
          selectedEatAsset1,
          poolBalance,
          []
        );

        expect(result).toEqual({
          formattedValue: "395.00",
          value: 395,
        });
      });

      test("should return remaining balance if there is a single selection", () => {
        const result = selectRemainingForRedemption.resultFunc(
          selectedEatAsset1,
          poolBalance,
          [selection1]
        );

        expect(result).toEqual({
          formattedValue: "390.00",
          value: 390,
        });
      });

      test("should return remaining balance if there are multiple selections", () => {
        const result = selectRemainingForRedemption.resultFunc(
          selectedEatAsset1,
          poolBalance,
          [selection1, selection2]
        );

        expect(result).toEqual({
          formattedValue: "387.00",
          value: 387,
        });
      });
    });

    describe("pool balance is larger than selected EAT asset balance", () => {
      test("should return EAT token balance if it's less than pool balance and there is no selection yet", () => {
        const result = selectRemainingForRedemption.resultFunc(
          selectedEatAsset2,
          poolBalance,
          []
        );

        expect(result).toEqual({
          formattedValue: "100.00",
          value: 100,
        });
      });

      test("should return remaining balance of the first token if there are multiple selections", () => {
        const result = selectRemainingForRedemption.resultFunc(
          selectedEatAsset2,
          poolBalance,
          [selection1, selection2]
        );

        expect(result).toEqual({
          formattedValue: "97.00",
          value: 97,
        });
      });

      test("should zero if the whole balance of the EAT token is consumed", () => {
        const result = selectRemainingForRedemption.resultFunc(
          selectedEatAsset2,
          poolBalance,
          [selection1, { ...selection2, amountValue: 100 }]
        );

        expect(result).toEqual({
          formattedValue: "0.00",
          value: 0,
        });
      });
    });
  });
});
