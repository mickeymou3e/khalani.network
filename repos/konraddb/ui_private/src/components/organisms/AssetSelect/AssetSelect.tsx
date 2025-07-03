import { useRouter } from "next/router";

import { Asset, RowProps, SelectBase } from "@/components/molecules";
import { AppRoutes } from "@/definitions/config";
import { useAppSelector } from "@/store";
import { RateData, selectAllAssetRateDetails } from "@/store/rates";
import { selectUnauthenticatedAssetRateDetails } from "@/store/rates/rates.selectors";
import { selectSelectedPair } from "@/store/ui/ui.selectors";

import { DropdownContents } from "./DropdownContents";

const renderValue =
  (options: RateData[]) =>
  (value: unknown): React.ReactNode => {
    const option = options.find((opt) => opt.id === value);

    if (!option) return null;

    const asset = {
      icon: option.base,
      label: option.pair,
    };

    return <Asset asset={asset} showDescription={false} />;
  };

const AssetSelect = () => {
  const router = useRouter();
  const selectedPair = useAppSelector(selectSelectedPair);
  const dataProvider = useAppSelector(selectAllAssetRateDetails);
  const unauthDataProvider = useAppSelector(
    selectUnauthenticatedAssetRateDetails
  );
  const selectedDataProvider = dataProvider.length
    ? dataProvider
    : unauthDataProvider;

  const handleSelect = (row: RowProps) => {
    router.push(`${AppRoutes.TRADE}/${row.pair.replace("/", "_")}`);
  };

  return (
    <SelectBase
      value={selectedPair.pair}
      options={selectedDataProvider}
      renderValue={renderValue(selectedDataProvider)}
    >
      {(onClose) => (
        <DropdownContents
          dataProvider={selectedDataProvider}
          onSelect={handleSelect}
          onClose={onClose}
        />
      )}
    </SelectBase>
  );
};

export default AssetSelect;
