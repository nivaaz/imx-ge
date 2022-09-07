import styles from "../styles/Home.module.css";
import FirebaseContext from "../pages/api/firebaseContext";
import { ChainsTable } from "./compare-chains-table";
import { ImxImmutascanTotal24h } from "./immutascan-imx-24h";
import { ImxCryptoslamTotal24h } from "./cryptoslam-imx-24h";
import cSlam24hData from "../data/cryptoslam-nft-ranking-sales-volume24h.json";
import cSlam7dData from "../data/cryptoslam-nft-ranking-sales-volume7d.json";
import cSlam30dData from "../data/cryptoslam-nft-ranking-sales-volume30d.json";
import ImmutascancollectionData from "../data/immutascan-collection-data.json";
import { CompareCollectionsAcrossSites } from "./compare-collections-cross-site";
import imaImxData from "../data/immutascan-imx-chain-data-24h.json";
import blockchainsData from "../data/cs-blockchains-by-nft-sales-volume.json";
import PrintTable from "./print-table";
import { imxDataToCsDataFormat } from "../utils";

export const Sections = () => {
  const immutascanCollectionData24h = [];
  const immutascanCollectionData7d = [];
  const immutascanCollectionData30d = [];
  const immutascanCollectionDataTotal = [];
  const imxData24h = imxDataToCsDataFormat({...imaImxData["24h"]});
  const csImxData24 = blockchainsData.find(chain => chain.Blockchain === 'ImmutableX');
  ImmutascancollectionData.forEach((collection) => {
    immutascanCollectionData24h.push({
      name: collection.name,
      ...collection["24h"],
    });
    immutascanCollectionData7d.push({
      name: collection.name,
      ...collection["7d"],
    });
    immutascanCollectionData30d.push({
      name: collection.name,
      ...collection["30d"],
    });
    immutascanCollectionDataTotal.push({
      name: collection.name,
      ...collection.total,
    });
  });

  return (
    <FirebaseContext.Consumer>
      {() => (
        <>
          <main className={styles.main}>
            <h1> 🪄 Immutascan vs Cryptoslam </h1>
            <p> By Nivaaz 👋🏽</p>
            <p>
              We have seen differences in trading values across Immutascan and
              Cryptoslam. In an effort to understand where these differences
              might be coming from, we have pulled together some numbers to
              understand the differences.
            </p>

            <section>
              <h2> ✨ Section 1</h2>
              <p>
                Let us begin by exploring the total NFT sales volumes on
                CryptoSlam vs Immutascan.
              </p>

              <div>
                <h3>
                 🔍 CryptoSlam Volume on Immutable X over the last 24 hours.
                </h3>
                <ImxCryptoslamTotal24h />
              </div>

              <div>
                <h3>
                🔍  Immutascan Volume on Immutable X over the last 24 hours.
                </h3>
                <ImxImmutascanTotal24h totalType="24h" />
              </div>
              <div>
                <h3> 🔍 The differences </h3>
                <PrintTable  dontShowBlockchain data = {[imxData24h]} tableType = "immutascan"/>
                <PrintTable dontShowBlockchain data = {[csImxData24]}/>
                <p>
                  Now we have had a look at the data, let us deep dive on what
                  it all means!
                </p>
              </div>

              <div>
                <h3>
                🔍  But, how does IMX compare to the top 10 chains? 
                </h3>
                <p> According to CryptoSlam:</p>
                <ChainsTable />
              </div>
            </section>

            <section>
              <h2> ✨ Section 2</h2>
              <p>
                Now that we have a high level overview, let us compare the
                values that contribute to the overall volume.
              </p>

              <div>
                <h3>🪄 Over 24 hours </h3>
                <CompareCollectionsAcrossSites
                  imxdata={immutascanCollectionData24h}
                  csData={cSlam24hData}
                />
              </div>

              <div>
                <h3>🪄 Over 7 days </h3>
                <CompareCollectionsAcrossSites
                  imxdata={immutascanCollectionData7d}
                  csData={cSlam7dData}
                />
              </div>

              <div>
                <h3>🪄 Over 30 days </h3>
                <CompareCollectionsAcrossSites
                  imxdata={immutascanCollectionData30d}
                  csData={cSlam30dData}
                />
              </div>
            </section>
            <p> Thanks for reading 👋🏽</p>
          </main>
        </>
      )}
    </FirebaseContext.Consumer>
  );
};
