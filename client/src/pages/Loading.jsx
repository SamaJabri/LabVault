import React from "react";

import usePatientsStore from "../store/patient/patients-store";

import TestTube from "../assets/TestTube.svg";
import TestTubeDark from "../assets/TestTubeDark.svg";

const Loading = () => {
  const isDark = usePatientsStore((state) => state.darkMode);

  return (
    <div className="loading">
      <img src={isDark ? TestTubeDark : TestTube} />
      <h2>
        Preparing your results... <br /> Please wait
      </h2>
    </div>
  );
};

export default Loading;
