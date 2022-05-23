import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { Typography, Button, TextField, Paper } from "@mui/material";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();

      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    fetchUserName();
  }, [user, loading]);

  return (
    <div className="dashboard">
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
        <Typography variant="h6" gutterBottom component="div">
          Logged in as
        </Typography>
        <Typography>{name}</Typography>
        <Typography>{user?.email}</Typography>
        <Button
          variant="contained"
          style={{
            color: "white",
            backgroundColor: "black",
            padding: "10px",
            marginTop: "20px",
            marginBottom: "10px",
          }}
          onClick={logout}
        >
          Logout
        </Button>
      </Paper>
    </div>
  );
}

export default Dashboard;
