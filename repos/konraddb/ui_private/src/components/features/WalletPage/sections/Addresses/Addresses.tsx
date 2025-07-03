import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

import { Button, EmptyGrid } from "@/components/atoms";
import { DataGridWithControls } from "@/components/molecules";
import { SubpageHeader } from "@/components/molecules/SubpageHeader";

import { containerStyle, placeholderStyle } from "./Addresses.styles";
import { namespace } from "./config";
import { useAddresses } from "./useAddresses";
import { useTranslations } from "./useTranslations";

const Addresses = () => {
  const {
    assets,
    pageTitle,
    pageTitleDescription,
    addNew,
    add,
    addresses,
    noAddressesYet,
  } = useTranslations(namespace);

  const {
    dataProvider,
    columnConfig,
    listLength,
    handlePageSizeChange,
    handleNewAddress,
    handleCellClicked,
  } = useAddresses();

  return (
    <Box sx={containerStyle}>
      <SubpageHeader
        label={assets}
        title={pageTitle}
        subtitle={pageTitleDescription}
        buttonLabel={addNew}
        handleButtonClick={handleNewAddress}
      />

      <DataGridWithControls
        datagridLabel={addresses}
        columnConfig={columnConfig}
        dataProvider={dataProvider}
        handleCellClicked={handleCellClicked}
        onPageSizeChange={handlePageSizeChange}
        listLength={listLength}
        enableHorizontalScroll
      >
        {dataProvider.length === 0 && (
          <Box sx={placeholderStyle}>
            <EmptyGrid />
            <Typography variant="body2" color="primary.gray2">
              {noAddressesYet}
            </Typography>
            <Button variant="contained" size="small" onClick={handleNewAddress}>
              {add}
            </Button>
          </Box>
        )}
      </DataGridWithControls>
    </Box>
  );
};

export default Addresses;
