import React from "react";
import Icon from "./Icon";

const TableOrderedColumn = (props) => {
  return (
    <div>
      <p>{props.name}</p>
      <Icon iconName="AiOutlineSwap" onClick={props.onClick} />
    </div>
  );
};

export default TableOrderedColumn;
