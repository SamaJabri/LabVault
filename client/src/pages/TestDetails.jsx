import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Table from "../components/examination/Table";

import useExaminationStore from "../store/examination/examination-store";
import laboratoryInfo from "../store/laboratory/laboratory-info.json";
import useLaboratoryStore from "../store/laboratory/laboratory-store";

const TestDetails = () => {
  const { id } = useParams();

  // Cast id from String to Int for comparison
  const idToInteger = parseInt(id);

  const getASampleExaminations = useExaminationStore(
    (state) => state.getASampleExaminations
  );
  const getLabName = useLaboratoryStore((state) => state.getLabName);

  const [sampleExamination, setSampleExamination] = useState([]);
  const [labName, setLabName] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getASampleExaminations(idToInteger);
      setSampleExamination(res);

      const labRes = await getLabName(idToInteger);
      setLabName(labRes);
    };

    fetchData();
  }, []);

  const [viewType, setViewType] = useState("All");

  const showAllResults = async () => {
    setViewType("All");
    setSampleExamination(await getASampleExaminations(idToInteger));
  };

  const showNormalResults = async () => {
    setViewType("Normal");

    const res = await getASampleExaminations(idToInteger);

    setSampleExamination(() =>
      res.filter(
        ({ result, starting_normal_range, ending_normal_range }) =>
          parseFloat(result) >= parseFloat(starting_normal_range) &&
          parseFloat(result) <= parseFloat(ending_normal_range)
      )
    );
  };

  const showAbnormalResults = async () => {
    setViewType("Abnormal");

    const res = await getASampleExaminations(idToInteger);

    setSampleExamination(() =>
      res.filter(
        ({ result, starting_normal_range, ending_normal_range }) =>
          parseFloat(result) < parseFloat(starting_normal_range) ||
          parseFloat(result) > parseFloat(ending_normal_range)
      )
    );
  };

  // Get JSON data related to examination (about, low, & high values)
  const laboratoryData = laboratoryInfo.filter(
    (laboratory) =>
      laboratory.name.toUpperCase() === String(labName).toUpperCase()
  )[0];

  console.log(laboratoryData);

  return (
    <div className="test-details">
      <div className="test-details__results">
        <div className="home__filters">
          <button
            id={viewType === "All" && "active-button"}
            onClick={showAllResults}
          >
            All
          </button>
          <button
            id={viewType === "Normal" && "active-button"}
            onClick={showNormalResults}
          >
            Normal
          </button>
          <button
            id={viewType === "Abnormal" && "active-button"}
            onClick={showAbnormalResults}
          >
            Abnormal
          </button>
        </div>
        {
          <Table
            rows={["Examination", "Result", "Unit", "Reference Values"]}
            data={sampleExamination}
          />
        }
      </div>

      <div className="test-details__info">
        <h3>{laboratoryData?.name}</h3>
        <p>{laboratoryData?.about}</p>
        <h4 className="test-details__sample-type">
          Sample Type :{" "}
          {laboratoryData?.sample.map((sampleType, index) => (
            <span>
              {sampleType}
              {index === laboratoryData.sample.length - 1 ? "" : ", "}
            </span>
          ))}
        </h4>
      </div>
    </div>
  );
};

export default TestDetails;
