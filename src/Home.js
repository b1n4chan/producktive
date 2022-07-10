import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { auth, db, logout } from "./firebase";
import {
  query,
  collection,
  getDocs,
  getDoc,
  where,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { styled, useTheme } from "@mui/material/styles";
import {
  Typography,
  Button,
  TextField,
  Paper,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";

function Home() {
  const [user, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();

      setName(data.name);
      setProjects(data.projects);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    //if (loading) return;
    if (!user) return navigate("/");
    fetchProjects();
  }, [user]);

  const addProject = async (projectName) => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      await updateDoc(washingtonRef, {
        regions: arrayUnion(projectName),
      });
      this.toggleEditingTitle();
    } catch (error) {
      console.log(error);
      alert("List could not be updated");
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toHome = () => {
    navigate("/dashboard");
  };

  return (
    <div className="home">
      <AppBar
        position="absolute"
        sx={{ backgroundColor: "#ffbd59", color: "#694729" }}
      >
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ marginLeft: "20px" }}
          >
            Producktive
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <IconButton
              onClick={handleMenu}
              sx={{ p: 1, position: "absolute", top: 3, right: 15 }}
            >
              <Avatar
                alt={name}
                src={user?.photoURL}
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleMenu}
              />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyItems: "flex-start",
          p: 3,
          marginTop: 8,
          bgcolor: "background.paper",
        }}
      >
        {projects.length != 0 ? (
          <div>
            {projects.map((project) => (
              <Button
                variant="contained"
                sx={{
                  width: "250px",
                  height: "150px",
                  background: "#fff6e5",
                  color: "black",
                  ":hover": { backgroundColor: "#faefd9" },
                }}
              >
                {project}
              </Button>
            ))}
          </div>
        ) : (
          <div>
            <Button
              variant="contained"
              sx={{
                width: "250px",
                height: "150px",
                background: "#fff6e5",
                color: "black",
                ":hover": { backgroundColor: "#faefd9" },
              }}
            >
              Add a project
            </Button>
          </div>
        )}
      </Box>
    </div>
  );
}

export default Home;
