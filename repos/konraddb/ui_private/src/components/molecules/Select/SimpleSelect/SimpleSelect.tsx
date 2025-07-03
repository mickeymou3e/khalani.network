import { useState } from "react";
import { useTranslation } from "next-i18next";

import { Box, MenuItem, MenuList, Typography } from "@mui/material";

import { Growth } from "@/components/atoms/CustomIcons";
import { BaseAssetEntry, SearchInput } from "@/components/molecules";

import { SelectBase, SelectBaseProps } from "../SelectBase";
import { filterOptions } from "./Select.helpers";
import { SelectionItem } from "./SelectionItem";
import {
  emptyBodyStyle,
  menuStyle,
  searchInputStyle,
} from "./SimpleSelect.styles";

export type SimpleSelectOption = {
  value: string;
  label?: string;
  assets?: BaseAssetEntry[];
};

export type SimpleSelectProps = {
  value: string;
  options: SimpleSelectOption[];
  searchable?: boolean;
  showDescription?: boolean;
  type?: "address";
  searchPlaceholder?: string;
  searchSize?: "small" | "medium";
} & SelectBaseProps;

const renderValue =
  (options: SimpleSelectOption[], type: any) =>
  (value: unknown): React.ReactNode => {
    const option = options.find((opt) => opt.value === value);

    return (
      <SelectionItem
        label={option?.label}
        assets={option?.assets}
        type={type}
        value={option?.value}
        selected
      />
    );
  };

const namespace = "common:components:select";

const SimpleSelect = ({
  value,
  options,
  searchable = false,
  showDescription = false,
  setValue,
  type,
  searchPlaceholder,
  searchSize,
  ...rest
}: SimpleSelectProps) => {
  const { t } = useTranslation(namespace);

  const [keyword, setKeyword] = useState("");

  const handleClick = (val: string, onClose: () => void) => () => {
    setValue?.(val);
    onClose();
  };

  return (
    <SelectBase
      {...rest}
      value={value}
      options={options}
      renderValue={value !== "" ? renderValue(options, type) : undefined}
    >
      {(onClose, scrollbarDetectRef, hasScrollbar) => (
        <>
          {searchable && options.length >= 5 && (
            <SearchInput
              sx={searchInputStyle}
              value={keyword}
              setValue={setKeyword}
              onKeyDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              placeholder={searchPlaceholder}
              size={searchSize}
            />
          )}
          <MenuList sx={menuStyle(hasScrollbar)} ref={scrollbarDetectRef}>
            {filterOptions(options, keyword, value).map((opt) => (
              <MenuItem
                key={opt.value}
                selected={opt.value === value}
                onClick={handleClick(opt.value, onClose)}
              >
                <SelectionItem
                  label={opt.label}
                  assets={opt.assets}
                  showDescription={showDescription}
                  type={type}
                  value={opt.value}
                />
              </MenuItem>
            ))}
            {filterOptions(options, keyword, value).length === 0 && (
              <Box sx={emptyBodyStyle}>
                <Growth />
                <Typography variant="body2" color="primary.gray2">
                  {t(`${namespace}:noResultsFound`)}
                </Typography>
              </Box>
            )}
          </MenuList>
        </>
      )}
    </SelectBase>
  );
};

export default SimpleSelect;
