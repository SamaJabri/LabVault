import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import TableOrderedColumn from "../TableOrderedColumn";

const Table = (props) => {
  // Table in Examination & TestsDetails page have differences
  const { pathname } = useLocation();

  const [data, setData] = useState(props.data);
  const [ascending, setAscending] = useState(true);

  // Toggle between ordering in ascending & descending order
  const toggleAscending = () => setAscending((asc) => !asc);

  // Ordering functions (By date & By test result)
  const orderByDate = (e) => {
    e.preventDefault();

    toggleAscending();

    setData(
      data.sort((result1, result2) =>
        ascending
          ? new Date(result2.date) - new Date(result1.date)
          : new Date(result1.date) - new Date(result2.date)
      )
    );
  };

  const orderByResult = (e) => {
    e.preventDefault();

    toggleAscending();

    setData(
      data.sort((result1, result2) =>
        ascending
          ? result2.result - result1.result
          : result1.result - result2.result
      )
    );
  };

  // Call the correct order function. When adding a new table ordering function
  // must be written here + a condition to call it.
  const orderFunction = (e, rowName) => {
    if (rowName === "Date") {
      orderByDate(e);
    } else {
      orderByResult(e);
    }
  };

  useEffect(() => {
    if (pathname.includes("/examination")) {
      const formattedData = data.map((item, index) => ({
        ...item,
        date: new Date(props.data[index].date).toLocaleDateString(),
      }));

      setData(formattedData);
    } else {
      setData(props.data);
    }
  }, [props.data]);

  return (
    <table className="table">
      <thead className="table__head">
        <tr>
          {props.rows.map((row, index) => (
            <th key={index}>
              {props.orderedRows?.includes(index) ? (
                <TableOrderedColumn
                  name={row}
                  onClick={(e) => orderFunction(e, row)}
                />
              ) : (
                row
              )}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="table__body">
        {data?.map(
          ({
            id,
            date,
            name,
            result,
            unit,
            starting_normal_range,
            ending_normal_range,
          }) => (
            <tr key={id}>
              <td>{props.rows[0] === "Date" ? date : name}</td>
              <td>{result}</td>
              <td>{unit}</td>
              <td>
                {starting_normal_range} - {ending_normal_range}
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

export default Table;
