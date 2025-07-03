import { SimpleSelectOption } from "./SimpleSelect";

export const filterOptions = (
  options: SimpleSelectOption[],
  filterText: string,
  selectedOption?: unknown
) => {
  const matcher = (value: unknown) =>
    (value as string).toLowerCase().includes(filterText.toLowerCase());

  const filterFn = (option: SimpleSelectOption) => {
    if (selectedOption && option.value === selectedOption) {
      return true;
    }

    if (option.assets) {
      return option.assets?.some(
        (asset) =>
          matcher(asset.label) ||
          matcher(asset.description) ||
          matcher(option.value)
      );
    }

    return matcher(option.value) || matcher(option.label);
  };

  return options.filter(filterFn);
};

export const findText = (options: SimpleSelectOption[], filterText: string) =>
  Boolean(filterOptions(options, filterText).length);
