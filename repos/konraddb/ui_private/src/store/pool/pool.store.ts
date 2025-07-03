import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";

import {
  PoolMode,
  PoolModes,
  PoolPageChangePayload,
  PoolState,
  SelectionAsset,
} from "./pool.types";

const initialState: PoolState = {
  mode: PoolModes.Deposit,
  selectedAssetKey: null,
  selectedPoolKey: null,
  selectionList: [],
};

const poolSlice = createSlice({
  name: PoolModes.Deposit,
  initialState,
  reducers: {
    modeChanged: (state, action: PayloadAction<PoolMode>) => {
      state.mode = action.payload;
      state.selectedAssetKey = null;
      state.selectedPoolKey = null;
      state.selectionList = [];
    },
    selectedAssetKeyChanged: (state, action: PayloadAction<string>) => {
      state.selectedAssetKey = action.payload;
    },
    selectedPoolKeyChanged: (state, action: PayloadAction<string>) => {
      state.selectedPoolKey = action.payload;
    },
    openPoolPage(state, action: PayloadAction<PoolPageChangePayload>) {
      state.mode = PoolModes.Deposit;
      state.selectedAssetKey = action.payload.assetKey;
      state.selectedPoolKey = action.payload.poolKey;
      state.selectionList = [];
    },
    selectionAssetAdded: (state, action: PayloadAction<SelectionAsset>) => {
      state.selectedAssetKey = null;
      state.selectedPoolKey = null;

      const existingSelection = state.selectionList.find(
        (item) => item.assetKey === action.payload.assetKey
      );
      if (existingSelection) {
        existingSelection.amount = new BigNumber(existingSelection.amount)
          .plus(action.payload.amount)
          .toNumber();
        return;
      }

      state.selectionList.push(action.payload);
    },
    selectionAssetRemoved: (state, action: PayloadAction<string>) => {
      const existingSelection = state.selectionList.find(
        (item) => item.assetKey === action.payload
      );
      state.selectionList = state.selectionList.filter((item) => {
        const key = existingSelection ? "assetKey" : "poolKey";
        return item[key] !== action.payload;
      });
    },
    resetSelection: (state) => {
      state.selectedAssetKey = null;
      state.selectedPoolKey = null;
      state.selectionList = [];
    },
    backToDefault: (state) => {
      state.selectedAssetKey = null;
      state.selectedPoolKey = null;
      state.selectionList = [];
      state.mode = PoolModes.Deposit;
    },
  },
});

const { actions, reducer } = poolSlice;

export const {
  modeChanged,
  selectedAssetKeyChanged,
  selectedPoolKeyChanged,
  selectionAssetAdded,
  selectionAssetRemoved,
  resetSelection,
  backToDefault,
  openPoolPage,
} = actions;

export { reducer as poolReducer };
