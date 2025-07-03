import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { createTransform, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { accountApi } from "@/services/account";
import { authApi, neutralAuthApi } from "@/services/auth";

import { AuthState, NeutralAuthState } from "./auth.types";

export const initialState: AuthState & NeutralAuthState = {
  csrfToken: null,
  loginToken: null,
  wsToken: null,
  errorCode: 0,
  lastRequestStartTime: 0,
  isFullyLoggedIn: false,
  isPendingVerification: true,
  bearerToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setErrorCode: (state, { payload }) => {
      state.errorCode = payload;
    },
    clearErrorCode: (state) => {
      state.errorCode = 0;
    },
    setCsrfToken: (state, { payload }) => {
      state.csrfToken = payload;
    },
    setLastRequestStartTime: (state, { payload }) => {
      state.lastRequestStartTime = payload;
    },
    clearTokens: () => initialState,
    handleLogout: () => initialState,
    setBearerToken: (state, { payload }) => {
      state.bearerToken = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.csrfToken = payload.csrfToken;
        state.loginToken = payload.loginToken;
        state.wsToken = null;
      }
    );
    builder.addMatcher(
      authApi.endpoints.sendTwoFactorAuth.matchFulfilled,
      (state, { payload }) => {
        state.csrfToken = payload.csrfToken;
        state.wsToken = payload.wsToken;
        state.loginToken = null;
      }
    );
    builder.addMatcher(
      accountApi.endpoints.getUserProfile.matchPending,
      (state) => {
        state.isPendingVerification = true;
      }
    );
    builder.addMatcher(
      accountApi.endpoints.getUserProfile.matchFulfilled,
      (state) => {
        state.isFullyLoggedIn = true;
        state.isPendingVerification = false;
      }
    );
    builder.addMatcher(
      isAnyOf(
        authApi.endpoints.login.matchRejected,
        authApi.endpoints.sendTwoFactorAuth.matchRejected
      ),
      (state, { payload }) => {
        state.errorCode = (payload as any).data.code;
        state.isPendingVerification = false;
      }
    );
    builder.addMatcher(accountApi.endpoints.getUserProfile.matchRejected, () =>
      authSlice.caseReducers.handleLogout()
    );
    builder.addMatcher(
      isAnyOf(
        neutralAuthApi.endpoints.neutralLogin.matchFulfilled,
        neutralAuthApi.endpoints.renewToken.matchFulfilled
      ),
      (state, { payload }) => {
        state.bearerToken = payload.token;
      }
    );
  },
});

export const {
  handleLogout,
  setErrorCode,
  clearErrorCode,
  clearTokens,
  setCsrfToken,
  setLastRequestStartTime,
} = authSlice.actions;

const AuthPersistTransform = createTransform((inboundState, key) =>
  [
    "errorCode",
    "isFullyLoggedIn",
    "isPendingVerification",
    "setLastRequestStartTime",
    "bearerToken",
  ].includes(key as string)
    ? undefined
    : inboundState
);

const persistedAuthReducer = persistReducer(
  { key: "auth", storage, transforms: [AuthPersistTransform] },
  authSlice.reducer
);

export { persistedAuthReducer as authReducer };
