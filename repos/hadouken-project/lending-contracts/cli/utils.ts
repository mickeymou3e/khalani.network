import { BigNumber, ethers } from 'ethers';

export const convertTextNumberToBigNumberStringWithDecimals = (
  text: string
): { value: string; decimals: number } => {
  const number = Number(text);

  if (number || number === 0) {
    const elements = text.split(new RegExp('[.]'));
    if (elements.length === 1) {
      return { value: elements[0], decimals: 0 };
    } else if (elements.length === 2) {
      return {
        value: `${elements[0]}${elements[1]}`,
        decimals: elements[1].length,
      };
    } else {
      throw Error('wrong number');
    }
  } else {
    throw Error('wrong number');
  }
};

export const addDotToLastDigit = (text: string) => {
  if (text.length === 1) {
    return `0.${text}`;
  }

  const value = text.slice(0, text.length - 1);
  if (!value) {
    return '0.0';
  }
  return `${text.slice(0, text.length - 1)}.${text.slice(text.length - 1)}`;
};

export function BigNumberToFloat(value: BigNumber, decimals: number): number {
  return parseFloat(ethers.utils.formatUnits(value, decimals));
}

export function FloatToBigNumber(value: number, decimals: number): BigNumber {
  return ethers.utils.parseUnits(value.toString(), decimals);
}
