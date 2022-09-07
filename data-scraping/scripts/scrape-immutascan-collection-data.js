const collectionAddresses = require("../output-data/imx-collection-addresses-2.json");
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
  const res = await fetch("https://3vkyshzozjep5ciwsh2fvgdxwy.appsync-api.us-west-2.amazonaws.com/graphql", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json",
      "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"104\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "x-api-key": "da2-ihd6lsinwbdb3e6c6ocfkab2nm",
      "Referer": "https://immutascan.io/",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": "{\"operationName\":\"getMetricsAll\",\"variables\":{\"address\":\""+ addr+"\"},\"query\":\"query getMetricsAll($address: String!) {\\n  getMetricsAll(address: $address) {\\n    items {\\n      type\\n      trade_volume_usd\\n      trade_volume_eth\\n      floor_price_usd\\n      floor_price_eth\\n      trade_count\\n      owner_count\\n      __typename\\n    }\\n    __typename\\n  }\\n  latestTrades(address: $address) {\\n    items {\\n      transfers {\\n        token {\\n          token_address\\n          quantity\\n          token_id\\n          type\\n          usd_rate\\n          __typename\\n        }\\n        __typename\\n      }\\n      txn_time\\n      txn_id\\n      __typename\\n    }\\n    __typename\\n  }\\n}\"}",
    "method": "POST"
  });

  return res;
};

/**
 * write result into file
 * @param {string} content
 */
const writeToFile = (filename, content) => {
  try {
    fs.appendFileSync(filename, content); // for imx only.
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
  console.log(data)
  console.log(trades)

  const trade = trades.find(
    (item) =>
      !!item.transfers.find((transfer) => !!transfer.token.token_address)
  );

  const transferWithAddress = trade?.transfers.find(
    (transfer) => !!transfer?.token?.token_address
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
const getTotalsAndWrite = (filename, data, collectionName, addr) => {
  const items = data.getMetricsAll.items;
  const totals = {
    name: collectionName,
    address: addr,
    "24h": getTotalsForLastXd(items, 1, 2),
    "7d": getTotalsForLastXd(items, 1, 8),
    "30d": getTotalsForLastXd(items, 1, 31),
    total: getAllTimeTotal(items),
  };
  writeToFile(filename, JSON.stringify(totals));
};

/**
 * given a list of collection addresses, batch the fetch requests from immutascan and store data
 * @param {{"address":string, "name":string}[]} collections
 */
const fetchDataFromCollections = async (filename, collections) => {
  writeToFile(filename, "[");

  collections.forEach(async (collectionItem) => {
    const response = await getFetchCallForGivenCollectionAddress(
      collectionItem.address
    );
    const res = await response.json();
    console.log(res.data);
    getTotalsAndWrite(filename, res.data, collectionItem.name, collectionItem.address);
    writeToFile(filename, ",");
  });
  writeToFile(filename, "]");
};

const getVolumeForImmutableXFromImmutascanOver24h = async () => {
  const response = await getFetchCallForGivenCollectionAddress("global");
  const res = await response.json();
  getTotalsAndWrite(
    "../output-data/immutascan-imx-chain-data-24h.json",
    res.data,
    "immutable x"
  );
};

/* 
  FUNCTION CALLS  
*/
fetchDataFromCollections(
  "../output-data/immutascan-collection-data.json",
  collectionAddresses
);
getVolumeForImmutableXFromImmutascanOver24h();
