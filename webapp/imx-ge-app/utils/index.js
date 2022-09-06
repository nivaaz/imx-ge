export const dollarToNumber = (dollar) => {
  const newDollar = dollar
    .replaceAll(",", "")
    .replaceAll("ETH", "")
    .replaceAll("$", "")
    .replaceAll("%", "");
  return Number(newDollar);
};
