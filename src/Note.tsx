import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { CardTitle } from "./CardTitle";
import { CardText } from "./CardText";
import { NoteData } from "./types";
import { NoteHeader } from "./NoteHeader";

export const Note = ({
  note,
  save,
  remove,
}: {
  note: NoteData;
  save: (note: NoteData) => void;
  remove: (id: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);

  const header = (
    <NoteHeader
      enableTextEdit={() => setIsEditing(true)}
      removeNote={() => remove(note.id)}
    />
  );

  return (
    <Card className="mt-4 ml-2 mr-4">
      <CardTitle
        title={title}
        setTitle={setTitle}
        header={header}
        onBlur={() => {
          save({
            id: note.id,
            title,
            text,
            column: note.column,
          });
        }}
      />
      <CardText
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
          });
        }}
      />
    </Card>
  );
};
