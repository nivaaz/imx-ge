/**
 * 
 * @param {{data: [object], tableType: 'immutascan'}} props 
 * @returns 
 */
const PrintTable = (props) => {
  const { data, tableType, dontShowBlockchain } = props;

  let headings = [...Object.keys(data[0])]
  if (dontShowBlockchain){
    headings = headings.filter(h=> h.toLowerCase() !== 'blockchain')
  }
  const tableData = data.map((d) => {
    return (
      <tr key={d + tableType}>
        {headings.map((h) => (
          <td key={tableType + d+h}> <p>  {d[h]}</p></td>
        ))}
      </tr>
    );
  });

  return (
    <table className={tableType}>
      <tbody>
        <tr className="tableHeading">
          {headings.map((h, index) => (
            <td key={h + String(tableData[index]) + index + tableType}> <p>  {h.toUpperCase()}</p> </td>
          ))}
        </tr>
        {tableData}
      </tbody>
    </table>
  );
};

export default PrintTable;
