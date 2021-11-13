import React, { useState, useContext } from "react";
import Card from "react-bootstrap/Card";
import { NoteTitle } from "./NoteTitle";
import { NoteText } from "./NoteText";
import { NoteData } from "./types";
import { NoteHeader } from "./NoteHeader";
import { NoteContext } from "./NoteContext";

export const Note = ({ note }: { note: NoteData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);

  const {
    removeNote,
    saveNote,
    moveNoteLeft,
    moveNoteRight,
    moveNoteUp,
  } = useContext(NoteContext);

  const header = (
    <NoteHeader
      enableTextEdit={() => setIsEditing(true)}
      removeNote={() => removeNote(note.id)}
      moveUp={() => moveNoteUp(note)}
      moveRight={() => moveNoteRight({ ...note, title, text })}
      moveLeft={() => moveNoteLeft({ ...note, title, text })}
    />
  );

  return (
    <Card className="mt-4">
      <NoteTitle
        title={title}
        setTitle={setTitle}
        header={header}
        onBlur={() => {
          saveNote({
            ...note,
            title,
            text,
          });
        }}
      />
      <NoteText
        text={text}
        setText={setText}
        isEditing={isEditing}
        onBlur={() => {
          setIsEditing(false);
          saveNote({
            ...note,
            title,
            text,
          });
        }}
      />
    </Card>
  );
};
