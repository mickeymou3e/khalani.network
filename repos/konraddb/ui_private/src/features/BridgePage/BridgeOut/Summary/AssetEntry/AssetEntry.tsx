import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, Stack, Typography } from "@mui/material";

import { IconButton } from "@/components/atoms";
import { Asset } from "@/components/molecules";
import { Symbols } from "@/definitions/types";
import { SelectionItem } from "@/features/BridgePage/store";

type AssetEntryProps = {
  asset?: SelectionItem;
  placeholder?: string;
  onDelete?: (id: string) => void;
};

const AssetEntry = ({ asset, placeholder, onDelete }: AssetEntryProps) => {
  if (!asset || placeholder) {
    return (
      <Box component="li" display="flex" justifyContent="space-between">
        <Typography variant="body2" component="span" color="primary.gray2">
          {placeholder}
        </Typography>
        <Typography
          variant="body2"
          fontWeight="bold"
          component="span"
          color="primary.gray2"
        >
          {Symbols.NoValue}
        </Typography>
      </Box>
    );
  }

  return (
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
};

export default AssetEntry;
