export type AssignedAsset = {
  base: string;
  created: string;
  guaranteed_qty: string;
  quote: string;
  settings_code: string;
  stream_type: string;
  updated: string;
  pair?: string;
  spread_mode?: string;
};

export type AssignedAssetsResponse = {
  records: AssignedAsset[];
};
