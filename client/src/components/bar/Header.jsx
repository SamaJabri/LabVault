import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import Logo from "../../assets/Logo.png";
import LogoDarkMode from "../../assets/LogoDarkMode.png";

import useExaminationStore from "../../store/examination/examination-store.js";
import useLaboratoryStore from "../../store/laboratory/laboratory-store";
import usePatientsStore from "../../store/patient/patients-store";

import Avatar from "../Avatar";
import Search from "../Search";
import Icon from "../Icon";

const Header = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  // Cast id from String to Int for comparison
  const idToInteger = parseInt(id);

  const { pathname } = useLocation();

  const [isInExamPage, setIsInExamPage] = useState(
    pathname.includes("examination") ? true : false
  );

  const [isInLabPage, setIsInLabPage] = useState(
    pathname.includes("tests/") ? true : false
  );

  // Info needed in header
  // Exam name & isFavorite --> Examination page
  // Lab name --> TestDetails Page
  const [examinationName, setExaminationName] = useState("");
  const [isExamFavorite, setIsExamFavorite] = useState();
  const [LabName, setLabName] = useState();

  // Info needed for header in an exmaination page
  const toggleIsFavoriteExamination = useExaminationStore(
    (state) => state.toggleIsFavoriteExamination
  );
  const getCurrentPatientExaminations = useExaminationStore(
    (state) => state.getCurrentPatientExaminations
  );

  const getLabName = useLaboratoryStore((state) => state.getLabName);

  // Dark mode value and toggler
  const darkMode = usePatientsStore((state) => state.darkMode);
  const toggleDarkMode = usePatientsStore((state) => state.toggleDarkMode);

  useEffect(() => {
    const determinePath = async () => {
      if (pathname.includes("examination")) {
        setIsInExamPage(true);

        // This is to get the name & is_favorite properties about
        // the current examination because they're shown in the header
        const res = await getCurrentPatientExaminations();

        const [{ name, is_favorite: isFavorite }] = res.filter(
          (examination) => examination.id === idToInteger
        );

        setIsExamFavorite(isFavorite);
        setExaminationName(name);
      } else if (pathname.includes("tests/")) {
        setIsInLabPage(true);

        const res = await getLabName(idToInteger);

        setLabName(res);
      } else {
        setIsInExamPage(false);
        setIsInLabPage(false);
      }
    };

    determinePath();
  }, [isExamFavorite, isInExamPage, id]);

  const toggleIsFavorite = async (e) => {
    e.preventDefault();

    setIsExamFavorite((isExamFavorite) => !isExamFavorite);

    await toggleIsFavoriteExamination(idToInteger, !isExamFavorite);
  };

  const goToPreviousPage = (e) => {
    e.preventDefault();

    navigate(-1);
  };

  return (
    <div className="header">
      <div
        className={`header__content ${
          isInExamPage ? "header__content--exam" : ""
        }`}
      >
        {isInExamPage ? (
          <>
            <div className="header__exam-name">
              <Icon iconName="AiOutlineLeft" onClick={goToPreviousPage} />
              <h2>{examinationName}</h2>
            </div>

            <button className="header__favorite" onClick={toggleIsFavorite}>
              {isExamFavorite ? (
                <Icon iconName="AiFillHeart" />
              ) : (
                <Icon iconName="AiOutlineHeart" />
              )}
              <span className="header__favorite-text">
                {isExamFavorite ? "Remove from favorites" : "Add to favorites"}
              </span>
            </button>
          </>
        ) : isInLabPage ? (
          <>
            <div className="header__exam-name">
              <Icon iconName="AiOutlineLeft" onClick={goToPreviousPage} />
              <h2>{LabName}</h2>
            </div>
          </>
        ) : (
          <>
            <div className="header__logo-search">
              <Link to="/home">
                <img
                  src={darkMode ? LogoDarkMode : Logo}
                  alt="Logo"
                  className="header__logo"
                />
              </Link>
              <Search />
            </div>

            <div className="header__avatar-switch">
              <Link to="/tests">
                <button className="header__tests-button">
                  <Icon iconName="AiTwotoneExperiment" />
                  My Tests
                </button>
              </Link>

              <div className="toggleWrapper">
                <input
                  type="checkbox"
                  className="dn"
                  id="dn"
                  checked={!darkMode}
                  onChange={toggleDarkMode}
                />
                <label htmlFor="dn" className="toggle">
                  <span className="toggle__handler">
                    <span className="crater crater--1"></span>
                    <span className="crater crater--2"></span>
                    <span className="crater crater--3"></span>
                  </span>
                  <span className="star star--1"></span>
                  <span className="star star--2"></span>
                  <span className="star star--3"></span>
                  <span className="star star--4"></span>
                  <span className="star star--5"></span>
                  <span className="star star--6"></span>
                </label>
              </div>

              <Avatar place="header" />
            </div>
          </>
        )}
      </div>

      <hr className="header__seperator" />
    </div>
  );
};

export default Header;
