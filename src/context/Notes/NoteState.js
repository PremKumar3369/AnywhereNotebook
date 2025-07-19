// Provides the Notes context and state to child components
import NoteContext from "./NoteContext";
import { useState } from "react";

const NoteSate = (props) => {
  // 🔰 Initial static notes (mock data)
  const notesIntial = [];

  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchAllNotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authdata":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjg3MTNlMWE1NTZjZDhhZmE0Zjg5MWMyIn0sImlhdCI6MTc1MjI1MTkzMH0.xR4RBtti_XDCHP1P4bAisFHcK7Yok--q4yYPFwuN334",
      },
    });
    const json = await response.json();
    console.log(json);
    setnotes(json)
  };
  // 🧠 State hook to manage notes array
  const [notes, setnotes] = useState(notesIntial);

  // 🟢 Function to add a new note (static example)
  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/addNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authdata":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjg3MTNlMWE1NTZjZDhhZmE0Zjg5MWMyIn0sImlhdCI6MTc1MjI1MTkzMH0.xR4RBtti_XDCHP1P4bAisFHcK7Yok--q4yYPFwuN334",
      },
      body: JSON.stringify(title, description, tag),
    });
    // const json = response.json
    // console.log("ADDING A NEW NOTE");

    const note1 = {
      _id: "6874b4ded128ffe21f85483c0", // Temporary mock ID
      user: "68713fe1a556cd8afa4f891c2",
      title: title,
      description: description,
      tag: tag,
      date: "2025-07-14T07:42:22.062Z",
      __v: 0,
    };

    // ✅ Update state immutably by concatenating new note
    setnotes(notes.concat(note1));
  };

  // 🔴 TODO: Add deleteNote function here
  // 🔴 Delete a Note by _id
  // Define your function properly
const deleteNote = async (id) => {
  console.log("Deleting note with id:", id);

  try {
    const response = await fetch(`${host}/api/notes/deleteNote/${id}`, {
      method: "DELETE", // Prefer DELETE over POST for deletions (RESTful convention)
      headers: {
        "Content-Type": "application/json",
        "authdata": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjg3MTNlMWE1NTZjZDhhZmE0Zjg5MWMyIn0sImlhdCI6MTc1MjI1MTkzMH0.xR4RBtti_XDCHP1P4bAisFHcK7Yok--q4yYPFwuN334"
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete note: ${response.statusText}`);
    }

    // Once confirmed from backend, update the frontend state
    const updatedNotes = notes.filter((note) => note._id !== id);
    setnotes(updatedNotes);

  } catch (error) {
    console.error("Error deleting note:", error);
    // Optional: show user notification (toast) here
  }
};

  const host = "http://localhost:5000";
  // 🟡 TODO: Add editNote function here
  const editNote = async (id, title, description, tag) => {
    // api call
    const response = await fetch(`${host}/api/notes/updateNote/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authdata":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjg3MTNlMWE1NTZjZDhhZmE0Zjg5MWMyIn0sImlhdCI6MTc1MjI1MTkzMH0.xR4RBtti_XDCHP1P4bAisFHcK7Yok--q4yYPFwuN334",
      },
      body: JSON.stringify(title, description, tag),
    });
    const json = response.json;
    // logic to edit a note
    for (let index = 0; index < notes.length; index++) {
      const element = notes[index];
      if (element._id === id) {
        element.title = title;
        element.description = description;
        element.tag = tag;
      }
    }
  };

  // 🌐 Providing notes state and functions to the context
  return (
    <NoteContext.Provider value={{ notes, setnotes, addNote, deleteNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteSate;
