import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

export const CardText = ({
  text,
  setText,
  isEditing,
  onBlur,
}: {
  text: string;
  setText: (text: string) => void;
  isEditing: boolean;
  onBlur: () => void;
}) => {
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
              value={text}
              onChange={(event) => setText(event.target.value)}
              onBlur={onBlur}
            />
          </Form.Group>
        </Form>
      ) : (
        <ReactMarkdown source={text} />
      )}
    </Card.Body>
  );
};
