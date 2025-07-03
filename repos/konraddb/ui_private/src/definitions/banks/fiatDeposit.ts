export const fiatDepositAccounts = [
  {
    asset: "EUR",
    assetName: "Euro",
    accountHolder: "DLT Securities GmbH",
    bankName: "Bank Frick & Co. AG",
    bankAddress: "Landstrasse 14, 9496 Balzers, Liechtenstein",
    accountType: null,
    swift_bicCode: "BFRILI22XXX",
    ibanCode: "LI12 0881 1010 3504 Y000 E",
  },
] as FiatDepositAccounts[];

export interface FiatDepositAccounts {
  asset: string | null;
  assetName: string | null;
  accountHolder: string | null;
  bankName: string | null;
  bankAddress: string | null;
  accountType: string | null;
  swift_bicCode: string | null;
  ibanCode: string | null;
}
