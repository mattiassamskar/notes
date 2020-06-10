import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Spinner from "react-bootstrap/Spinner";
import { guid } from "./utils";
import { NotesTab, NoteData } from "./types";
import { Note } from "./Note";
import { api } from "./api";
import {
  getPreviousNote,
  getNotesForColumn,
  getNextIndex,
  getNextColumn,
  getPreviousColumn,
  getPreviousTab,
} from "./App.utils";
import { TabNavItem } from "./TabNavItem";

function App() {
  const [tabs, setTabs] = useState([] as NotesTab[]);
  const [activeTab, setActiveTab] = useState("");
  const [columns] = useState([1, 2]);
  const [notes, setNotes] = useState([] as NoteData[]);
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);
    const dbNotes = await api.fetchNotes();
    setNotes(dbNotes);
    setIsSaving(false);
  };

  const saveNote = async (note: NoteData) => {
    setIsSaving(true);
    await api.saveNote(note);
    setIsSaving(false);
  };

  const removeNote = async (id: string) => {
    setIsSaving(true);
    await api.removeNote({ id });
    await getNotes();
    setIsSaving(false);
  };

  const getTabs = async () => {
    setIsSaving(true);
    const dbTabs = await api.fetchTabs();
    dbTabs.sort((a, b) => a.index - b.index);
    setTabs(dbTabs);
    setIsSaving(false);
  };

  const saveTab = async (tab: NotesTab) => {
    await api.saveTab(tab);
    await getTabs();
  };

  const removeTab = async (id: string) => {
    setIsSaving(true);
    await api.removeTab({ id });
    await getTabs();
    setIsSaving(false);
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

    await api.switchNoteOrder(note.id, previousNote.id);
    await getNotes();
  };

  const moveRight = async (note: NoteData) => {
    setIsSaving(true);
    const column = getNextColumn(note);
    if (!column) return;

    const index = getNextIndex(notes, note.tabId, column);
    await api.updateNotePosition(note, column, index);
    await getNotes();
    setIsSaving(false);
  };

  const moveLeft = async (note: NoteData) => {
    setIsSaving(true);
    const column = getPreviousColumn(note);
    if (!column) return;

    const index = getNextIndex(notes, note.tabId, column);
    await api.updateNotePosition(note, column, index);
    await getNotes();
    setIsSaving(false);
  };

  const addTab = async () => {
    setIsSaving(true);
    await api.saveTab({
      id: guid(),
      title: "New tab",
      index: tabs.length + 1,
    });
    await getTabs();
    setIsSaving(false);
  };

  const moveTabLeft = async (tab: NotesTab) => {
    setIsSaving(true);
    const previousTab = getPreviousTab(tabs, tab);
    if (!previousTab) return;

    await api.switchTabOrder(tab.id, previousTab.id);
    await getTabs();
    setIsSaving(false);
  };

  if (tabs.length === 0) return <div>Loading..</div>;

  return (
    <Container fluid className="mt-1">
      <Tab.Container
        id="tabs"
        activeKey={activeTab}
        onSelect={(tabId: string) => setActiveTab(tabId)}
      >
        {isSaving && (
          <Spinner
            animation="border"
            variant="secondary"
            size="sm"
            style={{ position: "fixed", right: "5px", zIndex: 999, top: "5px" }}
          />
        )}
        <Nav variant="tabs">
          {tabs.map((tab) => (
            <TabNavItem
              key={tab.id}
              id={tab.id}
              index={tab.index}
              title={tab.title}
              isActive={activeTab === tab.id}
              saveTab={saveTab}
              removeTab={removeTab}
              moveLeft={() => moveTabLeft(tab)}
            />
          ))}
          <Nav.Item key={"999"}>
            <Nav.Link eventKey={"999"}>
              <div className="fading">
                <span className="fading">
                  <FontAwesomeIcon
                    cursor="pointer"
                    color={"black"}
                    icon={faPlus}
                    onClick={addTab}
                  />
                </span>
              </div>
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          {tabs.map((tab) => (
            <Tab.Pane key={tab.id} eventKey={tab.id}>
              <Row>
                {columns.map((column) => (
                  <Col key={column}>
                    {getNotesForColumn(notes, tab.id, column).map((note) => (
                      <Note
                        key={note.id}
                        note={note}
                        save={saveNote}
                        remove={removeNote}
                        moveUp={() => moveUp(note)}
                        moveRight={moveRight}
                        moveLeft={moveLeft}
                      />
                    ))}
                    <div className="mt-4 mb-4 fading">
                      <span className="fading">
                        <FontAwesomeIcon
                          style={{ alignSelf: "center", width: "100%" }}
                          cursor="pointer"
                          color={"black"}
                          icon={faPlus}
                          onClick={() => addNote(tab.id, column)}
                        />
                      </span>
                    </div>
                  </Col>
                ))}
              </Row>
            </Tab.Pane>
          ))}
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}

export default App;
