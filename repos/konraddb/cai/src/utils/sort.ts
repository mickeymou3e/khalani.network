import { convertToComparableFormat } from "./dateFormatters";

type WithDateProperty = {
  [key: string]: any;
  updated: string;
};

export const sortByDate = (arr: WithDateProperty[]) =>
  arr.sort((a, b) => {
    const dateA = new Date(a.updated as string);
    const dateB = new Date(b.updated as string);

    return dateB.getTime() - dateA.getTime();
  });

export const sortDateKeys = (keys: { name: string }[]): { name: string }[] =>
  keys.sort((a, b) => {
    const comparableA = convertToComparableFormat(a.name);
    const comparableB = convertToComparableFormat(b.name);
    return comparableA.localeCompare(comparableB);
  });
