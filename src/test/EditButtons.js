import "./EditButtons.css";

import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";

const EditButtons = ({ handleSave, saveLabel, handleDelete, handleCancel }) => (
  <Box
    sx={{ "& button": { m: 0.5 } }}
    display="flex"
    justifyContent="flex-start"
    alignItems="flex-start"
    marginLeft="10px"
  >
    <Button
      variant="contained"
      //style={{ backgroundColor: "#5aac44" }}
      onClick={handleSave}
      color="success"
      size="small"
    >
      {saveLabel}
    </Button>
    {handleDelete && (
      <Button
        variant="contained"
        //style={{ backgroundColor: "#EA2525", marginLeft: 0 }}
        onClick={handleDelete}
        color="error"
        size="small"
      >
        Delete
      </Button>
    )}
    <div className="editButtonCancel" onClick={handleCancel}>
      <CloseIcon />
    </div>
  </Box>
);

export default EditButtons;
