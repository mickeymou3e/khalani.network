import {
  createRetireEnergyAttributeTokensPayload,
  createRetirePoolTokenPayload,
} from "./retire.helpers";
import { RetirementType } from "./retire.types";

describe("retire helpers", () => {
  const selectionEAT1 = {
    amount: 1,
    asset:
      "103051775042279800697427364218177107132237646356633359816523917612409700745216",
  };
  const selectionEAT2 = {
    amount: 3,
    asset:
      "108622046748489726741763088461417064812672346805530353639872213116434279038976",
  };
  const selectionPoolToken = {
    amount: 2,
    asset: "jlt_f23",
  };

  const strategy = {
    code: "ba470344-d578-47ab-9f5b-2077ecb6c1d5",
    name: "AUX",
    customer_code: "26a17540-2bf0-428d-b902-33f035bcbeb7",
    client_code: "b4137ae0-e941-45b2-a9c3-9f1c16f49428",
    status: "wait_approval",
    assets: [
      {
        code: "7b65f1ea-f8fa-41ba-84d1-857f8d59630c",
        currency: "JLT-F23_POLYGON_TEST_MUMBAI_IZ3C",
        address: "0x753A53A83700017FD2957EA56a7837c6bA6aa89a",
        tag: "",
        created_at: "2023-10-11T09:34:09.566Z",
        updated_at: "2023-10-11T09:34:10.920Z",
      },
      {
        code: "b9914e02-a255-48ca-b513-9d0ae476582f",
        currency: "MATIC_POLYGON_MUMBAI",
        address: "0x753A53A83700017FD2957EA56a7837c6bA6aa89a",
        tag: "",
        created_at: "2023-10-11T09:34:04.599Z",
        updated_at: "2023-10-11T09:34:08.944Z",
      },
    ],
    created_at: "2023-10-03T21:39:43.660Z",
    updated_at: "2023-10-03T21:39:43.660Z",
  };

  describe("createRetireEnergyAttributeTokensPayload", () => {
    it("should create a retire payload for EAT tokens", () => {
      const selectionList = [selectionEAT1, selectionPoolToken, selectionEAT2];
      const expected = {
        firstStep: {
          strategyCode: "ba470344-d578-47ab-9f5b-2077ecb6c1d5",
          ids: '["103051775042279800697427364218177107132237646356633359816523917612409700745216","108622046748489726741763088461417064812672346805530353639872213116434279038976"]',
          values: '["1","3"]',
          txSettings: {
            gas_limit: "140000",
            gas_price: "",
            max_fee_per_gas: "",
            max_priority_fee_per_gas: "",
          },
        },
        secondStep: {
          amount: 4,
          retirementType: RetirementType.EAT,
        },
      };

      const result = createRetireEnergyAttributeTokensPayload(
        strategy,
        selectionList
      );

      expect(result).toEqual(expected);
    });

    it("should not create a retire payload for non EAT tokens", () => {
      const selectionList = [selectionPoolToken];

      const result = createRetireEnergyAttributeTokensPayload(
        strategy,
        selectionList
      );

      expect(result).toBeNull();
    });
  });

  describe("createRetirePoolTokenPayload", () => {
    it("should create a retire payload for pool tokens", () => {
      const selectionList = [selectionEAT1, selectionPoolToken, selectionEAT2];
      const expected = {
        firstStep: {
          strategyCode: "ba470344-d578-47ab-9f5b-2077ecb6c1d5",
          amount: "2000000000000000000",
          txSettings: {
            gas_limit: "250000",
            gas_price: "",
            max_fee_per_gas: "",
            max_priority_fee_per_gas: "",
          },
        },
        secondStep: {
          amount: 2,
          retirementType: RetirementType.JLT,
        },
      };

      const result = createRetirePoolTokenPayload(strategy, selectionList);

      expect(result).toEqual(expected);
    });

    it("should not create a retire payload for non pool tokens", () => {
      const selectionList = [selectionEAT1, selectionEAT2];

      const result = createRetirePoolTokenPayload(strategy, selectionList);

      expect(result).toBeNull();
    });
  });
});
