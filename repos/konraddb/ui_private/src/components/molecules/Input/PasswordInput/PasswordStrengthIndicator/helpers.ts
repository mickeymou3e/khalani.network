import { evaluate } from "@/utils/logic";

export enum PasswordStrength {
  None = "none",
  Weak = "weak",
  Fair = "Fair",
  Strong = "strong",
}

const numbers = /([0-9])/;
const lowerCase = /([a-z])/;
const upperCase = /([A-Z])/;
const specialCharacters = /([!,%,&,@,#,$,^,*,?,_,~])/;
const strengthCheckRegExps = [numbers, lowerCase, upperCase, specialCharacters];

export const checkPasswordStrength = (password: string) => {
  const strength = strengthCheckRegExps.reduce(
    (strength, regExp) => (password.match(regExp) ? strength + 1 : strength),
    0
  );

  return evaluate(
    [true, PasswordStrength.Strong],
    [strength < 4, PasswordStrength.Fair],
    [strength < 3 || password.length < 8, PasswordStrength.Weak],
    [strength === 0, PasswordStrength.None]
  ) as PasswordStrength;
};
