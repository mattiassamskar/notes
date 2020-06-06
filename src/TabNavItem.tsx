import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faArrowLeft,
  faWrench,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { NotesTab } from "./types";

export const TabNavItem: React.FunctionComponent<{
  id: string;
  index: number;
  title: string;
  isActive: boolean;
  saveTab: (tab: NotesTab) => void;
  removeTab: (tabId: string) => void;
  moveLeft: () => void;
}> = ({ id, index, title, isActive, saveTab, removeTab, moveLeft }) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  return (
    <Nav.Item key={id} onBlur={() => setShowToolbar(false)}>
      <Nav.Link eventKey={id}>
        {isEditing ? (
          <Form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              saveTab({ id, index, title: editedTitle });
              setIsEditing(false);
            }}
            onBlur={() => {
              saveTab({ id, index, title: editedTitle });
              setIsEditing(false);
            }}
          >
            <Form.Group>
              <Form.Control
                as="input"
                value={editedTitle}
                onChange={(event) => setEditedTitle(event.target.value)}
              />
            </Form.Group>
          </Form>
        ) : (
          editedTitle
        )}
        {showToolbar && isActive && !isEditing && (
          <>
            <FontAwesomeIcon
              className="ml-2 fading"
              cursor="pointer"
              icon={faEdit}
              onClick={(event) => {
                event.stopPropagation();
                setIsEditing(true);
              }}
            />
            <FontAwesomeIcon
              className="ml-2 fading"
              cursor="pointer"
              icon={faArrowLeft}
              onClick={(event) => {
                event.stopPropagation();
                moveLeft();
              }}
            />
            <FontAwesomeIcon
              className="ml-2 fading"
              cursor="pointer"
              icon={faTrash}
              onClick={(event) => {
                event.stopPropagation();
                setShowModal(true);
              }}
            />
          </>
        )}

        {!showToolbar && isActive && !isEditing && (
          <span className="fading">
            <FontAwesomeIcon
              className="ml-2 fading"
              cursor="pointer"
              color={"black"}
              icon={faWrench}
              style={{ visibility: isActive ? "visible" : "hidden" }}
              onClick={() => {
                setShowToolbar(true);
              }}
            />
          </span>
        )}
        <Modal show={showModal} animation={false} centered={true}>
          <Modal.Header closeButton>
            <Modal.Title>Remove tab</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => {
                removeTab(id);
                setShowModal(false);
              }}
            >
              Yes
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              No
            </Button>
          </Modal.Footer>
        </Modal>
      </Nav.Link>
    </Nav.Item>
  );
};
