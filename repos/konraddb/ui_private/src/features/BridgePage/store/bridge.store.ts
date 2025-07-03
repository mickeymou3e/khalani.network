import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";

import { BridgeMode } from "@/features/BridgePage/BridgePage.types";

import {
  BridgeSelectionAsset,
  BridgeSliceProps,
  GridTabs,
} from "./bridge.types";

const initialState: BridgeSliceProps = {
  mode: BridgeMode.In,
  asset: "",
  registry: "",
  selectionList: [],
  tab: GridTabs.OpenRequests,
};

const bridgeSlice = createSlice({
  name: "bridge",
  initialState,
  reducers: {
    changeMode: (state, action: PayloadAction<BridgeMode>) => {
      state.mode = action.payload;
    },
    changeAsset: (state, action: PayloadAction<string>) => {
      state.asset = action.payload;
    },
    changeRegistry: (state, action: PayloadAction<string>) => {
      state.registry = action.payload;
    },
    selectionAssetAdded: (
      state,
      action: PayloadAction<BridgeSelectionAsset>
    ) => {
      state.asset = "";
      state.registry = "";

      const existingSelection = state.selectionList.find(
        (item) => item.asset === action.payload.asset
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
      state.selectionList = state.selectionList.filter(
        (item) => item.asset !== action.payload
      );
    },
    resetSelection: (state) => {
      state.asset = "";
      state.registry = "";
      state.selectionList = [];
    },
    backToDefault: (state) => {
      state.asset = "";
      state.registry = "";
      state.selectionList = [];
      state.tab = GridTabs.OpenRequests;
      state.mode = BridgeMode.In;
    },
    changeTab: (state, action: PayloadAction<GridTabs>) => {
      state.tab = action.payload;
    },
  },
});

const { actions, reducer } = bridgeSlice;

export const {
  changeMode,
  changeAsset,
  changeRegistry,
  selectionAssetAdded,
  selectionAssetRemoved,
  resetSelection,
  backToDefault,
  changeTab,
} = actions;

export { reducer as bridgeReducer };
