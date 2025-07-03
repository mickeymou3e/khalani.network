import { Stack, Typography } from "@mui/material";

import { Fees } from "@/components/molecules";
import { Symbols } from "@/definitions/types";
import { PoolMode } from "@/store/pool";

import { AssetEntry } from "../AssetEntry";
import { containerStyle } from "./DestinationAssets.styles";
import { InfoPopover } from "./InfoPopover";
import { useDestinationAssets } from "./useDestinationAssets";

export type DestinationAssetsProps = {
  type: PoolMode;
  namespace: string;
};

const DestinationAssets = ({ namespace, type }: DestinationAssetsProps) => {
  const {
    selectionList,
    assetsExist,
    resultText,
    assetLabel,
    feeLabel,
    feeValue,
  } = useDestinationAssets(namespace, type);

  return (
    <Stack spacing="1rem">
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2">{resultText}</Typography>
        <InfoPopover />
      </Stack>

      <Stack sx={containerStyle} spacing="0.5rem">
        {assetsExist && (
          <Stack spacing="0.5rem" component="ul" m={0} p={0}>
            {selectionList.map((item, idx) => (
              <AssetEntry key={idx} asset={item!} />
            ))}
          </Stack>
        )}

        {!assetsExist && (
          <Stack direction="row" justifyContent="space-between">
            <Typography color="primary.gray2">{assetLabel}</Typography>
            <Typography color="primary.gray2">{Symbols.NoValue}</Typography>
          </Stack>
        )}
      </Stack>

      <Stack sx={containerStyle} spacing="0.5rem" component="ul">
        <Fees
          feeLabel={feeLabel}
          fee={feeValue}
          discountFee={Symbols.ZeroBalance}
        />
      </Stack>
    </Stack>
  );
};

export default DestinationAssets;
