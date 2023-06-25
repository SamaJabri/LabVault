import React, { useState, useEffect } from "react";

import { IconButton, InputAdornment, TextField } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Logo from "../assets/Logo.png";

import { Link, useNavigate } from "react-router-dom";
import usePatientsStore from "../store/patient/patients-store";

const SignUp = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [warningMessage, setWarningMessage] = useState("");

  // Store variables & functions
  //const patients = usePatientsStore((state) => state.patients);
  const createAndLoginPatient = usePatientsStore(
    (state) => state.createAndLoginPatient
  );

  const navigate = useNavigate();

  /* const isUsernameTaken = patients.find(
    (patient) => patient.username === username
  );

  const doesPasswordMatch = patients.find(
    (patient) => patient.password === password
  ); */

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      const newPatient = {
        tc: null,
        name: name,
        surname: surname,
        gender: "",
        email: "",
        username: username,
        password: password,
        age: null,
        weight: null,
        height: null,
        img_src: "",
        birthday: null,
      };

      const res = await createAndLoginPatient(newPatient);

      if (res.response?.status === 409) {
        setWarningMessage("User already exists, try a different one!");
      } else {
        setWarningMessage("");

        res.status === 201 && navigate("/home");
      }
    } else {
      setWarningMessage("Passwords don't match");
    }

    /* if (isUsernameTaken) {
      if (doesPasswordMatch) {
        setWarningMessage("Username already exist, try loging in");
      } else {
        setWarningMessage("Username taken, try a different one");
      }
    } else {
      if (password === confirmPassword) {
        const newPatient = {
          id: nanoid(),
          tc: null,
          name: name,
          surname: surname,
          gender: "",
          email: "",
          username: username,
          password: password,
          age: null,
          weight: null,
          height: null,
          img_src: "",
        };

        createAndLoginPatient(newPatient);

        navigate("/home");
      } else {
        setWarningMessage("Passwords don't match");
      }
    } */
  };

  return (
    <div className="welcome welcome--sign-up">
      <div className="login sign-up">
        <div className="login__header">
          <img src={Logo} alt="MyLabDocs Logo" />
          <h3>Your Health Insights in One Place!</h3>
          <p>
            Archive and manage your lab test results and documents with ease.
            Get valuable visual insights into your health journey. Simply upload
            your tests and discover a user-friendly way to track and understand
            your health.
            <br />
            <br />
            Join LabVault today and unlock the power of your test results!
          </p>
        </div>

        <div className="login__form-container">
          <div className="login__form">
            <AnimatePresence>
              <motion.div
                className={warningMessage ? "warning-message" : ""}
                initial={{ scale: 0 }}
                animate={{ scale: 0.9 }}
                exit={{ scale: 0 }}
                whileTap={{ scale: 0.7 }}
                transition={{
                  type: "spring",
                  bounce: 0.5,
                  duration: 1,
                }}
              >
                {warningMessage}
              </motion.div>
            </AnimatePresence>

            <TextField
              required
              name="name"
              label="Name"
              variant="outlined"
              className="login__form__field"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              required
              name="surname"
              label="Surname"
              variant="outlined"
              className="login__form__field"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />

            <TextField
              required
              name="username"
              label="Username"
              variant="outlined"
              className="login__form__field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              required
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              variant="outlined"
              className="login__form__field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                    >
                      {showPassword ? (
                        <AiFillEyeInvisible style={{ color: "#218d87" }} />
                      ) : (
                        <AiFillEye style={{ color: "#218d87" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              required
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="password"
              variant="outlined"
              className="login__form__field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowConfirmPassword((show) => !show)}
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <AiFillEyeInvisible style={{ color: "#218d87" }} />
                      ) : (
                        <AiFillEye style={{ color: "#218d87" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <input
              type="submit"
              value="Sign Up"
              className="login__form__button login__form__button--sign-up"
              onClick={handleSignUp}
              disabled={
                !(name && surname && username && password && confirmPassword)
              }
            />
          </div>

          <p>
            Already have an account?{" "}
            <Link to="/login" className="ternary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
