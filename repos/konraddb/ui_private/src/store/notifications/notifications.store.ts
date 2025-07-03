import { toast } from "react-toastify";
import { createSlice } from "@reduxjs/toolkit";

import { NotificationPropsVariant, SnackbarVariant } from "@/definitions/types";
import { ordersApi } from "@/services/orders";

import { handleLogout } from "../auth/auth.store";
import { createPlaceOrderSuccessMessage } from "./notifications.helpers";

export interface NotificationsState {
  snackbar: {
    id: number;
    primaryText: string;
    secondaryText: string;
    variant: SnackbarVariant;
    link: string;
  };
  fixedSnackbar: {
    id: number;
    text: string;
    buttonText: string;
    error: boolean;
  };
  notifications: {
    id: string;
    primaryText: string;
    variant: NotificationPropsVariant;
    customChildren: React.ReactNode | null;
  }[];
}

export const initialState: NotificationsState = {
  snackbar: {
    id: 0,
    primaryText: "",
    secondaryText: "",
    variant: SnackbarVariant.success,
    link: "",
  },
  fixedSnackbar: {
    id: 0,
    text: "",
    buttonText: "",
    error: false,
  },
  notifications: [],
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addSnackbar: (state, action) => {
      state.snackbar.id = action.payload?.id ?? new Date().getTime();
      state.snackbar.primaryText = action.payload.primaryText;
      state.snackbar.secondaryText = action.payload?.secondaryText || "";
      state.snackbar.variant =
        action.payload?.variant || SnackbarVariant.success;
      state.snackbar.link = action.payload?.link || "";
    },
    hideSnackbar: (state) => {
      state.snackbar.id = 0;
      state.snackbar.primaryText = "";
      state.snackbar.secondaryText = "";
      state.snackbar.variant = SnackbarVariant.success;
      state.snackbar.link = "";
    },
    addFixedSnackbar: (state, action) => {
      state.fixedSnackbar.id = action.payload?.id ?? new Date().getTime();
      state.fixedSnackbar.text = action.payload.text;
      state.fixedSnackbar.buttonText = action.payload.buttonText;
      state.fixedSnackbar.error = action.payload.error;
    },
    hideFixedSnackbar: (state) => {
      state.fixedSnackbar.id = 0;
      state.fixedSnackbar.text = "";
      state.fixedSnackbar.buttonText = "";
    },
    addNotification: (state, action) => {
      const updatedNotification = {
        id: action.payload?.id ?? new Date().getTime(),
        primaryText: action.payload.text,
        variant: action.payload.variant,
        customChildren: action.payload.customChildren,
      };
      const foundItem = state.notifications.find(
        (item) => item.id === action.payload.id
      );

      if (foundItem) {
        foundItem.primaryText = action.payload.text;
        foundItem.variant = action.payload.variant;
        foundItem.customChildren = action.payload.customChildren;
        return;
      }

      state.notifications.push(updatedNotification);
    },
    hideNotification: (state, { payload }) => {
      state.notifications = state.notifications.map((item) => {
        if (item.id === payload) {
          item.primaryText = "";
          item.variant = "info";
          item.customChildren = null;
        }

        return item;
      });
    },
    hideAllNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleLogout, (state) => {
        toast.dismiss(state.fixedSnackbar.id);
        state.notifications.forEach(({ id }) => toast.dismiss(id));
        notificationsSlice.caseReducers.hideFixedSnackbar(state);
        notificationsSlice.caseReducers.hideAllNotifications(state);
      })
      .addMatcher(
        ordersApi.endpoints.submitOrder.matchFulfilled,
        (state, { payload }) => {
          const message = createPlaceOrderSuccessMessage(payload);
          addSnackbarThroughExtraReducers({ state, message });
        }
      )
      .addMatcher(
        ordersApi.endpoints.submitOrder.matchRejected,
        (state, { payload }) => {
          const message =
            (payload as any).data.desc || (payload as any).data.code || "";
          addSnackbarThroughExtraReducers({ state, message, error: true });
        }
      );
  },
});

const addSnackbarThroughExtraReducers = ({
  state,
  message,
  error = false,
}: {
  state: NotificationsState;
  message: string;
  error?: boolean;
}) => {
  const variant = error ? SnackbarVariant.error : SnackbarVariant.success;
  notificationsSlice.caseReducers.addSnackbar(
    state,
    notificationsSlice.actions.addSnackbar({ primaryText: message, variant })
  );
};

const { reducer } = notificationsSlice;

export const {
  addSnackbar,
  addFixedSnackbar,
  addNotification,
  hideSnackbar,
  hideFixedSnackbar,
  hideNotification,
  hideAllNotifications,
} = notificationsSlice.actions;

export { reducer as notificationsReducer };
