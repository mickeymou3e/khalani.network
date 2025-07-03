import { createSelector } from "@reduxjs/toolkit";

import { ApiRoutes } from "@/definitions/config";

import { api } from "../api";
import { UsersResponse } from "./admin.types";

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, void>({
      query: () => ({
        url: ApiRoutes.USERS,
        method: "GET",
        params: {
          limit: 1000,
          page: 1,
        },
      }),
    }),
  }),
});

export const selectUsers = createSelector(
  adminApi.endpoints.getUsers.select(),
  (result) => result?.data?.records || []
);

export const getUsers = adminApi.endpoints.getUsers.initiate;
