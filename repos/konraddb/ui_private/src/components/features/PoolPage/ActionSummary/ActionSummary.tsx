import { Stack } from "@mui/material";

import { PoolMode } from "@/store/pool";

import { DestinationAssets } from "./DestinationAssets";
import { OriginAssets } from "./OriginAssets";

type AssetListProps = {
  type: PoolMode;
  namespace: string;
};

const ActionSummary = ({ type, namespace }: AssetListProps) => (
  <Stack gap="3rem">
    <OriginAssets type={type} namespace={namespace} />
    <DestinationAssets type={type} namespace={namespace} />
  </Stack>
);

export default ActionSummary;
