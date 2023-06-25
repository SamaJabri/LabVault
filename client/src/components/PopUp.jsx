import React, { useEffect, useState } from "react";

import useLaboratoryStore from "../store/laboratory/laboratory-store";
import usePatientsStore from "../store/patient/patients-store";

const PopUp = (props) => {
  const handleLabUpload = useLaboratoryStore((state) => state.handleLabUpload);
  const togglePopUp = useLaboratoryStore((state) => state.togglePopUp);
  const toggleIsLoading = usePatientsStore((state) => state.toggleIsLoading);

  const [disableSubmit, setDisableSubmit] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    // Show loading page while user is waiting
    toggleIsLoading();

    const { date, doctorName } = e.currentTarget;

    const uploadData = {
      date: date.value,
      doctor_name: doctorName.value,
      img_src: props.img,
    };

    try {
      setDisableSubmit(true);

      const res = await handleLabUpload(uploadData);

      alert("Test added successfully");
    } catch (error) {
      if (error.response.status === 422) {
        alert("You already added this test, try adding a new one");
      } else if (error.response.status === 500) {
        alert(
          "There was a problem processing some of your tests, we're sorry for the inconvenince"
        );
      } else {
        alert("Something went wrong, please try again");
      }
      console.log(error);
    }

    toggleIsLoading();
    togglePopUp();
  };

  useEffect(() => setDisableSubmit(false), []);

  return (
    <div className="pop-up__content">
      <form onSubmit={handleUpload} className="pop-up__form">
        <label htmlFor="date">Results Date</label>
        <input
          type="date"
          name="date"
          id="date"
          defaultValue={new Date().toISOString().substr(0, 10)}
          required
        />

        <label htmlFor="doctorName">Doctor name</label>
        <input type="text" name="doctorName" id="doctorName" required />

        <div className="pop-up__options">
          <button type="submit" disabled={disableSubmit}>
            Submit
          </button>
          <button type="button" onClick={togglePopUp}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PopUp;
