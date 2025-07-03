import { createSelector } from "@reduxjs/toolkit";
import {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/dist/query";

import { ApiRoutes } from "@/definitions/config";
import { RequestMethods } from "@/definitions/types";
import { PollingIntervals } from "@/services/api.types";
import { neutralApi } from "@/services/extraApis";
import { RootState } from "@/store";

import { api } from "../api";
import {
  LoginRequest,
  LoginResponse,
  NeutralLoginResponse,
  TwoFactorAuthRequest,
  TwoFactorAuthResponse,
} from "./auth.types";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (request) => {
        const formData = new FormData();
        formData.append("login", request.email);
        formData.append("password", request.password);

        return {
          url: ApiRoutes.LOGIN_CREDENTIALS,
          method: "POST",
          headers: {
            Accept: "multipart/form-data",
            "Content-Type": undefined,
          },
          body: formData,
        };
      },
      extraOptions: {
        maxRetries: 0,
      },
      transformResponse: (_, meta: FetchBaseQueryMeta): LoginResponse => {
        const csrfToken = meta.response!.headers.get("x-csrf")!;
        const loginToken = meta.response!.headers.get("X-Login-Session")!;

        return {
          csrfToken,
          loginToken,
        };
      },
    }),

    sendTwoFactorAuth: builder.mutation<
      TwoFactorAuthResponse,
      TwoFactorAuthRequest
    >({
      query: (request: TwoFactorAuthRequest) => {
        const formData = new FormData();
        formData.append("totp_code", request.totpCode);

        return {
          url: ApiRoutes.LOGIN_VERIFY_CODE,
          method: "POST",
          body: formData,
          headers: {
            "x-csrf": request.csrfToken,
            "X-Login": request.loginToken,
          },
        };
      },
      extraOptions: {
        maxRetries: 0,
      },
      transformResponse: (
        _,
        meta: FetchBaseQueryMeta
      ): TwoFactorAuthResponse => {
        const csrfToken = meta.response!.headers.get("x-csrf")!;
        const wsToken = meta.response!.headers.get("X-Ws-Token")!;

        return {
          csrfToken,
          wsToken,
        };
      },
    }),
  }),
});

export const neutralAuthApi = neutralApi.injectEndpoints({
  endpoints: (builder) => ({
    neutralLogin: builder.query<NeutralLoginResponse, string>({
      queryFn: async (userCode, { getState, dispatch }, _, baseQuery) => {
        const result = await baseQuery({
          url: ApiRoutes.NEUTRAL_LOGIN,
          method: RequestMethods.POST,
          body: {
            userCode,
            csrfToken: (getState() as RootState).auth.csrfToken,
          },
        });

        if ("error" in result) {
          setTimeout(() => {
            dispatch(neutralAuthApi.util.invalidateTags(["NeutralLogin"]));
          }, PollingIntervals.NEUTRAL_LOGIN);

          return { error: result.error as FetchBaseQueryError };
        }

        return { data: result.data as NeutralLoginResponse };
      },
      forceRefetch: () => true,
      extraOptions: {
        maxRetries: 0,
      },
      serializeQueryArgs: () => "neutralLogin",
      providesTags: ["NeutralLogin"],
    }),
    renewToken: builder.query<NeutralLoginResponse, void>({
      query: () => ({
        url: ApiRoutes.NEUTRAL_RENEW_TOKEN,
        method: RequestMethods.POST,
      }),
      extraOptions: {
        maxRetries: 0,
      },
    }),
  }),
});

export const login = authApi.endpoints.login.initiate;
export const sendTwoFactorAuth = authApi.endpoints.sendTwoFactorAuth.initiate;
export const neutralLogin = neutralAuthApi.endpoints.neutralLogin.initiate;
export const subscribeRenewToken = () =>
  neutralAuthApi.endpoints.renewToken.initiate(undefined, {
    subscriptionOptions: { pollingInterval: PollingIntervals.RENEW_TOKEN },
  });

export const selectRenewTokenResult = createSelector(
  [
    neutralAuthApi.endpoints.renewToken.select(),
    neutralAuthApi.endpoints.neutralLogin.select("neutralLogin" as any),
  ],
  (renewTokenResult, loginResult) =>
    renewTokenResult?.data?.features ?? loginResult?.data?.features ?? {}
);

export const selectNeutralLoginError = createSelector(
  neutralAuthApi.endpoints.neutralLogin.select("neutralLogin" as any),
  (result) => result.isError
);
