import {
  btcAssetDetailsMock,
  ethAssetDetailsMock,
  jltCustodyWalletMock,
  maticPolygonCustodyWalletMock,
} from "@/definitions/__mocks__";

import { selectCustodyWalletCodes } from "./wallet.selectors";
import { removeDuplicates } from "./wallet.store";

describe("Wallet selectors", () => {
  it("Should return first object of 2 with the same code", () => {
    const result = removeDuplicates(
      [btcAssetDetailsMock, ethAssetDetailsMock, btcAssetDetailsMock],
      "code"
    );

    expect(result).toStrictEqual([btcAssetDetailsMock, ethAssetDetailsMock]);
  });

  describe("selectCustodyWalletCodes", () => {
    it("Should return array of wallet codes", () => {
      const result = selectCustodyWalletCodes.resultFunc([
        maticPolygonCustodyWalletMock,
        jltCustodyWalletMock,
      ]);

      expect(result).toEqual([
        "669e5a7a-a48a-4df9-ba55-415623552811",
        "ef148c21-0799-4b68-930c-11fdcb0ec29d",
      ]);
    });
  });
});
