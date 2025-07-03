import { createSelector } from "@reduxjs/toolkit";

import { ApiRoutes } from "@/definitions/config";
import { api, getMutationParams } from "@/services/api";

import { CreateAccountRequest, TotpSecretResponse } from "./register.types";

export const createAccountApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTotpSecret: builder.query<TotpSecretResponse, string>({
      query: (inviteCode) => ({
        url: `${ApiRoutes.TOTP_SECRET}/${inviteCode}`,
        method: "GET",
      }),
      extraOptions: {
        maxRetries: 0,
      },
      serializeQueryArgs: () => "getTotpSecret",
    }),
    createAccount: builder.mutation<any, CreateAccountRequest>({
      query: (body) => ({
        url: ApiRoutes.CREATE_ACCOUNT,
        method: "POST",
        body,
      }),
      ...getMutationParams(),
    }),
  }),
});

export const getTotpSecret = createAccountApi.endpoints.getTotpSecret.initiate;
export const createAccount = createAccountApi.endpoints.createAccount.initiate;

export const selectTotpSecret = createSelector(
  createAccountApi.endpoints.getTotpSecret.select("getTotpSecret"),
  (orders) => orders?.data
);
