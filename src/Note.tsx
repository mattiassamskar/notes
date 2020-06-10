import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { NoteTitle } from "./NoteTitle";
import { NoteText } from "./NoteText";
import { NoteData } from "./types";
import { NoteHeader } from "./NoteHeader";

export const Note = ({
  note,
  save,
  remove,
  moveUp,
  moveRight,
  moveLeft,
}: {
  note: NoteData;
  save: (note: NoteData) => void;
  remove: (id: string) => void;
  moveUp: (index: number) => void;
  moveRight: (note: NoteData) => void;
  moveLeft: (note: NoteData) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);

  const header = (
    <NoteHeader
      enableTextEdit={() => setIsEditing(true)}
      removeNote={() => remove(note.id)}
      moveUp={() => moveUp(note.index)}
      moveRight={() => moveRight({ ...note, title, text })}
      moveLeft={() => moveLeft({ ...note, title, text })}
    />
  );

  return (
    <Card className="mt-4">
      <NoteTitle
        title={title}
        setTitle={setTitle}
        header={header}
        onBlur={() => {
          save({
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
          save({
            ...note,
            title,
            text,
          });
        }}
      />
    </Card>
  );
};
