import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import "./App.css";
import { CardTitle } from "./CardTitle";
import { CardText } from "./CardText";
import { guid } from "./utils";
import { NoteData } from "./types";

function App() {
  const [columns] = useState([1, 2]);
  const [notes, setNotes] = useState([] as NoteData[]);

  return (
    <Container fluid>
      <Row>
        {columns.map((column) => (
          <Col key={column}>
            {notes
              .filter((note) => note.column === column)
              .map((note) => (
                <Note key={note.id} title={note.title} text={note.text}></Note>
              ))}
            <AddButton
              onClick={() =>
                setNotes([
                  ...notes,
                  { id: guid(), title: "", text: "", column },
                ])
              }
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

const Note = ({ title, text }: { title: string; text: string }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className="mt-4 ml-2 mr-4" onBlur={() => setIsEditing(false)}>
      <CardTitle text={title} onEdit={() => setIsEditing(true)} />
      <CardText text={text} isEditing={isEditing} />
    </Card>
  );
};

const AddButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="mt-4 mb-4 fading">
      <FontAwesomeIcon
        style={{ alignSelf: "center", width: "100%" }}
        cursor="pointer"
        color={"black"}
        icon={faPlus}
        onClick={() => onClick()}
      />
    </div>
  );
};

export default App;
