/* eslint-disable no-restricted-globals */

import { parseISO } from "date-fns";

// TODO: refactor after MVP - add translations of the date
export const formatDate = (dateString: any) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (!dateString) {
    return "-";
  }

  const date = new Date(dateString);

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const suffix = getDaySuffix(day);

  if (isNaN(day) || isNaN(monthIndex) || isNaN(year)) {
    return "-";
  }

  return `${months[monthIndex]} ${day}${suffix} ${year}`;
};

const getDaySuffix = (day: number) => {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const formatDateToIso = (dateString: string | number) => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);
  const seconds = `0${date.getSeconds()}`.slice(-2);

  const result = [`${year}-${month}-${day}`, `${hours}:${minutes}:${seconds}`];

  return result;
};

export const getTimestamp = (date: string) =>
  Math.floor(parseISO(date).getTime() / 1000).toString();

export const convertToComparableFormat = (dateString: string): string => {
  const splittedDate = dateString.split("-");
  const month = splittedDate[0];
  let year = splittedDate[1];
  if (year.length === 2) {
    year = `20${year}`;
  }
  return `${year}${month}`;
};
