import React, { useState, useEffect, useContext } from "react";
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
import { Note } from "./Note";
import { getNotesForColumn } from "./App.utils";
import { TabNavItem } from "./TabNavItem";
import { Login } from "./Login";
import { TabContext } from "./TabContext";
import { NoteContext } from "./NoteContext";
import { AuthContext } from "./AuthContext";

function App() {
  const [activeTab, setActiveTab] = useState<string | null>("");
  const [columns] = useState([1, 2]);

  const { authState, clearToken } = useContext(AuthContext);
  const { tabs, getTabs, addTab, tabsState } = useContext(TabContext);
  const { notes, getNotes, addNote, notesState } = useContext(NoteContext);

  useEffect(() => {
    const fetch = async () => {
      await getTabs();
      await getNotes();
    };
    if (authState === "loggedIn") {
      fetch();
    }
  }, [getTabs, getNotes, authState]);

  if (authState === "loggedOut") {
    return <Login />;
  }

  return (
    <Container fluid className="mt-1">
      {(notesState === "error" || tabsState === "error") && (
        <Alert variant="danger" dismissible={true}>
          "Something went wrong"
        </Alert>
      )}
      <Tab.Container
        id="tabs"
        activeKey={activeTab || undefined}
        onSelect={(tabId: string | null) => tabId && setActiveTab(tabId)}
      >
        <Nav variant="tabs">
          {tabs.map((tab) => (
            <TabNavItem
              key={tab.id}
              id={tab.id}
              index={tab.index}
              title={tab.title}
              isActive={activeTab === tab.id}
            />
          ))}
          <Nav.Item key={"999"}>
            <Nav.Link eventKey={"999"}>
              <div className="fading">
                <FontAwesomeIcon
                  className="fading"
                  cursor="pointer"
                  color={"black"}
                  icon={faPlus}
                  onClick={addTab}
                />
              </div>
            </Nav.Link>
          </Nav.Item>
          <div
            className="fading"
            style={{ position: "absolute", top: 13, right: 15 }}
          >
            <FontAwesomeIcon
              className="fading"
              cursor="pointer"
              color={"black"}
              icon={faSignOutAlt}
              onClick={clearToken}
            />
          </div>
        </Nav>

        <Tab.Content>
          {tabs.map((tab) => (
            <Tab.Pane key={tab.id} eventKey={tab.id}>
              <Row>
                {columns.map((column) => (
                  <Col key={column}>
                    {getNotesForColumn(notes, tab.id, column).map((note) => (
                      <Note key={note.id} note={note} />
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
      {(tabsState === "loading" || notesState === "loading") && (
        <Spinner
          animation="border"
          variant="primary"
          size="sm"
          style={{
            position: "fixed",
            right: "50%",
            zIndex: 999,
            top: "50%",
          }}
        />
      )}
    </Container>
  );
}

export default App;
