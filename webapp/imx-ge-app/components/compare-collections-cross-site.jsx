import PrintTable from "./print-table";
import stringToNumber from "../utils/index";

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
        Change: imxCollection.change.trade_volume_usd,
        Owners: imxCollection.owner_count,
        Txns: imxCollection.trade_count,
      };
      const differenceObject = {
        Sales: mappedImxObject.Sales -  matchingcsCollection.Sales,
        Change: mappedImxObject.Change - matchingcsCollection.Change,
        Owners: mappedImxObject.Owners - matchingcsCollection.Owners,
        Txns: mappedImxObject.Txns - matchingcsCollection.Txns,
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
          <p>{c?.name} </p>
          {c?.ima && <PrintTable tableType="immutascan" data={[c.ima]} />}
          {c?.cs && <PrintTable data={[c.cs]} />}
          {c?.change && <PrintTable data={[c.change]} />}
        </>
      ))}
    </>
  );
};
