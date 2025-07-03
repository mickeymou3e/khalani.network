import { useEffect } from "react";

import { StrategyNames } from "@/definitions/config";
import { Tokens } from "@/definitions/types";
import { store, useAppDispatch, useAppSelector } from "@/store";
import { selectNeutralCustomerCode } from "@/store/account";
import {
  createStrategy,
  createStrategyAsset,
  getPoolStrategies,
  PoolStrategy,
  selectSelectedStrategyCode,
  subscribeStrategyAssets,
} from "@/store/ancillary";
import { selectIsNeutralAuthenticated, selectIsValidLogin } from "@/store/auth";

const searchStrategy = (strategies: PoolStrategy[], name: string) =>
  [...strategies]
    .sort((a, b) =>
      new Date(a.created_at).getTime() > new Date(b.created_at).getTime()
        ? 1
        : -1
    )
    .find((strategy) => strategy.name === name);

const getStrategy = async (strategyName: string) => {
  const strategiesResult = await store.dispatch(getPoolStrategies());
  return searchStrategy(strategiesResult.data!.strategies, strategyName);
};

const manageStrategy = async (strategyName: string, customerCode: string) => {
  const strategy = await getStrategy(strategyName);

  if (strategy) return strategy;

  const createStrategyResult = await store.dispatch(
    createStrategy({ customerCode, name: strategyName })
  );
  return "data" in createStrategyResult ? createStrategyResult.data : null;
};

const manageStrategyAssets = async (strategy: PoolStrategy) => {
  if (strategy?.assets.some((a) => a.currency === Tokens.STRATEGY_JLT_CODE))
    return strategy;

  await store.dispatch(
    createStrategyAsset({
      strategyCode: strategy.code,
      asset: Tokens.STRATEGY_JLT_CODE,
    })
  );

  const updatedStrategy = await getStrategy(StrategyNames.Jasmine);
  return updatedStrategy ?? null;
};

export const useDefiStrategyCreation = () => {
  const customerCode = useAppSelector(selectNeutralCustomerCode);
  const isNeutralAuthenticated = useAppSelector(selectIsNeutralAuthenticated);

  useEffect(() => {
    if (!customerCode || !isNeutralAuthenticated) return;

    const manageStrategyAndAssets = async () => {
      let strategy = await manageStrategy(StrategyNames.Jasmine, customerCode);

      if (!strategy) throw new Error("Failed to create strategy");

      strategy = await manageStrategyAssets(strategy);

      if (!strategy) throw new Error("Failed to update strategy");
    };

    manageStrategyAndAssets();
  }, [customerCode, isNeutralAuthenticated]);
};

export const useStrategySubscription = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const strategyCode = useAppSelector(selectSelectedStrategyCode);

  useEffect(() => {
    if (!isLoggedIn) return;

    dispatch(getPoolStrategies());
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    if (!strategyCode) return;

    dispatch(subscribeStrategyAssets(strategyCode));
  }, [strategyCode, dispatch]);

  return { strategyCode };
};
