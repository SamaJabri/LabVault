import React from "react";
import { Link } from "react-router-dom";

const LabTest = (props) => {
  return (
    <Link to={`${props.id}`} className="lab-test">
      <div className="lab-test__date">
        <h4>{props.month}</h4>
        <h4>{props.year} </h4>
      </div>

      <div className="lab-test__info">
        <h3>{props.labName}</h3>
        <p>Dr. {props.doctorName}</p>
      </div>
    </Link>
  );
};

export default LabTest;
