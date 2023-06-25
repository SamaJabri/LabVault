import { Outlet } from "react-router-dom";

import usePatientsStore from "./store/patient/patients-store";

import "./App.css";

import Header from "./components/bar/Header";
import Navbar from "./components/bar/Navbar";
import Loading from "./pages/Loading";

function App() {
  const darkMode = usePatientsStore((state) => state.darkMode);
  const isLoading = usePatientsStore((state) => state.isLoading);

  return (
    <div className={darkMode ? "dark" : ""}>
      <Header />
      <div style={{ marginTop: "4rem", paddingBottom: "4rem" }}>
        {isLoading ? <Loading /> : <Outlet />}
      </div>
      <Navbar />
    </div>
  );
}

export default App;
