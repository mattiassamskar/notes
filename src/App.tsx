import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./App.css";
import { guid } from "./utils";
import { NoteData } from "./types";
import { Note } from "./Note";
import { fetchNotes, saveNote, removeNote } from "./api";

function App() {
  const [columns] = useState([1, 2]);
  const [notes, setNotes] = useState([] as NoteData[]);

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = async () => {
    const dbNotes = await fetchNotes();
    setNotes(dbNotes);
  };

  const save = async (note: NoteData) => await saveNote(note);

  const remove = async (id: string) => {
    await removeNote({ id });
    await getNotes();
  };

  return (
    <Container fluid>
      <Row>
        {columns.map((column) => (
          <Col key={column}>
            {notes
              .filter((note) => note.column === column)
              .map((note) => (
                <Note
                  key={note.id}
                  note={note}
                  save={save}
                  remove={remove}
                ></Note>
              ))}
            <div className="mt-4 mb-4 fading">
              <FontAwesomeIcon
                style={{ alignSelf: "center", width: "100%" }}
                cursor="pointer"
                color={"black"}
                icon={faPlus}
                onClick={() =>
                  setNotes([
                    ...notes,
                    { id: guid(), title: "", text: "", column },
                  ])
                }
              />
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default App;
