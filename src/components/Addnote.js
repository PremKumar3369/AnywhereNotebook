// Addnote.js
import React, { useContext, useState } from "react";
import NoteContext from "../context/Notes/NoteContext";
import AlertContext from "../context/AlertContext"; // ✅ Import context
import "./Addnote.css";
// import Notes from "./Notes";

function Addnote() {
  const { addNote } = useContext(NoteContext);
  const { showAlert } = useContext(AlertContext); // ✅ Access alert

  const [note, setNote] = useState({ title: "", description: "", tag: "" });

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { title, description, tag } = note;

    if (title.trim() && description.trim()) {
      addNote(title, description, tag || "default");
      showAlert("Note added successfully ✨", "success"); // ✅ Alert here
      setNote({ title: "", description: "", tag: "" });
    }
  };

  return (
    <div className="addnote-wrapper">
      <h1 className="heading__styled">Add a Note</h1>

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
        {/* Inputs... */}
        <div className="input__container">
          <div className="shadow__input"></div>
          <input type="text" name="title" value={note.title} onChange={handleChange} className="input__search" placeholder="Enter title" required />
        </div>
        <div className="input__container">
          <div className="shadow__input"></div>
          <input type="text" name="description" value={note.description} onChange={handleChange} className="input__search" placeholder="Enter description" required />
        </div>
        <div className="input__container">
          <div className="shadow__input"></div>
          <input type="text" name="tag" value={note.tag} onChange={handleChange} className="input__search" placeholder="Enter tag" />
        </div>

        <button disabled={note.title.length < 3 || note.description.length < 3} type="submit" className="input__button__shadow">
          Submit Note
        </button>
      </form>
    </div>
  );
}

export default Addnote;
