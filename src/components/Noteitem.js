import React, { useState } from "react";
import "./Noteitem.css";

function NoteItem({ note, updateNote, deleteNote }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  const openExpandedView = () => {
    setIsExpanded(true);
    setTimeout(() => setAnimateIn(true), 10); // delay to trigger animation
  };

  const closeExpandedView = () => {
    setAnimateIn(false);
    setTimeout(() => setIsExpanded(false), 300); // match animation duration
  };

  return (
    <>
      <div className="card">
        <div
          className="head align-items-center ml-3"
          style={{ display: "flex", alignItems: "center", gap: "12px" }}
        >
          <span>{note.title}</span>
          <i
            className="fa-solid fa-trash"
            onClick={() => deleteNote(note._id)}
          ></i>
          <i
            className="fa-solid fa-pen-to-square"
            onClick={() => updateNote(note)}
          ></i>
        </div>

        <div className="content">
          <div className="text">{note.description}</div>
          <div className="bottom-row">
            <button className="tag-button">{note.tag}</button>
            <button className="read-button" onClick={openExpandedView}>
              Read Full Note
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isExpanded && (
        <div
          className={`fullscreen-modal ${animateIn ? "fade-in" : ""}`}
          onClick={closeExpandedView}
        >
          <div
            className={`fullscreen-card ${animateIn ? "zoom-in" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{note.title}</h2>
            <p>{note.description}</p>
            <span className="tag">{note.tag}</span>
            <button className="close-button" onClick={closeExpandedView}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default NoteItem;
