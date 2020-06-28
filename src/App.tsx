import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
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
import { Login } from "./Login";

function App() {
  const [tabs, setTabs] = useState([] as NotesTab[]);
  const [activeTab, setActiveTab] = useState("");
  const [columns] = useState([1, 2]);
  const [notes, setNotes] = useState([] as NoteData[]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState(
    window.localStorage.getItem("token") || ""
  );

  useEffect(() => {
    const fetch = async () =>
      await withErrorHandler(async () => {
        await getTabs();
        await getNotes();
      }, "Could not get data!");
    fetch();
  }, [token]);

  const withErrorHandler = async (
    func: () => Promise<any>,
    errorMessage: string
  ): Promise<any> => {
    try {
      setIsSaving(true);
      setError("");
      await func();
    } catch {
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const getNotes = async () => {
    const dbNotes = await api.fetchNotes(token);
    setNotes(dbNotes);
  };

  const getTabs = async () => {
    const dbTabs = await api.fetchTabs(token);
    dbTabs.sort((a, b) => a.index - b.index);
    setTabs(dbTabs);
  };

  const saveNote = async (note: NoteData) =>
    await withErrorHandler(async () => {
      await api.saveNote(token, note);
      await getNotes();
    }, "Could not save note!");

  const removeNote = async (id: string) =>
    await withErrorHandler(async () => {
      await api.removeNote({ id });
      await getNotes();
    }, "Could not remove note!");

  const addTab = async () =>
    await withErrorHandler(async () => {
      await api.saveTab(token, {
        id: guid(),
        title: "New tab",
        index: tabs.length + 1,
      });
      await getTabs();
    }, "Could not add tab!");

  const saveTab = async (tab: NotesTab) =>
    await withErrorHandler(async () => {
      await api.saveTab(token, tab);
      await getTabs();
    }, "Could not save tab!");

  const removeTab = async (id: string) =>
    await withErrorHandler(async () => {
      await api.removeTab({ id });
      await getTabs();
    }, "Could not save tab!");

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

  const moveUp = async (note: NoteData) =>
    await withErrorHandler(async () => {
      const previousNote = getPreviousNote(notes, note);
      if (!previousNote) return;

      await api.switchNoteOrder(token, note.id, previousNote.id);
      await getNotes();
    }, "Could not move note!");

  const moveRight = async (note: NoteData) =>
    await withErrorHandler(async () => {
      const column = getNextColumn(note);
      if (!column) return;

      const index = getNextIndex(notes, note.tabId, column);
      await api.updateNotePosition(token, note, column, index);
      await getNotes();
    }, "Could not move note!");

  const moveLeft = async (note: NoteData) =>
    await withErrorHandler(async () => {
      const column = getPreviousColumn(note);
      if (!column) return;

      const index = getNextIndex(notes, note.tabId, column);
      await api.updateNotePosition(token, note, column, index);
      await getNotes();
    }, "Could not move note!");

  const moveTabLeft = async (tab: NotesTab) =>
    await withErrorHandler(async () => {
      const previousTab = getPreviousTab(tabs, tab);
      if (!previousTab) return;

      await api.switchTabOrder(token, tab.id, previousTab.id);
      await getTabs();
    }, "Could not move tab!");

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <Container fluid className="mt-1">
      {!!error && (
        <Alert variant="danger" dismissible={true} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
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
        <div
          className="fading"
          style={{ position: "fixed", right: "5px", zIndex: 999, top: "5px" }}
        >
          <span className="fading">
            <FontAwesomeIcon
              cursor="pointer"
              color={"black"}
              icon={faSignOutAlt}
              onClick={() => {
                window.localStorage.removeItem("token");
                setToken("");
              }}
            />
          </span>
        </div>
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
