// src/components/Notes.js
import { useContext, useEffect, useRef, useState } from "react";
import NoteContext from "../context/Notes/NoteContext";
import AlertContext from "../context/AlertContext"; // ✅ Import AlertContext
import NoteItem from "./Noteitem";
import Addnote from "./Addnote";
import "./Notes.css";
import { useNavigate } from "react-router-dom";

function Notes() {
  const { notes, getNotes, editNote, deleteNote } = useContext(NoteContext);
  const { showAlert } = useContext(AlertContext); // ✅ Access showAlert
const navigate = useNavigate()
  const ref = useRef(null);
  const refUpdate = useRef(null);

  const [note, setNote] = useState({ id: "", Edit_title: "", Edit_description: "", Edit_tag: "" });

  useEffect(() => {
    if(localStorage.getItem("token")){
  getNotes();
    }
    else{
      navigate("/Login")
    }
    
  }, []);

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({
      id: currentNote._id,
      Edit_title: currentNote.title,
      Edit_description: currentNote.description,
      Edit_tag: currentNote.tag
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    editNote(note.id, note.Edit_title, note.Edit_description, note.Edit_tag);
    refUpdate.current.click();
    showAlert("Note updated successfully ✅", "success"); // ✅ Alert here
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleDelete = (id) => {
    deleteNote(id);
    showAlert("Note deleted 🗑️", "danger"); // ✅ Optional delete alert
  };

  return (
    <>
      <Addnote />

      {/* Hidden modal trigger button */}
      <button
        type="button"
        ref={ref}
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch modal
      </button>

      {/* Modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="Edit_title" className="form-label">Title</label>
                  <input type="text" className="form-control" id="Edit_title" name="Edit_title" value={note.Edit_title} onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="Edit_description" className="form-label">Description</label>
                  <input type="text" className="form-control" id="Edit_description" name="Edit_description" value={note.Edit_description} onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="Edit_tag" className="form-label">Tag</label>
                  <input type="text" className="form-control" id="Edit_tag" name="Edit_tag" value={note.Edit_tag} onChange={onChange} />
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={refUpdate}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleClick}>Update Note</button>
            </div>
          </div>
        </div>
      </div>

      {/* Note Grid */}
      <div className="notes-wrapper">
        <h2>Your notes are here</h2>
        {Array.isArray(notes) && notes.length > 0 ? (
          <div className="note-grid">
            {notes.map((note, index) => (
              <NoteItem
                updateNote={updateNote}
                deleteNote={handleDelete}
                key={note._id || index}
                note={note}
              />
            ))}
          </div>
        ) : (
          <p>No notes found.</p>
        )}
      </div>
    </>
  );
}

export default Notes;
