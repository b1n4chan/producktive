import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "./firebase";
import "./Register.css";
import { Typography, Button, TextField, Paper } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const register = () => {
    if (!name) alert("Please enter name");
    registerWithEmailAndPassword(name, email, password);
  };

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <div className="register">
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
        <h1>REGISTER</h1>
        <TextField
          id="outlined-basic"
          label="Full Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          onClick={register}
        >
          Register
        </Button>
        <Button
          variant="contained"
          endIcon={<GoogleIcon />}
          style={{
            padding: "10px",
            marginBottom: "10px",
          }}
          onClick={signInWithGoogle}
        >
          Register with Google
        </Button>
        <Typography>
          Already have an account? <Link to="/">Login</Link> now.
        </Typography>
      </Paper>
    </div>
  );
}

export default Register;
