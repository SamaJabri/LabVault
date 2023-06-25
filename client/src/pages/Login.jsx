import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import {
  Button,
  Container,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import Logo from "../assets/Logo.svg";
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginForm = (e) => {
    e.preventDefault();
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
          width: "22rem",
          height: "34rem",
        }}
        elevation={3}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <img src={Logo} alt="Lab Archive Logo" width="60%" />
          <Typography variant="h6" color="primary">
            MyLabDocs
          </Typography>
        </div>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "70%",
            gap: "1rem",
          }}
          onSubmit={handleLoginForm}
        >
          <TextField
            required
            name="username"
            label="Username"
            variant="outlined"
            sx={{ width: "100%" }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            /*  InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AiOutlineUser />
              </InputAdornment>
            ),
          }} */
          />

          <TextField
            required
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            variant="outlined"
            sx={{ width: "100%" }}
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
                      <AiFillEyeInvisible style={{ color: "#683636" }} />
                    ) : (
                      <AiFillEye style={{ color: "#683636" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <div>
            <Typography variant="body1" color="secondary">
              Forgot Password?{" "}
              <Link to="/" style={{ color: "#CF7C7C", textDecoration: "none" }}>
                Reset
              </Link>
            </Typography>
          </div>

          <Button
            disabled={!(username && password)}
            type="submit"
            variant="contained"
            sx={{ marginTop: "2rem", width: "70%" }}
          >
            Login
          </Button>
        </form>

        <div>
          <Typography variant="body1" color="secondary">
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{ color: "#CF7C7C", textDecoration: "none" }}
            >
              Sign Up
            </Link>
          </Typography>
        </div>
      </Paper>
    </Container>
  );
};

export default Login;
