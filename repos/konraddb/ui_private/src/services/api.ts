import { FetchBaseQueryArgs } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  retry,
} from "@reduxjs/toolkit/query/react";

import { RootState } from "@/store";

export const baseQueryWithRetry = ({ baseUrl, ...rest }: FetchBaseQueryArgs) =>
  retry(
    fetchBaseQuery({
      baseUrl,
      ...rest,
    }),
    { maxRetries: 5 }
  );

const baseQueryWithCSRFToken = baseQueryWithRetry({
  baseUrl: process.env.NEXT_PUBLIC_REST_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const { csrfToken } = (getState() as RootState).auth;

    if (csrfToken) {
      headers.set("x-csrf", csrfToken);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const requestStartTime = new Date().getTime();

  const result = await baseQueryWithCSRFToken(args, api, extraOptions);
  const csrfToken = result.meta?.response?.headers.get("x-csrf");

  if (csrfToken) {
    const { lastRequestStartTime } = (api.getState() as RootState).auth;

    /**
     * We want to avoid storing the current request's csrf token when
     * it finishes slowly but there is a newer request that has already
     * finished with a more recent csrf token.
     */
    if (lastRequestStartTime < requestStartTime) {
      api.dispatch({
        type: "auth/setLastRequestStartTime",
        payload: requestStartTime,
      });
      api.dispatch({ type: "auth/setCsrfToken", payload: csrfToken });
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Orders", "ApiKeys", "UserProfile"],
  endpoints: () => ({}),
});

type InvalidateParams<T> = {
  success?: T[];
  error?: T[];
};

export const invalidateOn =
  <T>({ success = [], error = [] }: InvalidateParams<T> = {}) =>
  (result: unknown) =>
    result ? success : error;

export const getMutationParams = <T>({
  success = [],
  error = ["UserProfile" as T],
}: InvalidateParams<T> = {}) => ({
  invalidatesTags: invalidateOn({ success, error }),
  extraOptions: {
    maxRetries: 0,
  },
});
