import { composeStories } from "@storybook/testing-react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Symbols } from "@/definitions/types";
import { checkScreenTexts } from "@/utils/testUtils";

import * as stories from "./OrderEntryTicket.stories";

const { LoggedIn, LoggedOut } = composeStories(stories);

describe("OrderEntryTicket", () => {
  describe("Logged Out state", () => {
    it("should render order entry ticket in logged out state, defaults to limit order type", async () => {
      render(<LoggedOut />);

      checkScreenTexts([
        "Buy",
        "Sell",
        "Type",
        "Limit",
        "Price",
        "Amount",
        "Transaction details",
        "Buy price",
        "Fee",
        "Total",
      ]);
    });
  });

  describe("Logged In state", () => {
    it("should render LIMIT order entry ticket by default", async () => {
      render(<LoggedIn />);

      checkScreenTexts([
        "Buy",
        "Sell",
        "Type",
        "Limit",
        "Available",
        "1,000.25 EUR",
        "Price",
        "Amount",
        "Transaction details",
        "Buy price",
        "Fee",
        "Total",
        "Buy JLT-F23",
      ]);
    });

    it("should switch to MARKET order entry ticket", async () => {
      render(<LoggedIn />);

      const user = userEvent.setup();
      await user.click(screen.queryAllByText("Limit")[0]);
      await user.click(screen.queryAllByText("Market")[0]);

      expect(screen.queryByText("Price")).not.toBeInTheDocument();
    });

    it("shouldnt show any error if amount is within balance", async () => {
      render(<LoggedIn />);

      const user = userEvent.setup();
      await user.click(screen.queryAllByText("Limit")[0]);
      await user.click(screen.queryAllByText("Market")[0]);

      const input: HTMLInputElement = screen.getByPlaceholderText(
        Symbols.ZeroBalance
      );

      fireEvent.change(input, { target: { value: "1000" } });
      fireEvent.blur(input);

      await waitFor(() =>
        expect(
          screen.queryByText("Insufficient balance")
        ).not.toBeInTheDocument()
      );
    });

    it("should show insufficient balance text if amount is outside of balance", async () => {
      render(<LoggedIn />);

      const user = userEvent.setup();
      await user.click(screen.queryAllByText("Limit")[0]);
      await user.click(screen.queryAllByText("Market")[0]);

      const input: HTMLInputElement = screen.getByPlaceholderText(
        Symbols.ZeroBalance
      );

      fireEvent.change(input, { target: { value: "1001" } });
      fireEvent.blur(input);

      await waitFor(() =>
        expect(screen.queryByText("Insufficient balance")).toBeInTheDocument()
      );
    });

    it("should show error text below the price if its lower than current BID price", async () => {
      render(<LoggedIn />);

      const user = userEvent.setup();
      await user.click(screen.queryAllByText("Sell")[0]);

      const input: HTMLInputElement = screen.getAllByPlaceholderText(
        Symbols.ZeroBalance
      )[0] as HTMLInputElement;

      fireEvent.change(input, { target: { value: "1" } });
      fireEvent.blur(input);

      await waitFor(() =>
        expect(
          screen.queryByText(
            "Sell order price should be higher than latest sell price."
          )
        ).toBeInTheDocument()
      );
    });

    it("should show error text above the price if its higher than current ASK price", async () => {
      render(<LoggedIn />);

      const input: HTMLInputElement = screen.getAllByPlaceholderText(
        Symbols.ZeroBalance
      )[0] as HTMLInputElement;

      fireEvent.change(input, { target: { value: "3" } });
      fireEvent.blur(input);

      await waitFor(() =>
        expect(
          screen.queryByText(
            "Buy order price should be lower than latest buy price."
          )
        ).toBeInTheDocument()
      );
    });
  });
});
