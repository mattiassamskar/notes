import { NoteData } from "./types";

export const getPreviousNote = (notes: NoteData[], note: NoteData) => {
  if (notes.length < 2) return null;

  const previousNote = getNotesForColumn(notes, note.column)
    .filter((n) => n.index !== note.index)
    .reduce((prev, curr) =>
      curr.index > prev.index && curr.index < note.index ? curr : prev
    );
  return previousNote.index < note.index ? previousNote : null;
};

export const getNotesForColumn = (notes: NoteData[], column: number) => {
  const filteredNotes = notes.filter((note) => note.column === column);
  filteredNotes.sort((note) => note.index);
  return filteredNotes;
};

export const getNextIndex = (notes: NoteData[], column: number) => {
  const indexes = getNotesForColumn(notes, column).map((note) => note.index);
  return Math.max(...indexes) + 1;
};
