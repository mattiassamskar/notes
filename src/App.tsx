import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import "./App.css";
import { guid } from "./utils";
import { NotesTab, NoteData } from "./types";
import { Note } from "./Note";
import {
  fetchNotes,
  saveNote,
  removeNote,
  switchNoteOrder,
  updateNotePosition,
  fetchTabs,
} from "./api";
import {
  getPreviousNote,
  getNotesForColumn,
  getNextIndex,
  getNextColumn,
  getPreviousColumn,
} from "./App.utils";

function App() {
  const [tabs, setTabs] = useState([] as NotesTab[]);
  const [activeTab, setActiveTab] = useState("");
  const [columns] = useState([1, 2]);
  const [notes, setNotes] = useState([] as NoteData[]);

  useEffect(() => {
    const fetch = async () => {
      await getTabs();
      await getNotes();
    };
    fetch();
  }, []);

  useEffect(() => {
    if (tabs.length > 0) {
      const activeTab = window.localStorage.getItem("activeTab") || tabs[0].id;
      setActiveTab(activeTab);
    }
  }, [tabs]);

  useEffect(() => {
    window.localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const getNotes = async () => {
    const dbNotes = await fetchNotes();
    setNotes(dbNotes);
  };

  const getTabs = async () => {
    const dbTabs = await fetchTabs();
    setTabs(dbTabs);
  };

  const save = async (note: NoteData) => await saveNote(note);

  const remove = async (id: string) => {
    await removeNote({ id });
    await getNotes();
  };

  const addNote = (tabId: string, column: number) => {
    setNotes([
      ...notes,
      {
        id: guid(),
        title: "",
        text: "",
        tabId,
        column,
        index: getNextIndex(notes, tabId, column),
      },
    ]);
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

    const index = getNextIndex(notes, note.tabId, column);
    await updateNotePosition(note, column, index);
    await getNotes();
  };

  const moveLeft = async (note: NoteData) => {
    const column = getPreviousColumn(note);
    if (!column) return;

    const index = getNextIndex(notes, note.tabId, column);
    await updateNotePosition(note, column, index);
    await getNotes();
  };

  if (tabs.length === 0) return <div>Loading..</div>;

  return (
    <Container fluid>
      <Tabs
        id="tabs"
        activeKey={activeTab}
        onSelect={(tabId: string) => setActiveTab(tabId)}
      >
        {tabs.map((tab) => (
          <Tab key={tab.id} eventKey={tab.id} title={tab.title}>
            <Row>
              {columns.map((column) => (
                <Col key={column}>
                  {getNotesForColumn(notes, tab.id, column).map((note) => (
                    <Note
                      key={note.id}
                      note={note}
                      save={save}
                      remove={remove}
                      moveUp={() => moveUp(note)}
                      moveRight={moveRight}
                      moveLeft={moveLeft}
                    />
                  ))}
                  <div className="mt-4 mb-4 fading">
                    <FontAwesomeIcon
                      style={{ alignSelf: "center", width: "100%" }}
                      cursor="pointer"
                      color={"black"}
                      icon={faPlus}
                      onClick={() => addNote(tab.id, column)}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Tab>
        ))}
      </Tabs>
    </Container>
  );
}

export default App;
