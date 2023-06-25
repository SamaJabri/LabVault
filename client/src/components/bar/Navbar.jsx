import React, { useEffect, useRef, useState } from "react";

import Icon from "../Icon";
import Search from "../Search";

const Navbar = () => {
  const searchBarRef = useRef();
  const searchIconRef = useRef();

  const [showSearch, setShowSearch] = useState(false);

  /*   const handleDocumentClick = (e) => {
    if (
      searchBarRef.current &&
      !searchBarRef.current.contains(e.target) &&
      e.target !== searchBarRef.current
    ) {
      setShowSearch(false);
    }
  }; */

  const toggleSearchBar = () => {
    setShowSearch(!showSearch);
  };

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(e.target) &&
        !e.target.closest(".icon")
      ) {
        setShowSearch(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  return (
    <div className="navbar">
      <Icon iconName="AiOutlineHome" link="/home" />
      <Icon
        iconName="AiOutlineSearch"
        onClick={toggleSearchBar}
        iconRef={searchIconRef}
      />
      <Icon iconName="AiOutlinePlusCircle" link="/add" />
      <Icon iconName="AiTwotoneExperiment" link="/tests" />
      <Icon iconName="AiOutlineHeart" link="/favorites" />{" "}
      {showSearch && <Search searchBarRef={searchBarRef} />}
    </div>
  );
};

export default Navbar;
