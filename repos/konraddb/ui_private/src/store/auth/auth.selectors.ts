import { createSelector } from "@reduxjs/toolkit";

import { selectRenewTokenResult } from "@/services/auth";
import { RootState } from "@/store";
import { AuthErrorCodes } from "@/store/auth/auth.types";

export const selectCsrfToken = (state: RootState) => state.auth.csrfToken;

export const selectLoginToken = (state: RootState) => state.auth.loginToken;

export const selectWsToken = (state: RootState) => state.auth.wsToken;

export const selectIsTwoFactorAuth = (state: RootState) =>
  Boolean(state.auth.csrfToken) && Boolean(state.auth.loginToken);

export const selectIsNotValidLogin = (state: RootState) =>
  Boolean(state.auth.csrfToken) && Boolean(state.auth.wsToken);

export const selectIsValidLogin = (state: RootState) =>
  state.auth.isFullyLoggedIn;

export const selectIsPendingVerification = (state: RootState) =>
  selectIsNotValidLogin(state) && state.auth.isPendingVerification;

export const selectAuthErrorCode = (state: RootState) =>
  state.auth.errorCode as keyof typeof AuthErrorCodes;

export const selectBearerToken = (state: RootState) => state.auth.bearerToken;

export const selectIsNeutralAuthenticated = (state: RootState) =>
  Boolean(state.auth.bearerToken);

export const selectNeutralFeatures = createSelector(
  selectRenewTokenResult,
  (result) => ({
    bridge: result?.["jasmine.bridge"] ?? false,
    retire: result?.["jasmine.retire"] ?? false,
    pool: result?.["jasmine.pool"] ?? false,
    redeem: result?.["jasmine.redeem"] ?? false,
    invite: result?.["neutral.invite"] ?? false,
  })
);
