import React from "react";
import * as FontAwsome from "react-icons/ai";
import * as FontAwsomeGi from "react-icons/gi";
import { Link } from "react-router-dom";

const Icon = (props) => {
  const icon = React.createElement(
    props.iconName[0] === "A"
      ? FontAwsome[props.iconName]
      : FontAwsomeGi[props.iconName]
  );

  return (
    <Link
      to={props.link}
      className="icon"
      onClick={props.onClick}
      ref={props.ref}
      title={props.title}
    >
      {icon}
    </Link>
  );
};

export default Icon;
