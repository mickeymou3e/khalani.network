import { isObject } from "util";

export const filterOptions = <T extends object>({
  data,
  filter,
  exclude = [],
  include = [],
  selected = undefined,
}: {
  data: T[] | null;
  filter: string;
  exclude?: string[];
  include?: string[];
  selected?: unknown;
}) => {
  if (!data) return [];

  const matcher = (value: unknown) => {
    const comparator = (compareWith: unknown) =>
      String(value).toLowerCase().includes(String(compareWith).toLowerCase());
    return comparator(filter) || comparator(selected);
  };

  const filterFn = (option: T | null) =>
    option &&
    Object.entries(option)
      .filter(([key]) => !exclude.includes(key))
      .filter(([key]) => !include.length || include.includes(key))
      .some(([, value]) => {
        if (isObject(value)) {
          return [value].some(filterFn);
        }

        return Array.isArray(value) ? value.some(filterFn) : matcher(value);
      });

  return data.filter(filterFn);
};

export const getKeys = <T extends { [key: string]: unknown; key: string }>(
  data: T[] | null
) => (data?.length ? data?.map((item) => item.key) : []);
