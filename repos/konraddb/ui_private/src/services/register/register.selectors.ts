import { createSelector } from "@reduxjs/toolkit";

import { selectTotpSecret } from "./register.api";

export const selectTotpSecretCode = createSelector(
  selectTotpSecret,
  (totpSecret) => totpSecret?.totp_secret
);
