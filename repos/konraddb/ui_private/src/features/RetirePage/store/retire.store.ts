import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";

import { RetireSelectionAsset, RetireSliceProps } from "./retire.types";

const initialState: RetireSliceProps = {
  selectedAsset: null,
  selectionList: [],
};

const retireSlice = createSlice({
  name: "retire",
  initialState,
  reducers: {
    selectedAssetChanged: (state, action: PayloadAction<string>) => {
      state.selectedAsset = action.payload;
    },
    selectionAssetAdded: (
      state,
      action: PayloadAction<RetireSelectionAsset>
    ) => {
      state.selectedAsset = null;

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
      state.selectedAsset = null;
      state.selectionList = [];
    },
  },
});

const { actions, reducer } = retireSlice;

export const {
  selectedAssetChanged,
  selectionAssetAdded,
  selectionAssetRemoved,
  resetSelection,
} = actions;

export { reducer as retireReducer };
