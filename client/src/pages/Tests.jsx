import React, { useState, useEffect } from "react";

import { removeDuplicates } from "../assets/utility-functions";

import useLaboratoryStore from "../store/laboratory/laboratory-store";

import LabTest from "../components/LabTest";
import Icon from "../components/Icon";
import Filters from "../components/Filters";

const Tests = () => {
  // Store variables & functions
  const getFinalData = useLaboratoryStore((state) => state.getFinalData);
  const patientsLabs = useLaboratoryStore((state) => state.patientsLabs);
  const handleFilter = useLaboratoryStore((state) => state.handleFilter);

  /*   const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState(""); */

  const [filterSelection, setFilterSelection] = useState(false);
  const [appliedFiltersList, setAppliedFiltersList] = useState({});

  const [doctorsList, setDoctorsList] = useState(
    patientsLabs.map(({ doctorName }) => doctorName)
  );
  const [labsList, setLabsList] = useState([]);

  const toggleFilterSelection = () => setFilterSelection(!filterSelection);

  /*   // Selected month converted to String for comparison
  const filterByMonth = (e) => {
    const month = e.target.value;
    const selectedMonth = String(month);

    setMonthFilter(month);

    handleFilter(selectedMonth, yearFilter, selectedMonth);
  };

  // Selected year converted to String for comparison
  const filterByYear = (e) => {
    const year = e.target.value;
    const selectedYear = String(year);

    setYearFilter(year);

    handleFilter(selectedYear, selectedYear, monthFilter);
  };
 */
  const handleFilterSelection = (e) => {
    e.preventDefault();

    const { month, year, doctorName, labName } = e.target.elements;

    setAppliedFiltersList({
      year: year.value,
      month: month.value,
      doctorName: doctorName.value,
      labName: labName.value,
    });

    handleFilter(year.value, month.value, doctorName.value, labName.value);

    toggleFilterSelection();
  };

  const removeFilter = (selectedFilter) => {
    const updatedFiltersList = Object.entries(appliedFiltersList).map(
      ([key, value]) => {
        return [key, value === selectedFilter ? "" : value];
      }
    );

    setAppliedFiltersList(Object.fromEntries(updatedFiltersList));

    const { year, month, doctorName, labName } =
      Object.fromEntries(updatedFiltersList);

    handleFilter(year, month, doctorName, labName);
  };

  useEffect(() => {
    getFinalData();

    setDoctorsList(
      removeDuplicates(patientsLabs.map(({ doctor_name }) => doctor_name))
    );

    setLabsList(removeDuplicates(patientsLabs.map(({ lab_name }) => lab_name)));
  }, []);

  return (
    <div className="labs">
      <h2>Your Labs</h2>
      <div className="labs__filter">
        <div className="labs__filter-container" onClick={toggleFilterSelection}>
          <Icon iconName="AiOutlineFilter" />
          <button className="labs__filter-button">Filter</button>
        </div>

        {filterSelection && (
          <Filters
            className="labs__filter-selection"
            onSubmit={handleFilterSelection}
            doctorsList={doctorsList}
            labsList={labsList}
          />
        )}
        <Filters
          className="labs__filter-desktop"
          onSubmit={handleFilterSelection}
          doctorsList={doctorsList}
          labsList={labsList}
        />
      </div>

      <div className="labs__applied-filters">
        {Object.values(appliedFiltersList).map(
          (filter) =>
            filter.length > 0 && (
              <button className="labs__applied-filters-item">
                {filter}
                <span
                  className="labs__applied-filters-delete"
                  onClick={() => removeFilter(filter)}
                >
                  x
                </span>
              </button>
            )
        )}
      </div>

      <div className="labs__list">
        {patientsLabs.length > 0 ? (
          patientsLabs.map(
            ({ id, doctor_name, expert_approval_time, lab_name }) => {
              const toDate = new Date(expert_approval_time).toDateString();

              const month = toDate.split(" ")[1];
              const year = toDate.split(" ")[3];

              return (
                <LabTest
                  key={id}
                  id={id}
                  doctorName={`${doctor_name}`}
                  labName={lab_name}
                  month={month}
                  year={year}
                />
              );
            }
          )
        ) : (
          <p className="labs__no-list">No tests found...</p>
        )}
      </div>
    </div>
  );
};

export default Tests;
