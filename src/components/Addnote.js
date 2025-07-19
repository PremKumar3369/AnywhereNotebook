import { useContext, useState } from "react";
import NoteContext from "../context/Notes/NoteContext";
import "./Addnote.css"; // Make sure this file contains your 3D styles

function Addnote() {
  const { addNote } = useContext(NoteContext);

  const [note, setNote] = useState({ title: "", description: "" });

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (note.title.trim() && note.description.trim()) {
      addNote(note.title, note.description, "default");
      setNote({ title: "", description: "" }); // reset form
    }
  };

  return (
    <div className="container my-5">
      <h1 className="heading__styled">Add a Note</h1>

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
        {/* Title Input */}
        <div className="input__container">
          <div className="shadow__input"></div>
          <input
            type="text"
            id="title"
            name="title"
            className="input__search"
            placeholder="Enter title"
            value={note.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description Input */}
        <div className="input__container">
          <div className="shadow__input"></div>
          <input
            type="text"
            id="description"
            name="description"
            className="input__search"
            placeholder="Enter description"
            value={note.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="input__button__shadow">
          Submit Note
        </button>
      </form>
    </div>
  );
}

export default Addnote;
