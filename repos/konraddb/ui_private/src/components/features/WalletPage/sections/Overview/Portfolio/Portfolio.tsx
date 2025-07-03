import { Box } from "@mui/material";

import { ToggleButtonGroup } from "@/components/atoms";
import { SearchInput } from "@/components/molecules";
import { WalletPorfolioTabs } from "@/definitions/types";

import { PoolFiat, PoolFiatMode } from "./PoolFiat";
import { containerStyle } from "./Portfolio.styles";
import { Underlyings } from "./Underlyings";
import { usePortfolio } from "./usePortfolio";

const Portfolio = () => {
  const {
    portfolioToggleGroupValues,
    selectedPortfolioTab,
    search,
    searchKeyword,
    isListEmpty,
    handleToggleChange,
    setSearchKeyword,
  } = usePortfolio();

  return (
    <Box sx={containerStyle}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <ToggleButtonGroup
          currentValue={selectedPortfolioTab}
          values={portfolioToggleGroupValues}
          exclusive
          handleAction={handleToggleChange}
        />
        <SearchInput
          setValue={setSearchKeyword}
          placeholder={search}
          onKeyDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          size="small"
          sx={{ width: "240px" }}
          value={searchKeyword}
          disabled={isListEmpty}
        />
      </Box>
      {selectedPortfolioTab === WalletPorfolioTabs.pool && (
        <PoolFiat mode={PoolFiatMode.Pool} searchKeyword={searchKeyword} />
      )}
      {selectedPortfolioTab === WalletPorfolioTabs.underlyings && (
        <Underlyings searchKeyword={searchKeyword} />
      )}
      {selectedPortfolioTab === WalletPorfolioTabs.fiat && (
        <PoolFiat mode={PoolFiatMode.Fiat} searchKeyword={searchKeyword} />
      )}
    </Box>
  );
};

export default Portfolio;
