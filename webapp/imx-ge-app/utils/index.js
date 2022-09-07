
export const imxDataToCsDataFormat = (imxCollection) => {
  return {
    Sales: imxCollection.trade_volume_usd,
    Change: imxCollection?.change?.trade_volume_usd,
    Owners: imxCollection.owner_count,
    Txns: imxCollection.trade_count,
  };
};
