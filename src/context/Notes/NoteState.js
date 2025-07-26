// src/context/Notes/NoteState.js
import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const host = process.env.REACT_APP_API_BASE_URL;
  const [notes, setnotes] = useState([]);

  const getNotes = async () => {
    // const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${host}/api/notes/fetchAllNotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
           "authdata":
          localStorage.getItem("token"),
        },
      });

      const json = await response.json();
      if (Array.isArray(json)) {
        setnotes(json);
      } else {
        console.error("Expected an array of notes, got:", json);
        setnotes([]);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      setnotes([]);
    }
  };

  const addNote = async (title, description, tag) => {
  try {
    const payload = { title, description, tag };

    // console.log("Payload being sent:", payload);

    const response = await fetch(`${host}/api/notes/addNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
         "authdata":
          localStorage.getItem("token"),
        },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to add note:", data);
      return;
    }

    setnotes((prevNotes) => prevNotes.concat(data));
  } catch (error) {
    console.error("Error while adding note:", error);
  }
};


  const deleteNote = async (id) => {
   

    try {
      const response = await fetch(`${host}/api/notes/deleteNote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
           "authdata":
          localStorage.getItem("token"),
        },
      });

      if (!response.ok) throw new Error("Failed to delete note");

      setnotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const editNote = async (id, title, description, tag) => {
  const response = await fetch(`${host}/api/notes/updateNote/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "authdata":
        localStorage.getItem("token"),
    },
    body: JSON.stringify({ title, description, tag }),
  });

  if (!response.ok) throw new Error("Failed to update note");

  // 🔍 Log response to debug structure
  const updatedNote = await response.json();
  // console.log("Updated note from server:", updatedNote);

  // 🛠 Manually update state if backend response is incomplete
  setnotes((prevNotes) =>
    prevNotes.map((note) =>
      note._id === id ? { ...note, title, description, tag } : note
    )
  );
};

  // ✅ Make sure this return is inside the function
  return (
    <NoteContext.Provider
      value={{ notes, setnotes, addNote, deleteNote, getNotes, editNote }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

// ✅ Export the function
export default NoteState;
