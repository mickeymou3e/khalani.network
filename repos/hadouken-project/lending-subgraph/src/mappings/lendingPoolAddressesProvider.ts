import { PriceOracleUpdated } from "../../generated/LendingPoolAddressesProvider/LendingPoolAddressesProvider";
import * as Schemas from "../../generated/schema";

export function createOrLoadRegistry(): Schemas.Registry {
  let registry = Schemas.Registry.load("1");

  if (!registry) {
    registry = new Schemas.Registry("1");
    registry.reserves = [];
    registry.save();
  }
  return registry;
}

export function changePriceOracle(event: PriceOracleUpdated): void {
  let registry = createOrLoadRegistry();

  registry.hadoukenOracle = event.params.newAddress;
  registry.save();
}
