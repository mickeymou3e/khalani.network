import Box from "@mui/material/Box";

import { SubpageHeader } from "@/components/molecules/SubpageHeader";

import { containerStyle } from "./ApiKeys.styles";
import { ApiKeysList } from "./ApiKeysList";
import { useApiKeys } from "./useApiKeys";

const ApiKeys = () => {
  const {
    accountLabel,
    apiKeysLabel,
    apiKeysDescription,
    newApiKeyLabel,
    handleAddNewApiKey,
  } = useApiKeys();

  return (
    <Box sx={containerStyle}>
      <SubpageHeader
        label={accountLabel}
        title={apiKeysLabel}
        subtitle={apiKeysDescription}
        buttonLabel={newApiKeyLabel}
        handleButtonClick={handleAddNewApiKey}
      />

      <ApiKeysList handleAddNewApiKey={handleAddNewApiKey} />
    </Box>
  );
};

export default ApiKeys;
