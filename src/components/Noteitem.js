// src/components/NoteItem.js
import React from "react";
import "./Noteitem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";

import NoteContext from "../context/Notes/NoteContext";

function NoteItem(props) {
    const context = useContext(NoteContext);
    const { deleteNote } = context;
    const { note, updateNote } = props;
    
  return (
  <div className="card">
  <div
    className="head align-items-center ml-3"
    style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
  >
    <span>{note.title}</span>
    <i className="fa-solid fa-trash" onClick={() => props.deleteNote(note._id)}></i>

    <i className="fa-solid fa-pen-to-square" onClick={()=>{updateNote(note)}}></i>
  </div>

      <div className="content">
        <div className="text">{note.description}</div>
        <button className="button">{note.tag}</button>
      </div>
    </div>
  );
}

export default NoteItem;
