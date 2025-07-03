import React from "react";

import { Box, Typography } from "@mui/material";

import { DataGrid } from "@/components/molecules";
import { AppLayout } from "@/components/organisms";

import { MarketsGridRowDetails } from "./MarketsPage.selectors";
import { containerStyle } from "./MarketsPage.styles";
import { RowDetails } from "./RowDetails";
import { useMarketsPage } from "./useMarketsPage";

export const MarketsPage = () => {
  const { pageTitle, dataProvider, columnConfig, handleCellClick } =
    useMarketsPage();

  return (
    <Box sx={containerStyle}>
      <Typography component="h4" variant="h4" mb={9} mt={6}>
        {pageTitle}
      </Typography>

      <DataGrid
        columns={columnConfig}
        dataProvider={dataProvider}
        enableHorizontalScroll
        onCellClick={handleCellClick}
        renderRowContents={(dataProvider: MarketsGridRowDetails) => (
          <RowDetails dataProvider={dataProvider} />
        )}
      />
    </Box>
  );
};

const MarketsPageWithLayout = () => (
  <AppLayout>
    <MarketsPage />
  </AppLayout>
);

export default MarketsPageWithLayout;
