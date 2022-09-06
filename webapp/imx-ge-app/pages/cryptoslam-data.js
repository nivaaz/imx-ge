import cSlam7dData from "../data/cryoto-slam-nft0ranking-sales-colume7d.json";
import cSlam24hData from "../data/cryoto-slam-nft0ranking-sales-colume24h.json";
import cSlam30dData from "../data/cryoto-slam-nft0ranking-sales-colume30d.json";
import PrintTable from "../components/print-table";
import { useState } from "react";

const views = ["24h", "7d", "30d"];

const CryptoSlamData = () => {
  const [selectedView, setSelctedView] = useState("24h");
  const [selectedData, setSelectedData] = useState(cSlam30dData);

  const handleClick = (e) => {
    setSelctedView(e.target.value);
    switch (e.target.value) {
      case "30d":
        setSelectedData(cSlam30dData);
        break;
      case "7d":
        setSelectedData(cSlam7dData);
        break;
      default:
        setSelectedData(cSlam24hData);
    }
  };

  return (
    <main>
      <h4> Cryptoslam </h4>
      {views.map((view) => {
        const isSelected = view === selectedView;
        return (
          <button
            className={isSelected ? "selectedView" : ""}
            onClick={handleClick}
            value={view}
          >
            {view}
          </button>
        );
      })}
     
      <PrintTable data={selectedData} />
    </main>
  );
};

export default CryptoSlamData