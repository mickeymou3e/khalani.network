import { composeStories } from "@storybook/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import * as stories from "./SimpleSelect.stories";

const { Default, WithSearch, WithDescription } = composeStories(stories);

describe("SimpleSelect", () => {
  describe("rendering the component", () => {
    test("should render components default state", () => {
      render(<Default />);

      expect(screen.queryAllByText("BTC")).toHaveLength(2);
    });
  });

  describe("Basic component interactions", () => {
    test("should open the menu when clicking on the select", async () => {
      render(<Default />);

      expect(screen.queryAllByRole("menuitem")).toHaveLength(0);

      const user = userEvent.setup();
      await user.click(screen.queryAllByText("BTC")[0]);

      expect(screen.queryAllByRole("menuitem")).toHaveLength(3);
    });

    test("should open the menu and update the value of the dropdown when clicking on an item and then menu should close itself", async () => {
      render(<Default />);

      const user = userEvent.setup();
      await user.click(screen.queryAllByText("BTC")[0]);
      await user.click(screen.queryAllByText("ETH")[0]);

      expect(screen.queryAllByText("ETH")).toHaveLength(1);
      expect(screen.queryAllByRole("menuitem")).toHaveLength(0);
    });
  });

  describe("use the search field", () => {
    test("should narrow down the number of list elements when search expression is provided", async () => {
      render(<WithSearch />);

      const user = userEvent.setup();
      await user.click(screen.queryAllByText("BTC")[0]);

      const input: HTMLInputElement | null = screen
        .getByTestId("search-input")
        .querySelector("input");

      if (!input) return;

      fireEvent.change(input, { target: { value: "ETH" } });

      await waitFor(() =>
        expect(screen.queryAllByRole("menuitem")).toHaveLength(2)
      );
    });
  });

  describe("asset descriptions", () => {
    test("should display asset descriptions in menu items", async () => {
      render(<WithDescription />);

      const user = userEvent.setup();
      await user.click(screen.queryAllByText("BTC")[0]);

      expect(screen.getByText("Bitcoin")).toBeInTheDocument();
      expect(screen.getByText("Ethereum")).toBeInTheDocument();
      expect(screen.getByText("USD Coin")).toBeInTheDocument();
    });
  });
});
