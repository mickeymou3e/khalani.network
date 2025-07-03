import { createSelector } from "@reduxjs/toolkit";
import * as dateFns from "date-fns";

import { TechType } from "@/definitions/types";
import { selectJasminePoolDeposits } from "@/store/ancillary";

import { PoolDeposit, TechTypeProps, VintageProps } from "./pool.types";

export const selectJasmineTechTypes = createSelector(
  selectJasminePoolDeposits,
  (poolDeposits = []) => {
    const rawTechTypes = poolDeposits.reduce(
      (acc: TechTypeProps[], deposit: PoolDeposit) => {
        const techType = deposit.token.generator.techType.toLowerCase();
        const foundItem = acc.find(
          (item: TechTypeProps) => item.name === techType
        );

        return foundItem
          ? acc.map((item) =>
              item.name === techType
                ? { ...item, value: item.value + deposit.balance }
                : item
            )
          : [...acc, { name: techType, value: deposit.balance }];
      },
      []
    );

    const accumulatedValue = rawTechTypes.reduce(
      (acc: number, item: TechTypeProps) => acc + item.value,
      0
    );

    return rawTechTypes
      .map((item: TechTypeProps) => ({
        ...item,
        percentage: (item.value / accumulatedValue) * 100,
      }))
      .sort((a, b) => (a.percentage < b.percentage ? 1 : -1));
  }
);

export const selectJasmineTechTypeOrder = createSelector(
  selectJasmineTechTypes,
  (techTypes) => techTypes.map((item) => item.name as TechType)
);

export const selectJasmineVintages = createSelector(
  selectJasminePoolDeposits,
  (poolDeposits = []) =>
    poolDeposits
      .reduce((acc: VintageProps[], deposit: PoolDeposit) => {
        const techType = deposit.token.generator.techType.toLowerCase();
        const vintageName = dateFns.format(
          new Date(deposit.token.vintage),
          "MM-yy"
        );
        const foundItem = acc.find(
          (item: VintageProps) => item.name === vintageName
        );

        return foundItem
          ? acc.map((item) => {
              if (item.name !== vintageName) return item;

              return item[techType]
                ? {
                    ...item,
                    [techType]: (item[techType] as number) + deposit.balance,
                  }
                : { ...item, [techType]: deposit.balance };
            })
          : [...acc, { name: vintageName, [techType]: deposit.balance }];
      }, [])
      .sort((a, b) => (a.name > b.name ? 1 : -1))
);
