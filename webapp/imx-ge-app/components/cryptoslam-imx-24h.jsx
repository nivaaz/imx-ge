import data from "../data/cs-blockchains-by-nft-sales-volume.json";

export const ImxCryptoslamTotal24h = () => {
  const differenceData = data.find(chain => chain.Blockchain === 'ImmutableX');
  const headings = [...Object.keys(differenceData)];

  const tableHeadings = headings.map((h) => (
    <td key={h + "imx24"}>
      <p> {h.toUpperCase()}</p>
    </td>
  ))

  const tableContent = headings.map((h) => (
    <td key={h + "ddimx24"}>
      <p> {differenceData[h]}</p>
    </td>
  ))
  return (
    <>
      <table >
        <tbody>
          <tr key={"imx24"} className="tableHeading">
            {tableHeadings}
          </tr>
          <tr key={"ddimx24"}>
            {tableContent}
          </tr>
        </tbody>
      </table>
    </>
  );
};
