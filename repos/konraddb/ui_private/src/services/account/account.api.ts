import { createSelector } from "@reduxjs/toolkit";

import { ApiRoutes } from "@/definitions/config";
import { RequestMethods } from "@/definitions/types";
import { neutralApi } from "@/services/extraApis";

import { api, getMutationParams } from "../api";
import {
  ApiTokensResponse,
  CreateApiTokenRequest,
  Customer,
  InviteRequest,
  UserProfileResponse,
} from "./account.types";

export const accountApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfileResponse, void>({
      query: () => ({
        url: ApiRoutes.USER_PROFILE,
        method: RequestMethods.GET,
        headers: {
          contentType: "application/json",
        },
      }),
      forceRefetch: () => true,
      extraOptions: {
        maxRetries: 0,
      },
      providesTags: ["UserProfile"],
    }),
    getCustomer: builder.query<Customer, string>({
      query: (customerId: string) => ({
        url: `${ApiRoutes.CUSTOMERS}/${customerId}`,
        method: RequestMethods.GET,
        params: {
          details: true,
        },
      }),
      extraOptions: { maxRetries: 0 },
      serializeQueryArgs: () => "getCustomer",
    }),
    getApiTokens: builder.query<ApiTokensResponse, void>({
      query: () => ({
        url: ApiRoutes.API_TOKENS,
        method: RequestMethods.GET,
        params: {
          limit: 100,
          page: 1,
          sort_by: "created",
          sort_direction: "desc",
          timeoutTriggered: false,
        },
      }),
      providesTags: ["ApiKeys"],
    }),
    deleteApiToken: builder.mutation<void, string>({
      query: (id) => ({
        url: `${ApiRoutes.API_TOKENS}/${id}`,
        method: RequestMethods.DELETE,
      }),
      ...getMutationParams({
        success: ["ApiKeys"],
      }),
    }),
    createApiToken: builder.mutation<void, CreateApiTokenRequest>({
      query: (body) => ({
        url: ApiRoutes.API_TOKENS,
        method: RequestMethods.POST,
        body,
      }),
      ...getMutationParams({
        success: ["ApiKeys"],
      }),
    }),
    acceptTermsAndCond: builder.mutation<any, { userCode: string }>({
      query: (body) => ({
        url: ApiRoutes.ACCEPT_TERMS_AND_CONDITIONS,
        method: RequestMethods.POST,
        body,
      }),
      ...getMutationParams(),
    }),
  }),
});

export const neutralAuthApi = neutralApi.injectEndpoints({
  endpoints: (builder) => ({
    sendInvite: builder.mutation<void, InviteRequest>({
      query: (request) => ({
        url: ApiRoutes.INVITE,
        method: RequestMethods.POST,
        body: request,
      }),
      extraOptions: {
        maxRetries: 0,
      },
    }),
  }),
});

export const selectUserProfile = createSelector(
  accountApi.endpoints.getUserProfile.select(),
  (result) => result?.data
);
export const selectCustomer = createSelector(
  accountApi.endpoints.getCustomer.select("getCustomer"),
  (result) => result?.data
);
export const selectDltApiTokens = createSelector(
  accountApi.endpoints.getApiTokens.select(),
  (result) => result?.data?.records
);

export const getUserProfile = accountApi.endpoints.getUserProfile.initiate;
export const getCustomer = accountApi.endpoints.getCustomer.initiate;
export const getApiTokens = accountApi.endpoints.getApiTokens.initiate;
export const deleteApiToken = accountApi.endpoints.deleteApiToken.initiate;
export const createApiToken = accountApi.endpoints.createApiToken.initiate;
export const sendInvite = neutralAuthApi.endpoints.sendInvite.initiate;

export const { useAcceptTermsAndCondMutation } = accountApi;
