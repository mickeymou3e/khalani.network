import { ExecutionSide, Order, OrderType } from "@/definitions/types";
import { translate } from "@/utils/i18n";
import { evaluate } from "@/utils/logic";

const translateOrderTicket = translate("trade-page:orderTicket");

export const createPlaceOrderSuccessMessage = (payload: Order) => {
  const isBuy = payload.action === ExecutionSide.BUY;
  const isMarket = payload.type === OrderType.MARKET;

  const translationKey = evaluate(
    [true, "marketBuyOrderCreated"],
    [isMarket && !isBuy, "marketSellOrderCreated"],
    [!isMarket && isBuy, "limitBuyOrderCreated"],
    [!isMarket && !isBuy, "limitSellOrderCreated"]
  ) as string;

  return translateOrderTicket(translationKey) as string;
};
