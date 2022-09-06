const PrintTable = (props) => {
  const { data, tableType } = props;

  const headings = [...Object.keys(data[0])]

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
