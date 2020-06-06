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
import { NotesTab } from "./types";

export const TabNavItem: React.FunctionComponent<{
  id: string;
  title: string;
  isActive: boolean;
  saveTab: (tab: NotesTab) => void;
  removeTab: (tabId: string) => void;
}> = ({ id, title, isActive, saveTab, removeTab }) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <Nav.Item key={id} onBlur={() => setShowToolbar(false)}>
      <Nav.Link eventKey={id}>
        {title}
        {showToolbar && isActive && (
          <>
            <FontAwesomeIcon
              className="ml-2 fading"
              cursor="pointer"
              icon={faEdit}
              onClick={(event) => {
                event.stopPropagation();
              }}
            />
            <FontAwesomeIcon
              className="ml-2 fading"
              cursor="pointer"
              icon={faArrowLeft}
              onClick={(event) => {
                event.stopPropagation();
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

        {!showToolbar && isActive && (
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
