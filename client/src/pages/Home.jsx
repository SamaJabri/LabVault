import React, { useEffect, useState } from "react";

import useExaminationStore from "../store/examination/examination-store";
import { examinationVariables } from "../assets/utility-functions";

import ExaminationBubble from "../components/examination/ExaminationBubble";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";

const Home = () => {
  const getCurrentPatientExaminations = useExaminationStore(
    (state) => state.getCurrentPatientExaminations
  );
  const filterUniqueExaminations = useExaminationStore(
    (state) => state.filterUniqueExaminations
  );
  const filteredExaminations = useExaminationStore(
    (state) => state.filteredExaminations
  );
  const getFavorites = useExaminationStore((state) => state.getFavorites);

  const [viewType, setViewType] = useState("All");

  //examinationVariables(getCurrentPatientExaminations());
  getCurrentPatientExaminations().then((data) => examinationVariables(data));

  useEffect(() => {
    const fetchData = async () => {
      await filterUniqueExaminations(viewType);
      await getFavorites();
    };

    fetchData();
  }, [viewType]);

  return (
    <div className="home">
      <div className="home__header">
        <h2>Your Health</h2>

        <div className="home__add-test">
          <Link to="/add">
            <button>Add a test</button>
          </Link>
        </div>

        <div className="home__filters">
          <button
            id={viewType === "All" && "active-button"}
            onClick={() => setViewType("All")}
          >
            All
          </button>
          <button
            id={viewType === "Normal" && "active-button"}
            onClick={() => setViewType("Normal")}
          >
            Normal
          </button>
          <button
            id={viewType === "Abnormal" && "active-button"}
            onClick={() => setViewType("Abnormal")}
          >
            Abnormal
          </button>
          <button
            className="home__filters-favorite"
            id={viewType === "Favorites" && "active-button"}
            onClick={() => setViewType("Favorites")}
          >
            Favorites
          </button>
        </div>
      </div>
      <div className="home__exams">
        {filteredExaminations.length > 0 ? (
          filteredExaminations.map(({ id, name }) => (
            <ExaminationBubble
              key={id}
              data={window[name]}
              name={name}
              id={id}
            />
          ))
        ) : viewType !== "Favorites" ? (
          <div className="home__directions">
            <p>
              You haven't added any tests yet, click here to add you first test
            </p>
            <Icon iconName="AiOutlineArrowDown" />
          </div>
        ) : (
          <p>
            You haven't added any favorites yet
            <br />
            Click 'All' to see you tests and add to favorites
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
