import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactMarkdown from "react-markdown";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

export const CardText = ({
  text,
  isEditing,
}: {
  text: string;
  isEditing: boolean;
}) => {
  const [editedText, setEditedText] = useState(text);
  const textAreaRef = useRef<HTMLTextAreaElement>();

  useEffect(() => {
    if (isEditing) textAreaRef.current?.focus();
  }, [isEditing]);

  return (
    <Card.Body
      style={{
        maxHeight: "600px",
        overflow: "auto",
      }}
    >
      {isEditing ? (
        <Form>
          <Form.Group>
            <Form.Control
              as="textarea"
              ref={(ref: HTMLTextAreaElement) => (textAreaRef.current = ref)}
              rows={20}
              value={editedText}
              onChange={(event) => setEditedText(event.target.value)}
            />
          </Form.Group>
        </Form>
      ) : (
        <ReactMarkdown source={editedText} />
      )}
    </Card.Body>
  );
};
