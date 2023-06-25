import React from "react";

const ExaminationInfo = (props) => {
  return (
    <div>
      <h3>{props.title}</h3>
      <p>
        {props.explaination?.length > 1
          ? props.explaination.map((description, index) => {
              if (typeof description === "string") {
                return (
                  <ul key={index}>
                    <li>{description}</li>
                  </ul>
                );
              } else {
                return (
                  <ul key={index}>
                    <li>
                      {Object.keys(description)}
                      {Object.values(description)[0].map(
                        (expandedDescription) => (
                          <ul>
                            <li>{expandedDescription}</li>
                          </ul>
                        )
                      )}
                    </li>
                  </ul>
                );
              }
            })
          : props.explaination}
      </p>
    </div>
  );
};

export default ExaminationInfo;
