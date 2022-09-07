import PrintTable from "./print-table";

const getPercentageChange = (change, total) =>{
  return Math.round(change/total*100)/100
}

/**
 * 
 * @param {*} imxdata Immutable data array
 * @param {} csData Cryptoslam data array
 * @returns 
 */
export const CompareCollectionsAcrossSites = ({ imxdata, csData }) => {
  const collectionsInCommon = [];

  imxdata.map((imxCollection) => {
    const imxName = imxCollection.name.toUpperCase();

    const matchingcsCollection = csData.find(
      (csCollection) => csCollection.Collection.toUpperCase() === imxName
    );
    if (!!matchingcsCollection?.Collection) {
      const mappedImxObject = {
        Sales: imxCollection.trade_volume_usd,
        "Change% (30d)": getPercentageChange(imxCollection.change.trade_volume_usd,imxCollection.trade_volume_usd ),
        Owners: imxCollection.owner_count,
        Txns: imxCollection.trade_count,
      };
      const differenceObject = {
        Sales: Math.abs(Math.round((mappedImxObject.Sales -  matchingcsCollection["Sales (USD)"])*100)/100),
        Change: Math.abs(mappedImxObject['Change% (30d)'] - matchingcsCollection['Change% (30d)']),
        Owners: Math.abs(mappedImxObject.Owners - matchingcsCollection.Owners),
        Txns: Math.abs(Math.round((mappedImxObject.Txns - matchingcsCollection.Txns)*100)/100),
      };
      const csObject = { ...matchingcsCollection };
      delete csObject.Collection;
      collectionsInCommon.push({
        name: imxName,
        ima: mappedImxObject,
        cs: csObject,
        change: differenceObject,
      });
    }
  });

  return (
    <>
      There are {collectionsInCommon.length} overlapping collections with data
      from Cryptoslam and Immutascan.
      {collectionsInCommon.map((c) => (
        <>
          <h4> 🚀{c?.name} </h4>
          <p> Immutascan </p>
          {c?.ima && <PrintTable tableType="immutascan" data={[c.ima]} />}
          <p> Cryptoslam </p>
          {c?.cs && <PrintTable data={[c.cs]} />}
          <p>Difference between both websites</p>
          {c?.change && <PrintTable data={[c.change]} />}
        </>
      ))}
    </>
  );
};
