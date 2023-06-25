import React from "react";

const Filters = (props) => {
  return (
    <form className={props.className} onSubmit={props.onSubmit}>
      <h3>Filters</h3>
      <input type="number" placeholder="Month" name="month" />

      <input type="number" placeholder="Year" name="year" />

      <label for="doctor">Doctor Name</label>
      <select id="doctor" name="doctorName">
        <option value="" selected>
          Choose
        </option>
        {props.doctorsList.map((doctor) => (
          <option value={doctor}>{doctor}</option>
        ))}
      </select>

      <label for="laboratory">Laboratory</label>
      <select id="laboratory" name="labName">
        <option value="" selected>
          Choose
        </option>
        {props.labsList.map((lab) => (
          <option value={lab}>{lab}</option>
        ))}
      </select>

      <button type="submit" className="labs__filter-confirm">
        Apply filters
      </button>
    </form>
  );
};

export default Filters;
