import { Box } from "@mui/material";

import { ToggleButtonGroup } from "@/components/atoms";
import { SearchInput } from "@/components/molecules";

import { History } from "./History";
import { OrderDetailsModal } from "./History/OrderDetailsModal";
import {
  containerStyle,
  searchInputStyle,
  toggleGroupStyle,
  topBarStyle,
} from "./Holdings.styles";
import { Orders } from "./Orders";
import { Portfolio } from "./Portfolio";
import useHoldings from "./useHoldings";

const Holdings = () => {
  const {
    selectedHolding,
    holdingToggleGroupValues,

    isOrdersSelected,
    isHistorySelected,
    isPortfolioSelected,
    isAuthenticated,
    searchText,
    searchPlaceholder,
    handleToggleChange,
    handleChangeSearchText,
  } = useHoldings();

  return (
    <>
      <Box sx={containerStyle}>
        <Box sx={topBarStyle}>
          <ToggleButtonGroup
            sx={toggleGroupStyle}
            currentValue={selectedHolding}
            values={holdingToggleGroupValues}
            exclusive
            handleAction={handleToggleChange}
          />
          <SearchInput
            sx={searchInputStyle}
            value={searchText}
            disabled={!isAuthenticated}
            setValue={handleChangeSearchText}
            size="small"
            placeholder={searchPlaceholder}
            onKeyDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          />
        </Box>
        {isOrdersSelected && <Orders />}
        {isHistorySelected && <History />}
        {isPortfolioSelected && <Portfolio />}
      </Box>

      <OrderDetailsModal />
    </>
  );
};

export default Holdings;
