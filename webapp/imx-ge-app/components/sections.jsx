import styles from "../styles/Home.module.css";
import FirebaseContext from "../pages/api/firebaseContext";
import { ChainsTable } from "./compare-chains-table";
import { ImxImmutascanTotal24h } from "./immutascan-imx-24h";
import { ImxCryptoslamTotal24h } from "./cryptoslam-imx-24h";
import cSlam24hData from "../data/cryptoslam-nft-ranking-sales-volume24h.json";
import cSlam7dData from "../data/cryptoslam-nft-ranking-sales-volume7d.json";
import cSlam30dData from "../data/cryptoslam-nft-ranking-sales-volume30d.json";
import ImmutascancollectionData from "../data/immutascan-s2-collection-data.json";
import { CompareCollectionsAcrossSites } from "./compare-collections-cross-site";

export const Sections = () => {
  const immutascanCollectionData24h = [];
  const immutascanCollectionData7d = [];
  const immutascanCollectionData30d = [];
  const immutascanCollectionDataTotal = [];

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
            <h1> Immutascan vs Cryptoslam </h1>
            <p>
              We have seen differences in trading values across Immutascan and
              Cryptoslam. In an effort to understand where these differences
              might be coming from, we have pulled together some numbers to
              understand the differences.
            </p>

            <section>
              <h1> At a glance </h1>
              {/*  TODO: */}
            </section>

            <section>
              <h2> Section 1</h2>
              <p>
                Let us begin by exploring the total NFT sales volumes on
                CryptoSlam vs Immutascan.
              </p>

              <div>
                <h3>
                  CryptoSlam Volume on Immutable X over the last 24 hours.
                </h3>
                <ImxCryptoslamTotal24h />
              </div>

              <div>
                <h3>
                  Immutascan Volume on Immutable X over the last 24 hours.
                </h3>
                <ImxImmutascanTotal24h totalType="24h" />
              </div>
              <div>
                <h3> The differences </h3>
                {/* TODO:IMX volume to compare. */}

                <p>
                  Now we have had a look at the data, let us deep dive on what
                  it all means!
                </p>
              </div>

              <div>
                <h3>
                  But, how does IMX compare to the top 10 chains? According to
                  CryptoSlam
                </h3>
                {/* TODO:Table for the top 10 */}
                <ChainsTable />
                {/* TODO:IMX volume to compare. */}
              </div>
            </section>

            {/*  */}
            <section>
              <h2> Section 2</h2>
              <p>
                Now that we have a high level overview, let us compare the
                values that contribute to the overall volume.
              </p>

              <div>
                <h3> Over 24 hours </h3>
                <CompareCollectionsAcrossSites
                  imxdata={immutascanCollectionData24h}
                  csData={cSlam24hData}
                />
              </div>

              <div>
                <h3> Over 7 days </h3>
                <CompareCollectionsAcrossSites
                  imxdata={immutascanCollectionData7d}
                  csData={cSlam7dData}
                />
              </div>

              <div>
                <h3> Over 30 days </h3>
                <CompareCollectionsAcrossSites
                  imxdata={immutascanCollectionData30d}
                  csData={cSlam30dData}
                />
              </div>
            </section>
          </main>
        </>
      )}
    </FirebaseContext.Consumer>
  );
};
