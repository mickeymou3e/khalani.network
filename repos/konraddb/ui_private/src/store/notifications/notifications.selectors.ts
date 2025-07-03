import { RootState } from "@/store/store";

export const selectSnackbar = (state: RootState) =>
  state.notifications.snackbar;

export const selectFixedSnackbar = (state: RootState) =>
  state.notifications.fixedSnackbar;

export const selectNotifications = (state: RootState) =>
  state.notifications.notifications;
