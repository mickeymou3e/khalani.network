import { composeStories } from "@storybook/testing-react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import * as stories from "./AppBar.stories";
import { MenuItemProps } from "./types";

const { LoggedIn, LoggedOut } = composeStories(stories);

jest.mock("next/router", () => require("next-router-mock"));

describe("AppBar", () => {
  describe("render", () => {
    it("should render components with logged out status", () => {
      render(<LoggedOut />);

      expect(screen.queryByText("Login")).toBeInTheDocument();
      expect(screen.queryByTestId("SmsOutlinedIcon")).toBeInTheDocument();
      expect(
        screen.queryByTestId("PersonOutlineOutlinedIcon")
      ).not.toBeInTheDocument();
    });

    it("should render components with logged in status", () => {
      render(<LoggedIn />);

      expect(screen.queryByText("Login")).not.toBeInTheDocument();
      expect(screen.queryByText("Sign up")).not.toBeInTheDocument();
      expect(screen.queryByTestId("SmsOutlinedIcon")).toBeInTheDocument();
      expect(
        screen.queryAllByTestId("PersonOutlineOutlinedIcon")[0]
      ).toBeInTheDocument();
    });
  });

  describe("interaction", () => {
    it("should select the 'Trade' menu item", async () => {
      render(<LoggedOut />);

      const user = userEvent.setup();
      await user.click(screen.getByText("Trade"));

      expect(document.querySelector("[aria-pressed=true]")).toHaveTextContent(
        "Trade"
      );
    });

    it("should select Wallet item from the hamburger menu", async () => {
      const callbackFn = jest.fn();
      render(<LoggedIn onHamburgerMenuSelect={callbackFn} />);

      const user = userEvent.setup();
      await user.click(screen.queryAllByTestId("PersonOutlineOutlinedIcon")[0]);
      await user.click(screen.getByText("My assets"));
      await user.click(screen.getByText("Portfolio"));

      expect(callbackFn).toHaveBeenCalledWith([
        `/${MenuItemProps.wallet}`,
        "portfolio",
      ]);
    });
  });
});
