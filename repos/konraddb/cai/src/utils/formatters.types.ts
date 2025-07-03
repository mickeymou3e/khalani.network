export interface FormatNumberOptions {
  base?: number;
  prefix?: string;
  suffix?: string;
  token?: string;
  showSign?: boolean;
  withThousandSeparator?: boolean;
  forceTwoDecimals?: boolean;
  roundUp?: boolean;
  roundEnable?: boolean;
}

export interface FormatPercentageOptions extends FormatNumberOptions {
  skipNumberFormat?: boolean;
  threshold?: number;
}
