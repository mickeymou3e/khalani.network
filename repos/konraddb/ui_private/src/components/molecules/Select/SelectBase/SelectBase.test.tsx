import { composeStories } from "@storybook/testing-react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import * as stories from "./SelectBase.stories";

const { Default } = composeStories(stories);

describe("SelectBase", () => {
  describe("rendering", () => {
    test("should render components correctly", () => {
      render(<Default />);

      expect(screen.queryAllByPlaceholderText("Select a value")).toHaveLength(
        1
      );
      expect(screen.queryAllByDisplayValue("select1")).toHaveLength(2);
    });
  });

  describe("interaction", () => {
    test("should open the menu when clicking on the select", async () => {
      render(<Default />);

      expect(screen.queryAllByRole("menuitem")).toHaveLength(0);

      const user = userEvent.setup();
      await user.click(screen.queryAllByDisplayValue("select1")[0]);

      expect(screen.queryAllByRole("menuitem")).toHaveLength(4);
    });

    test("should open the menu and update the value of the dropdown when clicking on an item and then menu should close itself", async () => {
      render(<Default />);

      const user = userEvent.setup();
      await user.click(screen.queryAllByDisplayValue("select1")[0]);
      await user.click(screen.queryAllByText("select2")[0]);

      expect(screen.queryAllByDisplayValue("select2")).toHaveLength(1);
      expect(screen.queryAllByRole("menuitem")).toHaveLength(0);
    });
  });
});
