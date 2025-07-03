import { OracleUpdate } from "../../generated/DIAOracle/DIAOracle";
import * as Schemas from "../../generated/schema";

export function createOrLoadDIAPrice(address: string): Schemas.DIAPrice {
  let DIAPrice = Schemas.DIAPrice.load(address);

  if (!DIAPrice) {
    DIAPrice = new Schemas.DIAPrice(address);
    DIAPrice.save();
  }
  return DIAPrice;
}

export function updatePriceOracle(event: OracleUpdate): void {
  let key = event.params.key;
  let symbol = key.split("/")[0];

  let DIAPrice = createOrLoadDIAPrice(key);
  DIAPrice.symbol = symbol;
  DIAPrice.rate = event.params.value;
  DIAPrice.timestamp = event.params.timestamp;
  DIAPrice.save();
}
