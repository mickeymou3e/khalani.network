import { useTranslation } from "next-i18next";

import { evaluate } from "@/utils/logic";

import { checkPasswordStrength, PasswordStrength } from "./helpers";

const namespace = "common:components:password";

export const usePasswordStrength = (password: string) => {
  const { t } = useTranslation();
  const strengthText = t(`${namespace}:strength`);
  const weakText = t(`${namespace}:weak`);
  const fairText = t(`${namespace}:fair`);
  const strongText = t(`${namespace}:strong`);

  const passwordStrength = checkPasswordStrength(password);
  const passwordStrengthText = evaluate(
    [true, strongText],
    [passwordStrength === PasswordStrength.Fair, fairText],
    [passwordStrength === PasswordStrength.Weak, weakText],
    [passwordStrength === PasswordStrength.None, strengthText]
  ) as string;

  return {
    passwordStrength,
    passwordStrengthText,
  };
};
