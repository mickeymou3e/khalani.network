import { createSelector } from "@reduxjs/toolkit";

import { ApiRoutes } from "@/definitions/config";
import { Order } from "@/definitions/types";
import { PollingIntervals } from "@/services/api.types";

import { api, getMutationParams } from "../api";
import { OrdersResponse, SubmitOrderRequest } from "./orders.types";

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrdersResponse, void>({
      keepUnusedDataFor: 0,
      query: () => ({
        url: ApiRoutes.ORDERS,
        params: {
          page: 1,
          limit: 1000,
          is_suborder: false,
          order_type: "rfq_market|rfq_limit",
        },
      }),
      providesTags: ["Orders"],
    }),
    submitOrder: builder.mutation<Order, SubmitOrderRequest>({
      query: (body) => ({
        url: ApiRoutes.ORDERS,
        method: "POST",
        body,
      }),
      ...getMutationParams({
        success: ["Orders"],
      }),
    }),
    cancelOrder: builder.mutation<Order, string>({
      query: (orderId) => ({
        url: `${ApiRoutes.ORDERS}/${orderId}/cancel`,
        method: "PUT",
      }),
      ...getMutationParams({
        success: ["Orders"],
      }),
    }),
  }),
});

export const { useSubmitOrderMutation, useCancelOrderMutation } = ordersApi;

export const selectOrders = createSelector(
  ordersApi.endpoints.getOrders.select(),
  (orders) => orders?.data?.records
);

export const subscribeOrders = () =>
  ordersApi.endpoints.getOrders.initiate(undefined, {
    subscriptionOptions: { pollingInterval: PollingIntervals.ORDERS },
  });
