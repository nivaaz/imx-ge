import data from "../data/immutascan-imx-volume-24h.json";

// totalType is: total, 30d, 24h or 7d as a string
export const ImxImmutascanTotal24h = (props) => {
  const differenceData = data[props.totalType];
  const headings = [...Object.keys(differenceData)];
  headings.pop(); // remove the change field data

  const tableHeadings = headings.map((h) => (
    <td key={h + "imx24"}>
      <p> {h.replaceAll('_', ' ').toUpperCase()}</p>
    </td>
  ))

  const tableContent = headings.map((h) => (
    <td key={h + "ddimx24"}>
      <p> {differenceData[h]}</p>
    </td>
  ))
  return (
    <>
      <table className="immutascan">
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
