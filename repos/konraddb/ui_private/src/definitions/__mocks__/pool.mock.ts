export const jasminePoolDepositsMock = [
  {
    id: "02e74265-e8f0-4e7a-b826-5c95eb57d509",
    balance: 933,
    tokenId:
      "9099846275235338337781713235466366617387933382847318544154661189209135513600",
    token: {
      vintage: "2023-03-01T00:00:00.000Z",
      generator: {
        techType: "SOLAR",
      },
    },
  },
  {
    id: "07685f05-e427-4e14-ae8c-0f2d80d81d17",
    balance: 901,
    tokenId:
      "58143434673104402184681770351867146451825489264921167162932316293061232558080",
    token: {
      vintage: "2023-02-01T00:00:00.000Z",
      generator: {
        techType: "SOLAR",
      },
    },
  },
  {
    id: "cbff1eca-f4bd-4586-8a0c-99295946cd8f",
    balance: 4600,
    tokenId:
      "97807749870362540913077634561303509279322211818769535094137228738296505434112",
    token: {
      vintage: "2023-02-01T00:00:00.000Z",
      generator: {
        techType: "WIND",
      },
    },
  },
  {
    id: "e24c00d7-adde-469f-9e02-0594a1fb8e4c",
    balance: 700,
    tokenId:
      "3162076973941875473479057173965512843390177904055220565933811656470258778112",
    token: {
      vintage: "2023-01-01T00:00:00.000Z",
      generator: {
        techType: "WIND",
      },
    },
  },
];

const tokenMetadataAttributes = [
  {
    trait_type: "Tech Type",
    value: "SOLAR",
  },
  {
    trait_type: "Generator",
    value: "PR-TEP IVE-1",
  },
  {
    trait_type: "Location",
    value: "PR",
  },
  {
    trait_type: "Certification Type",
    value: "REC",
  },
  {
    trait_type: "Vintage",
    value: "Apr 2023",
  },
  {
    trait_type: "Registry",
    value: "NAR",
  },
];

export const jasmineTokenMetadataMock = [
  {
    id: "e89011c4-1b86-434a-93b9-8e802ea60f4e",
    balance: 933,
    attributes: [...tokenMetadataAttributes],
    tokenId:
      "9099846275235338337781713235466366617387933382847318544154661189209135513600",
  },
  {
    id: "e99011c4-1b86-434a-93b9-8e802ea60f7e",
    balance: 901,
    attributes: [...tokenMetadataAttributes],
    tokenId:
      "58143434673104402184681770351867146451825489264921167162932316293061232558080",
  },
  {
    id: "e10011c4-1b86-434a-93b9-8e802ea60f8e",
    balance: 4600,
    attributes: [...tokenMetadataAttributes],
    tokenId:
      "97807749870362540913077634561303509279322211818769535094137228738296505434112",
  },
  {
    id: "e11011c4-1b86-434a-93b9-8e802ea60f9e",
    balance: 700,
    attributes: [...tokenMetadataAttributes],
    tokenId:
      "3162076973941875473479057173965512843390177904055220565933811656470258778112",
  },
];
