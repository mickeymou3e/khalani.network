import { createSelector } from "@reduxjs/toolkit";

import { ApiRoutes, defaultBaseAsset } from "@/definitions/config";

import { api } from "../api";
import { AssignedAsset, AssignedAssetsResponse } from "./assets.types";

export const assetsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAssignedAssets: builder.query<AssignedAsset[], string>({
      query: (clientCode) =>
        ApiRoutes.ASSIGNED_ASSETS.replace("%clientCode%", clientCode),
      transformResponse: (response: AssignedAssetsResponse) =>
        response.records
          .map((asset) => ({
            ...asset,
            base: asset.base.toUpperCase(),
            quote: asset.quote.toUpperCase(),
            pair: `${asset.base}/${asset.quote}`.toUpperCase(),
          }))
          .filter(
            (asset) =>
              asset.base === defaultBaseAsset.code &&
              asset.stream_type === "standard" && asset.spread_mode === "strict"
          ),
      serializeQueryArgs: () => "getAssignedAssets",
    }),
  }),
});

export const selectAssignedAssets = createSelector(
  assetsApi.endpoints.getAssignedAssets.select("getAssignedAssets"),
  (result) => result?.data || []
);

export const getAssignedAssets = assetsApi.endpoints.getAssignedAssets.initiate;
