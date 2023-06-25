import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import useExaminationStore from "../store/examination/examination-store";
import usePatientsStore from "../store/patient/patients-store";
import examinationInfo from "../store/examination/examinations-info.json";
import {
  examinationVariables,
  getExaminationData,
} from "../assets/utility-functions";

import ExaminationInfo from "../components/examination/ExaminationInfo";
import Graph from "../components/examination/Graph";
import Table from "../components/examination/Table";

const Examination = () => {
  const { id } = useParams();

  const [viewType, setViewType] = useState("Graph");

  // Get current mode to decide graph color
  const darkMode = usePatientsStore((state) => state.darkMode);

  const getCurrentPatientExaminations = useExaminationStore(
    (state) => state.getCurrentPatientExaminations
  );

  const getExamination = useExaminationStore((state) => state.getExamination);

  const [examinationName, setExaminationName] = useState({});

  const [examinations, setExaminations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const examinations = await getCurrentPatientExaminations();
      const examination = await getExamination(Number(id));

      setExaminations(examinations);
      setExaminationName(examination.name);
    };

    fetchData();
  }, []);

  // Get data for table view
  const tableViewInfo = getExaminationData(examinations, examinationName);

  // Get JSON data related to examination (about, low, & high values)
  const examinationData = examinationInfo.filter(
    (examination) =>
      examination.name.toUpperCase() === String(examinationName).toUpperCase()
  )[0];

  examinationVariables(examinations);

  return (
    <div className="examination">
      <div className="examination__visualization">
        <div className="examination__view-options">
          <button
            onClick={() => setViewType("Graph")}
            id={viewType === "Graph" && "active-button"}
          >
            Graph
          </button>
          <button
            onClick={() => setViewType("Table")}
            id={viewType === "Table" && "active-button"}
          >
            Table
          </button>
        </div>

        <div
          className="examination__view"
          style={{
            height: `${viewType === "Table" ? "auto" : "18rem"}`,
          }}
        >
          {viewType === "Graph" ? (
            <Graph
              data={window[examinationName]}
              color={darkMode ? "white" : "#218d87"}
              leftMargin={-26}
            />
          ) : (
            <Table
              rows={["Date", "Result", "Unit", "Reference Values"]}
              orderedRows={[0, 1]}
              data={tableViewInfo}
            />
          )}
        </div>
      </div>

      <div className="examination__infoContainer">
        <div className="examination__info">
          <ExaminationInfo
            title={`About ${examinationName}`}
            explaination={examinationData?.about}
          />
          <ExaminationInfo
            title="Less than normal"
            explaination={examinationData?.low}
          />
          <ExaminationInfo
            title="Higher than normal"
            explaination={examinationData?.high}
          />
        </div>
        <div className="examination__warning">
          <p>
            Info provided here is not for medical reference, contact your health
            care provider
          </p>
        </div>
      </div>
    </div>
  );
};

export default Examination;
