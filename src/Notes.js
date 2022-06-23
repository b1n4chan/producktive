import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import Outer from "./Outer";
import {
  query,
  collection,
  getDocs,
  where,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import "./Notes.css";
import {
  Button,
  Paper,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

function FormDialog({
  open,
  handleClose,
  note,
  setNote,
  category,
  categories,
  addNote,
  setSuccessC,
  setCategory,
}) {
  const [newCategory, setNewCategory] = useState("");
  const addNewCategory = async () => {
    try {
      await addDoc(collection(db, "category"), {
        category: newCategory,
      });
      setCategory(newCategory);
      setSuccessC(true);
      alert("Category Added");
    } catch (error) {
      alert("Category could not be added");
    }
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Note"
              type="text"
              fullWidth
              value={note}
              onChange={(e) => setNote(e.target.value)}
              variant="standard"
            />
          </FormControl>
          <FormControl fullWidth>
            {/* <InputLabel id="demo-simple-select-label">Category</InputLabel> */}
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              fullWidth
              variant="standard"
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem disabled value="">
                <em>Select Category</em>
              </MenuItem>
              {categories.map((e) => (
                <MenuItem value={e.category}>{e.category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Add new Category"
              type="text"
              fullWidth
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              variant="standard"
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
              onClick={addNewCategory}
            >
              Add Category
            </Button>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={addNote}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const Notes = () => {
  const [user, loading, error] = useAuthState(auth);
  const [successC, setSuccessC] = useState(false);
  const [successD, setSuccesD] = useState(false);
  const [successU, setSuccessU] = useState(false);
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");
  const [edit, setEdit] = useState(false);
  const [categories, setCateogories] = useState([]);
  const [category, setCategory] = useState("Select Category");
  const navigate = useNavigate();
  const fetchNotes = async () => {
    try {
      const q = query(collection(db, "notes"), where("uid", "==", user?.uid));
      const c = query(collection(db, "category"));
      const doc = await getDocs(q);
      const cDoc = await getDocs(c);
      let n = [];
      doc.docs.forEach((element) => {
        n.push(element.data());
      });
      let ca = [];
      cDoc.docs.forEach((element) => {
        ca.push(element.data());
      });
      setCateogories(ca);
      setNotes(n);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching notes");
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addNote = async () => {
    try {
      let s = Date.now().toString();
      await setDoc(doc(db, "notes", s), {
        uid: user.uid,
        id: s,
        note,
        category,
      });
      setOpen(false);
      setSuccessC(!successC);
      alert("Note Added");
    } catch (error) {
      alert("Note could not be added");
    }
  };

  const deleteNote = async (e) => {
    try {
      if (window.confirm("Do you want to delete note?")) {
        await deleteDoc(doc(db, "notes", e.id));
        setSuccesD(!successD);
        alert("Note Deleted");
      }
    } catch (error) {
      console.log(error);
      alert("Note could not be deleted");
    }
  };
  const updateNote = async (e) => {
    try {
      const washingtonRef = doc(db, "notes", e.id);
      await updateDoc(washingtonRef, {
        note: note,
      });
      setSuccessU(true);
      setEdit(false);
      alert("Note updated");
    } catch (error) {
      console.log(error);
      alert("Note could not be updated");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchNotes();
  }, [user, loading, successC, successD, successU]);
  return (
    <Outer>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Note
      </Button>
      <FormDialog
        open={open}
        addNote={addNote}
        category={category}
        setCategory={setCategory}
        note={note}
        setNote={setNote}
        handleClose={handleClose}
        handleClickOpen={handleClickOpen}
        categories={categories}
        setSuccessC={setSuccessC}
      />
      <div className="notesContainer">
        {notes.map((e) => (
          <Paper
            elevation={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              backgroundColor: "white",
              width: "400px",
              padding: "10px",
              margin: "5px",
              height: "400px",
            }}
          >
            <Typography variant="h6" gutterBottom component="div">
              Note
            </Typography>
            <Typography>
              {e.note}

              {edit && (
                <>
                  <FormControl fullWidth>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Note"
                      type="text"
                      fullWidth
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      variant="standard"
                    />
                  </FormControl>
                  <Button
                    variant="contained"
                    style={{
                      color: "white",
                      backgroundColor: "black",
                      padding: "10px",
                      marginTop: "20px",
                      marginBottom: "10px",
                    }}
                    onClick={() => updateNote(e)}
                  >
                    Update
                  </Button>
                </>
              )}
            </Typography>
            <Typography>{e.category}</Typography>
            <Button
              variant="contained"
              style={{
                color: "white",
                backgroundColor: "black",
                padding: "10px",
                marginTop: "20px",
                marginBottom: "10px",
              }}
              onClick={() => deleteNote(e)}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              style={{
                color: "white",
                backgroundColor: "black",
                padding: "10px",
                marginTop: "20px",
                marginBottom: "10px",
              }}
              onClick={() => setEdit(!edit)}
            >
              Edit
            </Button>
          </Paper>
        ))}
      </div>
    </Outer>
  );
};

export default Notes;
