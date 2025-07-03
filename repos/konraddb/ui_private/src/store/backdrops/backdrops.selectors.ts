import { RootState } from "@/store/store";

export const selectCurrentBackdrop = (state: RootState) =>
  state.backdrops.currentBackdrop;

export const selectBackdropParams = (state: RootState) =>
  state.backdrops.parameters;

export const selectIsCurrentBackdropOpened = (state: RootState) =>
  state.backdrops.currentBackdrop !== null;
