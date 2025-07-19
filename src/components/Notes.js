// src/components/Notes.js
import { useContext } from "react";
import NoteContext from "../context/Notes/NoteContext";
import NoteItem from "./Noteitem";
import "./Notes.css"; // New CSS for grid
import Addnote from "./Addnote";
import { useEffect } from "react";

function Notes() {
  const context = useContext(NoteContext);
  const { notes, getNotes } = context;
  useEffect(() => {
    getNotes();
  }, []);

  return (
    <>
      <Addnote />
      <div className="notes-wrapper">
        <h2>Your notes are here</h2>
        <div className="note-grid">
          {notes.map((note, index) => (
            <NoteItem key={note._id} note={note} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Notes;
