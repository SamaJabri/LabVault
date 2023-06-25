import { Navigate } from "react-router-dom";
import App from "../App";

import usePatientsStore from "../store/patient/patients-store";

const ProtectedRoute = () => {
  const currentPatient = usePatientsStore((state) => state.currentPatient);

  return currentPatient ? <App /> : <Navigate to="login" />;
};

export default ProtectedRoute;
