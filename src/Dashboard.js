import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import {
  query,
  collection,
  getDocs,
  getDoc,
  where,
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { styled, useTheme } from "@mui/material/styles";
import {
  Typography,
  TextField,
  Paper,
  Button,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Drawer,
  CssBaseline,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  DialogActions,
  getToolbarUtilityClass,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import NotesIcon from "@mui/icons-material/Notes";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MuiAppBar from "@mui/material/AppBar";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { isDate } from "date-fns";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

//below for select project page
function FormDialog({ open, handleCancel }) {
  const [user] = useAuthState(auth);
  const [newProject, setNewProject] = useState("");
  const addProject = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const d = await getDocs(q);
      const id = d.docs[0].id;
      const ref = doc(db, "users", id);
      await updateDoc(ref, {
        projects: arrayUnion(newProject),
      });
      handleCancel();
    } catch (error) {
      console.log(error);
      alert("Project could not be added");
    }
  };
  return (
    <div>
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>Add Project</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Project Name"
              type="text"
              fullWidth
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              variant="standard"
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={addProject}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const goTo = async (project) => {};

//below for deadlinebox
function getStatement(n) {
  if (n.length === 0) {
    return <p>Please select a deadline first.</p>;
  } else {
    return (
      <p>
        {" "}
        You have{" "}
        <strong>
          {n} day{n === 1 ? "" : "s"}
        </strong>{" "}
        left.
      </p>
    );
  }
}

function DeadlineBox() {
  const [message, setMessage] = useState("");
  const [value, setValue] = useState(null);
  //const [check, setCheck] = useState("");

  const fetchDate = async () => {
    try {
      const docRef = doc(db, "deadline", "PzNJBi59G2ixnJET5lBw");
      const docSnap = await getDoc(docRef);
      //setCheck(docSnap.data().text);
      handleChange(docSnap.data().deadline.toDate());
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching date");
    }
  };

  useEffect(() => {
    fetchDate();
  });

  const handleChange = async (end) => {
    const date1 = new Date();
    const date2 = new Date(end);
    const diffInTime = date2.getTime() - date1.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
    if (isDate(end) && diffInDays >= 0) {
      setValue(end);
      setMessage(diffInDays);
    } else {
      alert("Invalid date input.");
    }

    try {
      const dateRef = doc(db, "deadline", "PzNJBi59G2ixnJET5lBw");
      await updateDoc(dateRef, {
        deadline: end,
      });
    } catch (error) {
      console.log(error);
      alert("Date could not be updated.");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: "35px",
      }}
    >
      <h2>Countdown</h2>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Input project deadline"
          inputFormat="dd/MM/yyyy"
          value={value}
          onChange={(newValue) => {
            handleChange(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <div>{getStatement(message)}</div>
    </Paper>
  );
}

//actual main body
function Dashboard() {
  const [user, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [selecting, setSelecting] = useState(true);

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
    //if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const toHome = () => {
    navigate("/dashboard");
  };

  const toDeadline = () => {
    navigate("/deadline");
  };

  const toTask = () => {
    navigate("/task");
  };

  const toNotes = () => {
    navigate("/notes");
  };

  function OverviewBox() {
    return (
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
        <h2>Overview</h2>
        <Typography>
          Welcome back <strong>{name}</strong>!
        </Typography>
        <p>
          <Typography>
            You have <strong>0 tasks</strong> that are not complete.
          </Typography>
        </p>
      </Paper>
    );
  }

  function Home() {
    const [projects, setProjects] = useState([]);

    const fetchProjects = async () => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();

        setProjects(data.projects);
      } catch (err) {
        console.error(err);
        alert("An error occured while fetching projects");
      }
    };

    useEffect(() => {
      fetchProjects();
    }, []);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
      setOpen(true);
    };
    const handleCancel = () => {
      setOpen(false);
    };

    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
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
          {projects.length != 0 && (
            <div>
              {projects.map((project) => (
                <Button
                  variant="contained"
                  sx={{
                    margin: 1,
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
          )}
          <Button
            variant="contained"
            sx={{
              margin: 1,
              width: "250px",
              height: "150px",
              background: "#fff6e5",
              color: "black",
              ":hover": { backgroundColor: "#faefd9" },
            }}
            onClick={handleOpen}
          >
            Add a project
          </Button>
          <FormDialog open={open} handleCancel={handleCancel} />
        </Box>
      </div>
    );
  }

  return (
    <div>
      {selecting ? (
        <Home />
      ) : (
        <div className="dashboard">
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
              position="fixed"
              open={open}
              sx={{ backgroundColor: "#ffbd59", color: "#694729" }}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{ mr: 2, ...(open && { display: "none" }) }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                  Producktive
                </Typography>
                <IconButton
                  sx={{
                    p: 1,
                    position: "absolute",
                    top: 3,
                    right: 15,
                  }}
                >
                  <Avatar
                    alt={name}
                    src={user?.photoURL}
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleMenu}
                  />
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={logout}>Logout</MenuItem>
                  </Menu>
                </IconButton>
              </Toolbar>
            </AppBar>
            <Drawer
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  boxSizing: "border-box",
                },
              }}
              variant="persistent"
              anchor="left"
              open={open}
            >
              <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === "ltr" ? (
                    <ChevronLeftIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </IconButton>
              </DrawerHeader>
              <Divider />
              <List>
                <ListItem disablePadding>
                  <ListItemButton onClick={toHome}>
                    <ListItemIcon>
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={toDeadline}>
                    <ListItemIcon>
                      <CalendarMonthIcon />
                    </ListItemIcon>
                    <ListItemText primary="Deadline Tracker" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={toTask}>
                    <ListItemIcon>
                      <AssignmentIndIcon />
                    </ListItemIcon>
                    <ListItemText primary="Task Distributor" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={toNotes}>
                    <ListItemIcon>
                      <NotesIcon />
                    </ListItemIcon>
                    <ListItemText primary="Note" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Drawer>
            <Main open={open}>
              <DrawerHeader />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyItems: "center",
                }}
              >
                <div className="rowC">
                  <OverviewBox />
                </div>
                <div className="rowC">
                  <DeadlineBox />
                </div>
              </Box>
            </Main>
          </Box>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
