import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";
//material ui stuff
import { Typography, Button, Box, TextField, Paper } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <div className="login">
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          backgroundColor: "white",
          padding: "35px",
        }}
      >
        <h1>WELCOME!</h1>
        <TextField
          id="outlined-basic"
          label="E-mail Address"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          style={{
            color: "white",
            backgroundColor: "black",
            padding: "10px",
            marginTop: "20px",
            marginBottom: "10px",
          }}
          //className="login__btn"
          onClick={() => logInWithEmailAndPassword(email, password)}
        >
          Login
        </Button>
        <Button
          variant="contained"
          endIcon={<GoogleIcon />}
          style={{
            padding: "10px",
            marginBottom: "10px",
          }}
          //className="login__btn login__google"
          onClick={signInWithGoogle}
        >
          Login with Google
        </Button>
        <Typography>
          <Link to="/reset">Forgot Password</Link>
        </Typography>
        <Typography marginTop="7px">
          Don't have an account? Register <Link to="/register">here</Link>.
        </Typography>
      </Paper>
    </div>
  );
}

export default Login;
