import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { styled, useTheme } from "@mui/material/styles";
import {
  Typography,
  TextField,
  Paper,
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

  function getStatement(n) {
    if (n.length === 0) {
      return <Typography>Please input a deadline first.</Typography>;
    } else {
      return (
        <Typography>
          {" "}
          You have{" "}
          <strong>
            {n} day{n === 1 ? "" : "s"}
          </strong>{" "}
          left.
        </Typography>
      );
    }
  }

  function DeadlineBox() {
    const [message, setMessage] = useState("");
    const [value, setValue] = React.useState(null);
    const handleChange = (end) => {
      setValue(end);
      const date1 = new Date();
      const date2 = new Date(end);
      const diffInTime = date2.getTime() - date1.getTime();
      const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
      setMessage(diffInDays);
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
            label="Enter project deadline"
            inputFormat="dd/MM/yyyy"
            value={value}
            onChange={(newValue) => {
              handleChange(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <p>{getStatement(message)}</p>
      </Paper>
    );
  }

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

  return (
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
  );
}

export default Dashboard;
