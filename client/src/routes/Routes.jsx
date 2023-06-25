import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import AddTest from "../pages/AddTest";
import Examination from "../pages/Examination";
import Favorites from "../pages/Favorites";
import Profile from "../pages/Profile";
import BMI from "../components/BMI";
import Tests from "../pages/Tests";
import TestDetails from "../pages/TestDetails";
import Loading from "../pages/Loading";
import NotFound from "../pages/NotFound";
import Login2 from "../pages/Login2";
import SignUp from "../pages/SignUp";

import ProtectedRoute from "./ProtectedRoute";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,

    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "add",
        element: <AddTest />,
      },
      {
        path: "profile/:id",
        element: <Profile />,
      },
      {
        path: "bmi",
        element: <BMI />,
      },
      {
        path: "tests",
        element: <Tests />,
      },
      {
        path: "tests/:id",
        element: <TestDetails />,
      },
      {
        path: "examination/:id",
        element: <Examination />,
      },
      {
        path: "favorites",
        element: <Favorites />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login2 />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);

export default Routes;
