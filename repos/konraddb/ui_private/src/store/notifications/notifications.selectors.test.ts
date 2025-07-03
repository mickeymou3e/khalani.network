import { RootState } from "@/store/store";

import { selectSnackbar } from "./notifications.selectors";

describe("notifications selectors", () => {
  test("should select snackbar properties from state", () => {
    const state = {
      notifications: {
        snackbar: {
          id: 1,
          primaryText: "Hello Snackbar",
          secondaryText: "This is a snackbar message",
          variant: "success",
          link: "https://www.google.com",
        },
      },
    } as RootState;

    const result = selectSnackbar(state);

    expect(result).toEqual(state.notifications.snackbar);
  });
});
