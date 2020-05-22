import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faArrowUp,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export const NoteHeader = ({
  enableTextEdit,
  removeNote,
  moveUp,
  moveRight,
  moveLeft,
}: {
  enableTextEdit: () => void;
  removeNote: () => void;
  moveUp: () => void;
  moveRight: () => void;
  moveLeft: () => void;
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <FontAwesomeIcon
        className="float-right fading"
        cursor="pointer"
        icon={faTrash}
        onClick={(event) => {
          event.stopPropagation();
          setShowModal(true);
        }}
      />
      <FontAwesomeIcon
        className="float-right fading mr-2"
        cursor="pointer"
        icon={faArrowUp}
        onClick={(event) => {
          event.stopPropagation();
          moveUp();
        }}
      />
      <FontAwesomeIcon
        className="float-right fading mr-2"
        cursor="pointer"
        icon={faArrowRight}
        onClick={(event) => {
          event.stopPropagation();
          moveRight();
        }}
      />
      <FontAwesomeIcon
        className="float-right fading mr-2"
        cursor="pointer"
        icon={faArrowLeft}
        onClick={(event) => {
          event.stopPropagation();
          moveLeft();
        }}
      />
      <FontAwesomeIcon
        className="float-right fading mr-2"
        cursor="pointer"
        icon={faEdit}
        onClick={(event) => {
          event.stopPropagation();
          enableTextEdit();
        }}
      />
      <Modal show={showModal} animation={false} centered={true}>
        <Modal.Header closeButton>
          <Modal.Title>Remove note</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              removeNote();
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
    </>
  );
};
