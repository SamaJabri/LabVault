import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import useExaminationStore from "../store/examination/examination-store";
import useLaboratoryStore from "../store/laboratory/laboratory-store";

import Icon from "./Icon";

const Search = (props) => {
  // Get path to know what info to search
  const { pathname } = useLocation();

  const [searchValue, setSearchValue] = useState("");

  // Search functions for different pages
  const homePageSearch = useExaminationStore((state) => state.homePageSearch);
  const favoritesPageSearch = useExaminationStore(
    (state) => state.favoritesPageSearch
  );
  const TestsPageSearch = useLaboratoryStore((state) => state.TestsPageSearch);

  const [isInHomePage, setIsInHomePage] = useState(pathname.includes("home"));
  const [isInLabsPage, setIsInLabsPage] = useState(pathname.includes("tests"));
  const [isInFavoritesPage, setIsInFavoritesPage] = useState(
    pathname.includes("favorites")
  );

  const handleSearch = () => {
    if (isInHomePage) {
      homePageSearch(searchValue);
    } else if (isInFavoritesPage) {
      favoritesPageSearch(searchValue);
    } else if (isInLabsPage) {
      TestsPageSearch(searchValue);
    }
  };

  useEffect(() => {
    setIsInFavoritesPage(pathname.includes("favorites"));
    setIsInHomePage(pathname.includes("home"));
    setIsInLabsPage(pathname.includes("tests"));

    handleSearch();
  }, [searchValue]);

  return (
    <div className="search" ref={props.searchBarRef}>
      <Icon iconName="AiOutlineSearch" onClick={handleSearch} />
      <input
        placeholder="Search"
        type="search"
        className="search__field"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  );
};

export default Search;
