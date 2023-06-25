import React from "react";
import { Link } from "react-router-dom";
import Graph from "./Graph";

const ExaminationBubble = (props) => {
  return (
    <Link to={`/examination/${props.id}`}>
      <div className="examination-bubble">
        <h4>{props.name}</h4>
        <div className="examination-bubble__graph">
          <Graph
            data={props.data}
            hide="true"
            color="#ffffff"
            fontSize="0.4rem"
            leftMargin={-46}
          />
        </div>
      </div>
    </Link>
  );
};

export default ExaminationBubble;
