import { evaluate } from "@/utils/logic";

describe("Logic utils", () => {
  describe("evaluate", () => {
    it("should return item 'c' whose condition is true", () => {
      const result = evaluate(
        [false, "a"],
        [false, "b"],
        [true, "c"],
        [false, "d"]
      );

      expect(result).toBe("c");
    });

    it("should return null when all conditions are false", () => {
      const result = evaluate(
        [false, "a"],
        [false, "b"],
        [false, "c"],
        [false, "d"]
      );

      expect(result).toBeUndefined();
    });

    it("should return null when there are no conditional arrays", () => {
      const result = evaluate();

      expect(result).toBeUndefined();
    });
  });
});
