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
import {
  fetchNotes,
  saveNote,
  removeNote,
  switchNoteOrder,
  updateNotePosition,
} from "./api";
import {
  getPreviousNote,
  getNotesForColumn,
  getNextIndex,
  getNextColumn,
  getPreviousColumn,
} from "./App.utils";

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

  const moveUp = async (note: NoteData) => {
    const previousNote = getPreviousNote(notes, note);
    if (!previousNote) return;

    await switchNoteOrder(note.id, previousNote.id);
    await getNotes();
  };

  const moveRight = async (note: NoteData) => {
    const column = getNextColumn(note);
    if (!column) return;

    const index = getNextIndex(notes, column);
    await updateNotePosition(note, column, index);
    await getNotes();
  };

  const moveLeft = async (note: NoteData) => {
    const column = getPreviousColumn(note);
    if (!column) return;

    const index = getNextIndex(notes, column);
    await updateNotePosition(note, column, index);
    await getNotes();
  };

  return (
    <Container fluid>
      <Row>
        {columns.map((column) => (
          <Col key={column}>
            {getNotesForColumn(notes, column).map((note) => (
              <Note
                key={note.id}
                note={note}
                save={save}
                remove={remove}
                moveUp={() => moveUp(note)}
                moveRight={() => moveRight(note)}
                moveLeft={() => moveLeft(note)}
              />
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
                    {
                      id: guid(),
                      title: "",
                      text: "",
                      column,
                      index: getNextIndex(notes, column),
                    },
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
