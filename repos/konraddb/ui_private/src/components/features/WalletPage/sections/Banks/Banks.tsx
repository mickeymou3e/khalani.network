import Box from "@mui/material/Box";

import { DataGrid } from "@/components/molecules";
import { SubpageHeader } from "@/components/molecules/SubpageHeader";

import { containerStyle } from "./Banks.styles";
import { namespace } from "./config";
import { useBanks } from "./useBanks";
import { useTranslations } from "./useTranslations";

const Banks = () => {
  const { wallet, pageTitle, pageTitleDescription, noBanksYet } =
    useTranslations(namespace);

  const { dataProvider, columnConfig } = useBanks();

  return (
    <Box sx={containerStyle}>
      <SubpageHeader
        label={wallet}
        title={pageTitle}
        subtitle={pageTitleDescription}
      />

      <DataGrid
        columns={columnConfig}
        dataProvider={dataProvider ?? []}
        placeholder={noBanksYet}
        pageSize={10}
        enableHorizontalScroll
      />
    </Box>
  );
};

export default Banks;
