import React, { createContext, useState, useCallback, useContext } from "react";
import { NoteData } from "./types";
import { api } from "./api";
import { guid } from "./utils";
import {
  getNextIndex,
  getPreviousNote,
  getPreviousColumn,
  getNextColumn,
} from "./App.utils";
import { AuthContext } from "./AuthContext";

type NotesState = "initial" | "loading" | "finished" | "error";

interface NoteContextInterface {
  notes: NoteData[];
  notesState: NotesState;
  getNotes: () => Promise<void>;
  saveNote: (note: NoteData) => void;
  removeNote: (id: string) => void;
  addNote: (tabId: string, column: number) => void;
  moveNoteUp: (note: NoteData) => void;
  moveNoteLeft: (note: NoteData) => void;
  moveNoteRight: (note: NoteData) => void;
}

export const NoteContext = createContext<NoteContextInterface>({
  notes: [],
  notesState: "initial",
  getNotes: () => Promise.resolve(),
  saveNote: () => {},
  removeNote: () => {},
  addNote: () => {},
  moveNoteUp: () => {},
  moveNoteLeft: () => {},
  moveNoteRight: () => {},
});

export const NoteProvider = ({ children }: any) => {
  const [notes, setNotes] = useState([] as NoteData[]);
  const [notesState, setNotesState] = useState<NotesState>("initial");
  const { token } = useContext(AuthContext);

  const withErrorHandler = async (func: () => Promise<any>): Promise<any> => {
    try {
      setNotesState("loading");
      await func();
    } catch {
      setNotesState("error");
    } finally {
      setNotesState("finished");
    }
  };

  const getNotes = useCallback(async () => {
    const dbNotes = await api.fetchNotes(token);
    setNotes(dbNotes);
  }, [token]);

  const saveNote = async (note: NoteData) =>
    await withErrorHandler(async () => {
      await api.saveNote(token, note);
      await getNotes();
    });

  const removeNote = async (id: string) =>
    await withErrorHandler(async () => {
      await api.removeNote(token, { id });
      await getNotes();
    });

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

  const moveNoteUp = async (note: NoteData) =>
    await withErrorHandler(async () => {
      const previousNote = getPreviousNote(notes, note);
      if (!previousNote) return;

      await api.switchNoteOrder(token, note.id, previousNote.id);
      await getNotes();
    });

  const moveNoteRight = async (note: NoteData) =>
    await withErrorHandler(async () => {
      const column = getNextColumn(note);
      if (!column) return;

      const index = getNextIndex(notes, note.tabId, column);
      await api.updateNotePosition(token, note, column, index);
      await getNotes();
    });

  const moveNoteLeft = async (note: NoteData) =>
    await withErrorHandler(async () => {
      const column = getPreviousColumn(note);
      if (!column) return;

      const index = getNextIndex(notes, note.tabId, column);
      await api.updateNotePosition(token, note, column, index);
      await getNotes();
    });

  return (
    <NoteContext.Provider
      value={{
        notes,
        notesState,
        getNotes,
        addNote,
        saveNote,
        removeNote,
        moveNoteLeft,
        moveNoteRight,
        moveNoteUp,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};
