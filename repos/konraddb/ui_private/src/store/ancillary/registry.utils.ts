import { ethers } from "ethers";

import { CertificateRegistry } from "@/definitions/config/registry";

interface ParsedEnergyAttributeTokenID {
  uuid: string;
  registry: CertificateRegistry;
  vintage: Date;
}

export const decodeEnergyAttributeTokenId = (
  tokenId: bigint | string
): ParsedEnergyAttributeTokenID => {
  const eatId = BigInt(tokenId);

  const uuidNumber = eatId >> 128n;
  const uuidPacked = ethers
    .zeroPadBytes(ethers.toBeHex(uuidNumber), 16)
    .slice(2);

  const uuid = [
    uuidPacked.slice(0, 8),
    uuidPacked.slice(8, 12),
    uuidPacked.slice(12, 16),
    uuidPacked.slice(16, 20),
    uuidPacked.slice(20),
  ].join("-");

  const registryNumber = Number((eatId >> 96n) & BigInt(2 ** 32 - 1));
  const registry = Object.values(CertificateRegistry)[
    registryNumber
  ] as CertificateRegistry;

  const vintageNumber = Number((eatId >> 56n) & BigInt(2 ** 40 - 1));
  const vintage = new Date(vintageNumber * 1_000);

  return {
    uuid,
    registry,
    vintage,
  };
};

export const CertificateRegistryArr = Object.values(CertificateRegistry);

export const encodeEnergyAttributeTokenId = (
  certificateId: string,
  registry: CertificateRegistry,
  vintage: Date
) => {
  const uuid = BigInt(`0x${certificateId.replaceAll("-", "")}`);
  const registryNumber =
    BigInt(CertificateRegistryArr.indexOf(registry)) & BigInt(2 ** 32 - 1);
  const vintageNumber =
    BigInt(Math.ceil(vintage.getTime() / 1_000)) & BigInt(2 ** 40 - 1);
  return (uuid << 128n) + (registryNumber << 96n) + (vintageNumber << 56n);
};
