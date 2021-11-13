import React, { useState, useEffect, useRef } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

export const NoteTitle = ({
  title,
  setTitle,
  header,
  onBlur,
}: {
  title: string;
  setTitle: (text: string) => void;
  header: JSX.Element;
  onBlur: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  return (
    <Card.Header>
      {isEditing ? (
        <Form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            inputRef.current?.blur();
            event.preventDefault();
          }}
          onBlur={() => {
            setIsEditing(false);
            onBlur();
          }}
        >
          <Form.Group>
            <Form.Control
              as="input"
              ref={(ref: HTMLInputElement) => (inputRef.current = ref)}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </Form.Group>
        </Form>
      ) : (
        <>
          <Form onClick={() => setIsEditing(true)}>
            <Form.Label>{title}</Form.Label>
            {header}
          </Form>
        </>
      )}
    </Card.Header>
  );
};
