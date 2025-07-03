import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { RootState } from "@/store";

import { baseQueryWithRetry } from "./api";

export const jasmineApi = createApi({
  reducerPath: "jasmineApi",
  baseQuery: baseQueryWithRetry({
    baseUrl: process.env.NEXT_PUBLIC_JASMINE_REST_URL as string,
  }),
  endpoints: () => ({}),
});

export const neutralApi = createApi({
  reducerPath: "neutralApi",
  baseQuery: baseQueryWithRetry({
    baseUrl: process.env.NEXT_PUBLIC_JASMINE_NEUTRAL_REST_URL as string,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const { bearerToken } = (getState() as RootState).auth;

      if (bearerToken) {
        headers.set("authorization", `Bearer ${bearerToken}`);
      }

      return headers;
    },
  }),
  tagTypes: ["NeutralLogin"],
  endpoints: () => ({}),
});

export const graphApi = createApi({
  reducerPath: "graphApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_THEGRAPH_JASMINE_URL,
    headers: {
      "content-type": "application/json",
    },
  }),
  endpoints: () => ({}),
});
