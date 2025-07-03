import ForestOutlinedIcon from "@mui/icons-material/ForestOutlined";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Button } from "@/components/atoms";
import { DataGridWithControls } from "@/components/molecules";

import { emptyGridStyles } from "./ApiKeysList.styles";
import { useApiKeysList } from "./useApiKeysList";

interface ApiKeysListProps {
  handleAddNewApiKey: () => void;
}

const ApiKeysList = ({ handleAddNewApiKey }: ApiKeysListProps) => {
  const {
    dataProvider,
    apiKeysLabel,
    noApiKeyLabel,
    addLabel,
    columnConfig,
    pageSize,
    handlePageSizeChange,
    handleRemoveApiKey,
  } = useApiKeysList();

  return (
    <DataGridWithControls
      datagridLabel={apiKeysLabel}
      columnConfig={columnConfig}
      dataProvider={dataProvider}
      onPageSizeChange={handlePageSizeChange}
      listLength={pageSize}
      handleCellClicked={handleRemoveApiKey}
    >
      {!dataProvider.length && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={3}
          height={240}
        >
          <ForestOutlinedIcon sx={emptyGridStyles} />
          <Typography variant="body2" color="primary.gray2">
            {noApiKeyLabel}
          </Typography>
          <Button variant="contained" size="small" onClick={handleAddNewApiKey}>
            {addLabel}
          </Button>
        </Box>
      )}
    </DataGridWithControls>
  );
};

export default ApiKeysList;
