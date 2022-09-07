/**
 * cleans out eth, dollar signs, commas and percentages from a string and returns it as a number
 * @param {string} str
 * @returns {number | undefined}
 */
export const stringToNumber = (str) => {
  if (str) {
    return Number(str.replace(/["\,|ETH|\%|\$"]/g, ""));
  }
};

export const imxDataToCsDataFormat = (imxCollection) => {
  return {
    Sales: imxCollection.trade_volume_usd,
    Change: imxCollection?.change?.trade_volume_usd,
    Owners: imxCollection.owner_count,
    Txns: imxCollection.trade_count,
  };
};
