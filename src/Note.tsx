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
  moveRight: () => void;
  moveLeft: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);

  const header = (
    <NoteHeader
      enableTextEdit={() => setIsEditing(true)}
      removeNote={() => remove(note.id)}
      moveUp={() => moveUp(note.index)}
      moveRight={moveRight}
      moveLeft={moveLeft}
    />
  );

  return (
    <Card className="mt-4 ml-2 mr-4">
      <NoteTitle
        title={title}
        setTitle={setTitle}
        header={header}
        onBlur={() => {
          save({
            id: note.id,
            title,
            text,
            column: note.column,
            index: note.index,
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
            id: note.id,
            title,
            text,
            column: note.column,
            index: note.index,
          });
        }}
      />
    </Card>
  );
};
