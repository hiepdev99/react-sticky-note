/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useReducer } from "react";
import "./App.css";
import logo from './favicon.ico';
import { v4 as uuid } from "uuid";

const initialState = {
  notes: [],
  editNote: {},
};

const notesReducer = (State, action) => {
  switch (action.type) {
    case "ADD_NOTE":
      const newNote = {
        notes: [...State.notes, action.payload],
      };
      // console.log(newNote);
      return newNote;

    case "CLOSE_NOTE":
      const closeNote = {
        notes: State.notes.filter((note) => note.id !== action.payload.id),
      };
      return closeNote;

    case "EDIT_NOTE":
      return {
        notes: [...State.notes],
        editNote: action.payload,
      };
    default:
      return State;
  }
};

function App() {
  const [notesState, dispatch] = useReducer(notesReducer, initialState);
  const [noteText, setNoteText] = useState("");
  const [editInput, setEditInput] = useState("");

  const addNote = (e) => {
    
    e.preventDefault();

    // if (!noteText) {
    //   return;
    // }

    const newNote = {
      id: uuid(),
      text: noteText,
    };

    dispatch({
      type: "ADD_NOTE",
      payload: newNote,
    });
    setNoteText("");
  };

  const closeNote = (id) => {
    dispatch({
      type: "CLOSE_NOTE",
      payload: id,
    });
  };

  const editNote = (note) => {
    let listNotes = [...notesState.notes];
    let isEdit = Object.keys(editInput).length === 0;
    if (isEdit === false && editInput.id === note.id) {
      let objIndex = listNotes.findIndex((obj) => obj.id === note.id);
      listNotes[objIndex].text = editInput.text;
      setEditInput({});
      return;
    }

    setEditInput(note);
    dispatch({
      type: "EDIT_NOTE",
      payload: note,
    });
  };

  const handleChangeEditText = (e) => {
    let copyEditInput = { ...editInput };
    copyEditInput.text = e.target.value;
    setEditInput(copyEditInput);
  };
  return (
    <div className="App">
      <h1 className="title">
        <img className="logo" src={logo} />
        Sticky Notes
        <form className="main-form" onSubmit={addNote}>
              {/* <textarea
                placeholder="Note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              ></textarea> */}
          <button>Add Note</button>
        </form>
      </h1>

      <div className="row">
      {notesState.notes.map((note) => {
        return (
          <div className="note" key={note.id}>
            {Object.keys(editInput).length !== 0 && editInput.id === note.id ? (
              <textarea
                value={editInput.text}
                onChange={(e) => handleChangeEditText(e)}
              ></textarea>
            ) : (
              <h2 className="text">{note.text}</h2>
            )}

            <button className="edit-btn" onClick={() => editNote(note)}>
              {Object.keys(editInput).length !== 0 && editInput.id === note.id
                ? "Save"
                : "Edit"}
            </button>
            <button className="close-btn" onClick={() => closeNote(note)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        );
      })}
      </div>
    </div>
  );
}

export default App;
