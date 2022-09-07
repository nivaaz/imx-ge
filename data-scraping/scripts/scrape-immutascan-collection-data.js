const collectionAddresses = require("./imx-collection-addresses-2.json"); 
const fetch = require("node-fetch");
const fs = require("fs");

const listOfFields = [
  "trade_volume_usd",
  "trade_volume_eth",
  "trade_count",
  "owner_count",
];

/**
 * fetched from network api call on the collection page on immutascan!
 * @param {string} addr 
 * @returns {Response} https://developer.mozilla.org/en-US/docs/Web/API/Response
 */
const getFetchCallForGivenCollectionAddress = async (addr) => {
  const res = await fetch(
    "https://3vkyshzozjep5ciwsh2fvgdxwy.appsync-api.us-west-2.amazonaws.com/graphql",
    {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-api-key": "da2-ihd6lsinwbdb3e6c6ocfkab2nm",
      },
      body:
        '{"operationName":"getMetricsAll","variables":{"address":"' +
        addr +
        '"},"query":"query getMetricsAll($address: String!) {  getMetricsAll(address: $address) {    items {      type      trade_volume_usd      trade_volume_eth      floor_price_usd      floor_price_eth      trade_count      owner_count          }      }  latestTrades(address: $address) {    items {      transfers {        token {          token_address          quantity          token_id          type          usd_rate                  }              }      txn_time      txn_id          }      }}"}',
      method: "POST",
    }
  );
  return res;
};

/**
 * write result into file
 * @param {string} content 
 */
const writeToFile = (content) => {
  try {
    fs.appendFileSync("./immutascan-s2-collection-data.json", content); // for all collections
    // fs.appendFileSync("./immutascan-imx-volume-24h.json", content); // for imx only.
  } catch (err) {
    console.error(err);
  }
};

/**
 * get differences for all the fields on the objects
 * @param {{
 "trade_volume_usd": float,
 "trade_volume_eth": float,
 "trade_count": int,
 "owner_count": int}} a 
 * @param {{
 "trade_volume_usd": float,
 "trade_volume_eth": float,
 "trade_count": int,
 "owner_count": int}} b 
 * @returns {{
 "trade_volume_usd": float,
 "trade_volume_eth": float,
 "trade_count": int,
 "owner_count": int}}
 */
const getDiffBetweenObjects = (a, b) => {
  const result = {};

  for (i in listOfFields) {
    const currentField = listOfFields[i];

    result[currentField] =
      ((a?.[currentField] ?? 0) * 100 - (b?.[currentField] ?? 0) * 100) / 100;
  }
  return result;
};

/* 
 given'items' the response from the immutascan api, get the first object which is an all time total.
*/
/**
 * 
 * @param {{
    type: string;
    trade_volume_usd: float;
    trade_volume_eth: float;
    floor_price_usd: float;
    floor_price_eth: float;
    trade_count: int;
    owner_count: int;
}[]} items 
 * @returns ({
    type: string;
    trade_volume_usd: float;
    trade_volume_eth: float;
    floor_price_usd: float;
    floor_price_eth: float;
    trade_count: int;
    owner_count: int;
})
 */
const getAllTimeTotal = (items) => {
  const totalData = items[0];
  // verify this is the total data
  if (totalData.type !== "total") {
    throw Error("total data item not found ");
  }
  return totalData;
};

/**
 * given the above data, find the sum from bottomIndex to topIndex on the array items and add a typeString label
 * return an object with the differences
 * @param {{
  type: string,
  trade_volume_usd: float,
  trade_volume_eth: float,
  floor_price_usd: float,
  floor_price_eth: float,
  trade_count: int,
  owner_count: int,
  }[]} items 
 * @param {int} bottomIndexRange 
 * @param {int} topIndexRange 
 * @returns  {{
      trade_volume_usd: float,
      trade_volume_eth: float,
      trade_count: int,
      owner_count: int,
      change: {
        trade_volume_usd: float,
        trade_volume_eth: float,
        trade_count: int,
        owner_count: int,
      }
    }}
 */
const getTotalsForLastXd = (items, bottomIndexRange, topIndexRange) => {
  const todayData = items[bottomIndexRange];
  const lastDayData = items[topIndexRange];

  const slicedArray = [...items.slice(bottomIndexRange, topIndexRange)];
  const total = slicedArray.reduce(
    (previousValue, currentValue) => ({
      trade_volume_usd:
        previousValue.trade_volume_usd + currentValue.trade_volume_usd,
      trade_volume_eth:
        previousValue.trade_volume_eth + currentValue.trade_volume_eth,
      trade_count: previousValue.trade_count + currentValue.trade_count,
      owner_count: previousValue.owner_count + currentValue.owner_count,
    }),
    {
      trade_volume_usd: 0,
      trade_volume_eth: 0,
      trade_count: 0,
      owner_count: 0,
    }
  );
  total["change"] = getDiffBetweenObjects(todayData, lastDayData);
  return total;
};

/**
 * 
 * @param {{
 * latestTrades:{
 * items:{
 * transfers:{
 * token:{
 * token_address: string
 * }
 * }[]
 * }}}} data 
 * @returns {string}
 */
const getTokenAddressFromResponse = (data) => {
  const trades = data.latestTrades.items;
  const trade = trades.find(
    (item) =>
      !!item.transfers.find((transfer) => !!transfer.token.token_address)
  );
  const transferWithAddress = trade.transfers.find(
    (transfer) => !!transfer.token.token_address
  );
  return transferWithAddress.token.token_address;
};


/**
 * get the volume totals for a given data response for 24h, 7d and 30d
 * @param {{
 getMetricsAll:{
  items: {
  type: string,
  trade_volume_usd: float,
  trade_volume_eth: float,
  floor_price_usd: float,
  floor_price_eth: float,
  trade_count: int,
  owner_count: int,
  }[]
 }
}[]} data 
 * @param {string} collectionName 
 */
const getTotalsAndWrite = (data, collectionName) => {
  const items = data.getMetricsAll.items;
  const totals = {
    name: collectionName,
    address: getTokenAddressFromResponse(data),
    "24h": getTotalsForLastXd(items, 1, 2),
    "7d": getTotalsForLastXd(items, 1, 8),
    "30d": getTotalsForLastXd(items, 1, 31),
    total: getAllTimeTotal(items),
  };
  writeToFile(JSON.stringify(totals));
};

/**
 * given a list of collection addresses, batch the fetch requests from immutascan and store data
 * @param {{"address":string, "name":string}[]} collections
 */
const fetchDataFromCollections = async (collections) => {
  writeToFile("[");

  collections.forEach(async (collectionItem) => {
    const response = await getFetchCallForGivenCollectionAddress(
      collectionItem.address
    );
    const res = await response.json();
    getTotalsAndWrite(res.data, collectionItem.name);
    writeToFile(",");
  });
  writeToFile("]");
};

const getVolumeForImmutableXFromImmutascanOver24h = async () =>{
  const response = await getFetchCallForGivenCollectionAddress('global');
  const res = await response.json();
  getTotalsAndWrite(res.data, "immutable x");
}

// FUNCTION CALLS
fetchDataFromCollections(collectionAddresses);
// getVolumeForImmutableXFromImmutascanOver24h()
