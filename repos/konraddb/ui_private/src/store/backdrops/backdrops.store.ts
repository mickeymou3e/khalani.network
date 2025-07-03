import { createSlice } from "@reduxjs/toolkit";

import { Backdrops } from "@/definitions/types";

export interface BackdropsState {
  currentBackdrop: Backdrops | null;
  parameters?: any;
}

export const initialState: BackdropsState = {
  currentBackdrop: null,
  parameters: null,
};

export const backdropsSlice = createSlice({
  name: "backdrops",
  initialState: initialState as BackdropsState,
  reducers: {
    openBackdrop: (state, action) => {
      state.currentBackdrop = action.payload;
    },
    openStatefulBackdrop: (state, action) => {
      state.currentBackdrop = action.payload.backdrop;
      state.parameters = action.payload.parameters;
    },
    hideBackdrop: (state) => {
      state.currentBackdrop = null;
      state.parameters = null;
    },
    setParameters: (state, action) => {
      state.parameters = action.payload;
    },
  },
});

const { reducer } = backdropsSlice;

export const {
  openBackdrop,
  openStatefulBackdrop,
  hideBackdrop,
  setParameters,
} = backdropsSlice.actions;

export { reducer as backdropsReducer };
