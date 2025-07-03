import { ordersMock } from "@/definitions/__mocks__";
import {
  selectSettledOrder,
  selectSettledOrders,
} from "@/store/orders/orders.selectors";

describe("Orders selectors", () => {
  test("should select settled orders", () => {
    const [first, second, third, fourth] =
      selectSettledOrders.resultFunc(ordersMock);

    expect(first).toMatchSnapshot();
    expect(second).toMatchSnapshot();
    expect(third).toMatchSnapshot();
    expect(fourth).toMatchSnapshot();
  });

  test("should select a specific settled order", () => {
    const settledOrders = selectSettledOrders.resultFunc(ordersMock);
    const result = selectSettledOrder(
      "739b82b2-0f20-4fdd-95b2-ae73bed4b136-2023-05-16T14:57:11.930Z"
    ).resultFunc(settledOrders);

    expect(result).toMatchSnapshot();
  });
});
