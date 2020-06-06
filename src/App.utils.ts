import { NoteData, NotesTab } from "./types";

export const getPreviousNote = (notes: NoteData[], note: NoteData) => {
  if (notes.length < 2) return null;

  const previousNote = getNotesForColumn(notes, note.tabId, note.column)
    .filter((n) => n.index !== note.index)
    .reduce((prev, curr) =>
      curr.index > prev.index && curr.index < note.index ? curr : prev
    );
  return previousNote.index < note.index ? previousNote : null;
};

export const getPreviousTab = (tabs: NotesTab[], tab: NotesTab) => {
  if (tabs.length < 2) return null;

  const previousTab = tabs
    .filter((t) => t.index !== tab.index)
    .reduce((prev, curr) =>
      curr.index > prev.index && curr.index < tab.index ? curr : prev
    );
  return previousTab.index < tab.index ? previousTab : null;
};

export const getNotesForColumn = (
  notes: NoteData[],
  tabId: string,
  column: number
) => {
  const filteredNotes = notes.filter(
    (note) => note.tabId === tabId && note.column === column
  );
  filteredNotes.sort((a, b) => a.index - b.index);
  return filteredNotes;
};

export const getNextIndex = (
  notes: NoteData[],
  tabId: string,
  column: number
) => {
  const indexes = getNotesForColumn(notes, tabId, column).map(
    (note) => note.index
  );
  return Math.max(...indexes) + 1;
};

export const getNextColumn = (note: NoteData) => (note.column === 1 ? 2 : null);

export const getPreviousColumn = (note: NoteData) =>
  note.column === 2 ? 1 : null;
