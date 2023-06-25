import React, { useEffect } from "react";

import useExaminationStore from "../store/examination/examination-store";
import { examinationVariables } from "../assets/utility-functions";

import ExaminationBubble from "../components/examination/ExaminationBubble";

const Favorites = () => {
  const getCurrentPatientExaminations = useExaminationStore(
    (state) => state.getCurrentPatientExaminations
  );
  const favoriteExaminations = useExaminationStore(
    (state) => state.favoriteExaminations
  );
  const getFavorites = useExaminationStore((state) => state.getFavorites);

  useEffect(() => {
    getFavorites();
  }, []);

  getCurrentPatientExaminations().then((data) => examinationVariables(data));

  return (
    <div className="home">
      <div className="home__header">
        <h2>Your Favorites</h2>
      </div>
      <div className="home__exams">
        {favoriteExaminations.length > 0 ? (
          favoriteExaminations.map(({ id, name }) => (
            <ExaminationBubble
              key={id}
              data={window[name]}
              name={name}
              id={id}
            />
          ))
        ) : (
          <p>
            You haven't added any favorites yet
            <br />
            Go to home page to add
          </p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
