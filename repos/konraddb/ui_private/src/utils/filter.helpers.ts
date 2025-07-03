export const filterOptions = <T extends object>(
  dataProvider: T[] | null,
  filterText: string,
  selectedOption?: unknown
) => {
  if (!dataProvider) return [];

  const matcher = (value: unknown) => {
    const comparator = (compareWith: unknown) =>
      String(value).toLowerCase().includes(String(compareWith).toLowerCase());
    return comparator(filterText) || comparator(selectedOption);
  };

  const filterFn = (option: T | null) =>
    option &&
    Object.entries(option).some(([, value]) =>
      Array.isArray(value) ? value.some(filterFn) : matcher(value)
    );

  return dataProvider.filter(filterFn);
};
