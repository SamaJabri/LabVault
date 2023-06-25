import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import usePatientsStore from "../store/patient/patients-store";
import { motion } from "framer-motion";
import Icon from "./Icon";

const Avatar = (props) => {
  const navigate = useNavigate();

  const userSettingRef = useRef();
  const userAvatarRef = useRef();

  const [userSettings, setUserSettings] = useState(false);

  const currentPatient = usePatientsStore((state) => state.currentPatient);
  const logOutPatient = usePatientsStore((state) => state.logOutPatient);

  const toggleUserSettings = () => setUserSettings(!userSettings);

  const handleLogOut = (e) => {
    e.preventDefault();

    logOutPatient(currentPatient.id);

    navigate("/login");
  };

  /*  useEffect(() => {
    const handleDocumentClick = (e) => {
      //console.log(e.target);
      //console.log(userSettingRef.current);
      if (
        userSettingRef.current &&
        !userSettingRef.current.contains(e.target) &&
        e.target !== userAvatarRef.current
      ) {
        setUserSettings(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);
 */
  return (
    <div
      className={`${props.place}__user-avatar`}
      onClick={toggleUserSettings}
      ref={userAvatarRef}
    >
      {currentPatient.img_src !== "" ? (
        <img src={currentPatient.img_src} alt={currentPatient.username} />
      ) : (
        <p>{currentPatient.name[0] + currentPatient.surname[0]}</p>
      )}

      {userSettings && (
        <div className="user-setting" ref={userSettingRef}>
          <Link to={`/profile/${currentPatient.id}`}>
            <button>My Profile</button>
          </Link>

          <hr />

          <Link to="/tests" className="user-setting__tests">
            <button>My Tests</button>
          </Link>

          <hr className="user-setting__tests-separator" />

          <Link onClick={handleLogOut}>
            <button>Log Out</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Avatar;
