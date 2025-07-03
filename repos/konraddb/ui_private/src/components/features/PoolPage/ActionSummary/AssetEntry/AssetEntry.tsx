import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, Stack, Typography } from "@mui/material";

import { IconButton } from "@/components/atoms";
import { Asset } from "@/components/molecules";
import {} from "@/definitions/config";
import { SelectionItem } from "@/store/pool/pool.types";

type AssetEntryProps = {
  asset: SelectionItem;
  onDelete?: (id: string) => void;
};

const AssetEntry = ({ asset, onDelete }: AssetEntryProps) => (
  <Box component="li" display="flex" justifyContent="space-between">
    <Asset asset={asset} small />
    <Stack spacing="0.75rem" direction="row">
      <Typography variant="body2" fontWeight="bold" component="span">
        {asset?.amount}
      </Typography>
      {onDelete && (
        <IconButton
          size="small"
          variant="outlined"
          onClick={() => onDelete(asset?.id)}
        >
          <DeleteOutlineIcon />
        </IconButton>
      )}
    </Stack>
  </Box>
);

export default AssetEntry;
