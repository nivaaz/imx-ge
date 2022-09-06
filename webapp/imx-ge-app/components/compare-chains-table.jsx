import data from "../data/cs-blockchains-by-nft-sales-volume.json";
import PrintTable from "./print-table";

export const ChainsTable = () => {
  return <PrintTable data={data} />;
};
