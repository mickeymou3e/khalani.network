const formatAddress = (
  address: string | undefined,
  firstDigits = 6,
  lastDigits = 5
) =>
  address && typeof address === "string"
    ? `${address.substring(0, firstDigits)}...${address.substring(
        address.length - lastDigits
      )}`
    : "-";

export default formatAddress;
