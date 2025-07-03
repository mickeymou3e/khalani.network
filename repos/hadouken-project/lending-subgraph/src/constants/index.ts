import { Bytes } from "@graphprotocol/graph-ts";

export const ETH_ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export function zeroAddress(): Bytes {
  return Bytes.fromHexString(
    "0x0000000000000000000000000000000000000000"
  ) as Bytes;
}
