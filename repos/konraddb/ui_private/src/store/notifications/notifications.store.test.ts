import { createMockNotificationsStore } from "@/definitions/__mocks__";
import { NotificationPropsVariant, Notifications } from "@/definitions/types";

import {
  addFixedSnackbar,
  addNotification,
  addSnackbar,
  hideNotification,
  hideSnackbar,
  initialState,
  notificationsReducer,
} from "./notifications.store";

describe("notifications slice reducer", () => {
  test("should handle initial state", () => {
    const expectedState = createMockNotificationsStore({});

    expect(notificationsReducer(initialState, { type: "unknown" })).toEqual(
      expectedState
    );
  });

  test("should handle adding a snackbar message", () => {
    const expectedState = createMockNotificationsStore({
      id: 1,
      primaryText: "Hello Snackbar",
    });

    const action = addSnackbar({ primaryText: "Hello Snackbar", id: 1 });

    expect(notificationsReducer(initialState, action)).toEqual(expectedState);
  });

  test("should handle hiding a snackbar", () => {
    const expectedState = createMockNotificationsStore({
      id: 0,
      primaryText: "",
    });

    const action = hideSnackbar();

    expect(notificationsReducer(initialState, action)).toEqual(expectedState);
  });

  test("should handle adding a fixed snackbar message", () => {
    const expectedState = createMockNotificationsStore({
      fixedId: 2,
      text: "Hello Fixed Snackbar",
      buttonText: "Verify",
      error: true,
    });

    const action = addFixedSnackbar({
      text: "Hello Fixed Snackbar",
      buttonText: "Verify",
      id: 2,
      error: true,
    });

    expect(notificationsReducer(initialState, action)).toEqual(expectedState);
  });

  test("should handle hiding a fixed snackbar", () => {
    const expectedState = createMockNotificationsStore({
      fixedId: 0,
      text: "",
      buttonText: "",
    });

    const action = hideSnackbar();

    expect(notificationsReducer(initialState, action)).toEqual(expectedState);
  });

  describe("notifications", () => {
    const notification1 = {
      id: Notifications.NonAdmin,
      primaryText: "Hello Notification 1",
      variant: "info" as NotificationPropsVariant,
      customChildren: null,
    };
    const notification2 = {
      id: Notifications.UnavailableFeature,
      primaryText: "Hello Notification 2",
      variant: "error" as NotificationPropsVariant,
      customChildren: null,
    };
    const removedNotification = {
      id: Notifications.UnavailableFeature,
      primaryText: "",
      variant: "info" as NotificationPropsVariant,
      customChildren: null,
    };

    test("should handle adding a notification", () => {
      const expectedState = createMockNotificationsStore({
        notifications: [notification1],
      });
      const action = addNotification({
        ...notification1,
        text: notification1.primaryText,
      });

      expect(notificationsReducer(initialState, action)).toEqual(expectedState);
    });

    test("should handle adding a second notification", () => {
      const previousState = { ...initialState, notifications: [notification1] };
      const expectedState = createMockNotificationsStore({
        notifications: [notification1, notification2],
      });
      const action = addNotification({
        ...notification2,
        text: notification2.primaryText,
      });

      expect(notificationsReducer(previousState, action)).toEqual(
        expectedState
      );
    });

    test("should handle modifying a notification", () => {
      const previousState = {
        ...initialState,
        notifications: [notification1, notification2],
      };
      const expectedState = createMockNotificationsStore({
        notifications: [notification1, removedNotification],
      });
      const action = hideNotification(Notifications.UnavailableFeature);

      expect(notificationsReducer(previousState, action)).toEqual(
        expectedState
      );
    });
  });
});
