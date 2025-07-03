import { checkPasswordStrength, PasswordStrength } from "./helpers";

describe("PasswordStrengthIndicator helpers", () => {
  test("should return None when password is empty", () => {
    const result = checkPasswordStrength("");

    expect(result).toBe(PasswordStrength.None);
  });

  test("should return Weak when password has only lowercase letters", () => {
    const result = checkPasswordStrength("abcdef");

    expect(result).toBe(PasswordStrength.Weak);
  });

  test("should return Weak when password has only lowercase, uppercase letters", () => {
    const result = checkPasswordStrength("abcGH");

    expect(result).toBe(PasswordStrength.Weak);
  });

  test("should return Weak when password has all requirements met, but the length it below 8 characters", () => {
    const result = checkPasswordStrength("abGH$0");

    expect(result).toBe(PasswordStrength.Weak);
  });

  test("should return Medium when password has lowercase, uppercase letters and numbers and is at least 8 chars long", () => {
    const result = checkPasswordStrength("abCDefghi0");

    expect(result).toBe(PasswordStrength.Fair);
  });

  test("should return Strong when all requirements are met", () => {
    const result = checkPasswordStrength("abCDefg0#");

    expect(result).toBe(PasswordStrength.Strong);
  });
});
