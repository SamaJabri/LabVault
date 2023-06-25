import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { IconButton, InputAdornment, TextField } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Logo from "../assets/Logo.png";

import usePatientsStore from "../store/patient/patients-store";

const Login2 = () => {
  const loginPatient = usePatientsStore((state) => state.loginPatient);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [warningMessage, setWarningMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await loginPatient(username, password);

    setWarningMessage(res.response?.data.msg);

    res.status === 200 && navigate("/home");
  };

  return (
    <div className="welcome">
      <div className="login">
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
              name="username"
              label="Username"
              variant="outlined"
              className="login__form__field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="login__password">
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

              <p>
                Forgot Password?{" "}
                <Link to="/" className="ternary">
                  Reset
                </Link>
              </p>
            </div>

            <input
              type="submit"
              value="Login"
              className="login__form__button"
              onClick={handleLogin}
              disabled={!(username && password)}
            />
          </div>

          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="ternary">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login2;
