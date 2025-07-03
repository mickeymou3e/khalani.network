import { createSelector } from "@reduxjs/toolkit";

import { ApiRoutes } from "@/definitions/config";
import { RequestMethods } from "@/definitions/types";
import { api, getMutationParams } from "@/services/api";
import { PollingIntervals } from "@/services/api.types";
import { jasmineApi, neutralApi } from "@/services/extraApis";

import {
  getEligibilityForPooling,
  getTokenMetadata,
} from "./ancillary.helpers";
import {
  CreateStrategyAssetRequestParams,
  CreateStrategyRequestParams,
  EligibilityDetails,
  EligibilityRequestProps,
  EligibilityResponse,
  GenericResponse,
  JasminePoolDeposit,
  PoolDepositsResult,
  PoolStrategiesResponse,
  PoolStrategy,
  StrategyAsset,
  StrategyAssetsResponse,
  StrategyBalancesResponse,
  TokenMetadataResponse,
  TransactionStatusResponse,
  TransferFundsRequestParams,
} from "./ancillary.types";

export const ancillaryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createStrategy: builder.mutation<PoolStrategy, CreateStrategyRequestParams>(
      {
        query: ({ customerCode, name }) => ({
          url: ApiRoutes.POOL_STRATEGY,
          method: RequestMethods.POST,
          body: {
            customer_code: customerCode,
            name,
          },
        }),
        ...getMutationParams(),
      }
    ),
    createStrategyAsset: builder.mutation<
      GenericResponse,
      CreateStrategyAssetRequestParams
    >({
      query: ({ strategyCode, asset }) => ({
        url: ApiRoutes.POOL_STRATEGY_ASSETS.replace(
          "%strategyCode%",
          strategyCode
        ),
        method: RequestMethods.POST,
        body: {
          currency: asset,
        },
      }),
      ...getMutationParams(),
    }),
    getPoolStrategies: builder.query<PoolStrategiesResponse, void>({
      query: () => ({
        url: ApiRoutes.POOL_STRATEGIES,
        method: RequestMethods.GET,
      }),
    }),
    getStrategyAssets: builder.query<StrategyAsset[], string>({
      queryFn: async (strategyCode, api, extraOptions, baseQuery) => {
        const strategyAssetsResult = await baseQuery({
          url: ApiRoutes.POOL_STRATEGY_ASSETS.replace(
            "%strategyCode%",
            strategyCode
          ),
          method: RequestMethods.GET,
          params: {
            with_balances: true,
          },
        });
        const { assets } = strategyAssetsResult.data as StrategyAssetsResponse;

        const tokenIds = assets
          .filter((asset) => Number(asset.balance) > 0)
          .reduce(
            (acc: string[], asset) =>
              asset.metadata?.token_id
                ? [...acc, asset.metadata?.token_id]
                : acc,
            []
          );

        const metadataResult: TokenMetadataResponse[] = await getTokenMetadata(
          tokenIds,
          api
        );

        const eligibilityResult: EligibilityDetails[] =
          await getEligibilityForPooling(strategyCode, tokenIds, api);

        const enrichedAssets = assets.map((asset) => {
          const matcherFn = ({ tokenId }: { tokenId: string }) =>
            tokenId === asset.metadata?.token_id;
          const metadata = metadataResult.find(matcherFn);
          const eligibleForPooling =
            eligibilityResult.find(matcherFn)?.eligible;

          return {
            ...asset,
            eligibleForPooling,
            meta: metadata,
          };
        });

        return { data: enrichedAssets as StrategyAsset[] };
      },
      serializeQueryArgs: () => "getStrategyAssets",
    }),
    checkEligibility: builder.query<
      EligibilityResponse,
      EligibilityRequestProps
    >({
      query: ({ strategyCode, tokenId }) => ({
        url: ApiRoutes.POOL_ELIGIBILITY.replace("%strategyCode%", strategyCode)
          .replace(
            "%tokenAddress%",
            process.env.NEXT_PUBLIC_JASMINE_TOKEN_ADDRESS as string
          )
          .replace("%tokenId%", tokenId),
        method: RequestMethods.GET,
      }),
      extraOptions: {
        maxRetries: 0,
      },
    }),
    getAssetBalances: builder.query<StrategyBalancesResponse, string>({
      query: (strategyCode: string) => ({
        url: ApiRoutes.POOL_STRATEGY_BALANCES.replace(
          "%strategyCode%",
          strategyCode
        ),
        method: RequestMethods.GET,
      }),
    }),
    transferFunds: builder.mutation<
      GenericResponse,
      TransferFundsRequestParams
    >({
      query: ({ asset, amount, source, destination, direction }) => ({
        url: ApiRoutes.POOL_INTERNAL_TRANSFER,
        method: RequestMethods.POST,
        body: {
          currency_code: asset,
          amount,
          source_code: source,
          destination_code: destination,
          direction,
        },
      }),
      ...getMutationParams(),
    }),
  }),
});

