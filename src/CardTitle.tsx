import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

export const CardTitle = ({
  text,
  onEdit,
}: {
  text: string;
  onEdit: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text || "Title");
  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  return (
    <Card.Header>
      {isEditing ? (
        <Form
          onSubmit={() => inputRef.current?.blur()}
          onBlur={() => setIsEditing(false)}
        >
          <Form.Group>
            <Form.Control
              as="input"
              ref={(ref: HTMLInputElement) => (inputRef.current = ref)}
              value={editedText}
              onChange={(event) => setEditedText(event.target.value)}
            />
          </Form.Group>
        </Form>
      ) : (
        <>
          <span
            onClick={() => setIsEditing(true)}
            style={{ cursor: "pointer" }}
          >
            {editedText}
          </span>
          <FontAwesomeIcon
            className="float-right fading"
            cursor="pointer"
            icon={faEdit}
            onClick={onEdit}
          />
        </>
      )}
    </Card.Header>
  );
};