export const ancillaryJasmineApi = jasmineApi.injectEndpoints({
  endpoints: (builder) => ({
    getSingleTokenMetadata: builder.query<TokenMetadataResponse, string>({
      query: (tokenId) => ({
        url: ApiRoutes.JASMINE_TOKEN_METADATA.replace("%tokenId%", tokenId),
        method: RequestMethods.GET,
      }),
      extraOptions: {
        maxRetries: 0,
      },
    }),
    getJasminePoolDeposits: builder.query<JasminePoolDeposit[], void>({
      queryFn: async (arg, api, extraOptions, baseQuery) => {
        const poolDepositsResult = await baseQuery({
          url: ApiRoutes.JASMINE_POOL_DEPOSITS.replace(
            "%address%",
            process.env.NEXT_PUBLIC_JASMINE_TOKEN_ADDRESS!
          ),
          method: RequestMethods.GET,
        });
        const poolDeposits = poolDepositsResult.data as PoolDepositsResult;
        const tokenIds = poolDeposits.deposits.map(({ tokenId }) => tokenId);

        const metadataResult: TokenMetadataResponse[] = await getTokenMetadata(
          tokenIds,
          api
        );

        const poolDepositsWithMetadata = poolDeposits.deposits
          .sort((a, b) => (a.tokenId > b.tokenId ? 1 : -1))
          .map((deposit) => {
            const metadata = metadataResult.find(
              ({ tokenId }) => tokenId === deposit.tokenId
            );

            return {
              ...deposit,
              metadata,
            };
          });

        return { data: poolDepositsWithMetadata as JasminePoolDeposit[] };
      },
      extraOptions: {
        maxRetries: 0,
      },
    }),
  }),
});

const ancillaryNeutralApi = neutralApi.injectEndpoints({
  endpoints: (builder) => ({
    checkTransactionStatus: builder.query<TransactionStatusResponse, string>({
      query: (txHash) => ({
        url: ApiRoutes.TRANSACTION_STATUS.replace("%transactionHash%", txHash),
        method: RequestMethods.GET,
      }),
      extraOptions: {
        maxRetries: 0,
      },
    }),
  }),
});

export const createStrategy = ancillaryApi.endpoints.createStrategy.initiate;

export const createStrategyAsset =
  ancillaryApi.endpoints.createStrategyAsset.initiate;

export const getPoolStrategies = () =>
  ancillaryApi.endpoints.getPoolStrategies.initiate(undefined, {
    forceRefetch: true,
  });

export const subscribeJasminePoolDeposits = () =>
  ancillaryJasmineApi.endpoints.getJasminePoolDeposits.initiate(undefined, {
    subscriptionOptions: {
      pollingInterval: PollingIntervals.JASMINE_POOL_DEPOSITS,
    },
  });

export const subscribeStrategyAssets = (strategyCode: string) =>
  ancillaryApi.endpoints.getStrategyAssets.initiate(strategyCode, {
    subscriptionOptions: {
      pollingInterval: PollingIntervals.STRATEGY_ASSETS,
    },
  });

export const getAssetBalances = (strategyCode: string) =>
  ancillaryApi.endpoints.getAssetBalances.initiate(strategyCode, {
    forceRefetch: true,
  });
export const transferFunds = ancillaryApi.endpoints.transferFunds.initiate;

export const checkTransactionStatus =
  ancillaryNeutralApi.endpoints.checkTransactionStatus.initiate;

export const selectPoolStrategies = createSelector(
  ancillaryApi.endpoints.getPoolStrategies.select(),
  (result) => result?.data?.strategies ?? []
);

export const selectJasminePoolDeposits = createSelector(
  ancillaryJasmineApi.endpoints.getJasminePoolDeposits.select(),
  (result) => result?.data
);

export const selectStrategyAssets = createSelector(
  ancillaryApi.endpoints.getStrategyAssets.select("getStrategyAssets"),
  (result) => result?.data ?? []
);
