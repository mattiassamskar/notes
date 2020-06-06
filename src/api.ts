import { NoteData, NotesTab } from "./types";

const fetchNotes = async (): Promise<NoteData[]> => {
  const respone = await fetch("notes");
  return await respone.json();
};

const saveNote = async (note: NoteData) =>
  await fetch("notes", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(note),
  });

const removeNote = async ({ id }: { id: string }) =>
  await fetch("notes/" + id, { method: "DELETE" });

const switchNoteOrder = async (id1: string, id2: string) =>
  await fetch("notes/switch", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({ id1, id2 }),
  });

const updateNotePosition = async (
  note: NoteData,
  column: number,
  index: number
) => {
  await saveNote({ ...note, column, index });
};

const fetchTabs = async (): Promise<NotesTab[]> => {
  const respone = await fetch("tabs");
  return await respone.json();
};

const saveTab = async (tab: NotesTab) =>
  await fetch("tabs", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(tab),
  });

const removeTab = async ({ id }: { id: string }) =>
  await fetch("tabs/" + id, { method: "DELETE" });

export const api = {
  fetchNotes,
  saveNote,
  removeNote,
  switchNoteOrder,
  updateNotePosition,
  fetchTabs,
  saveTab,
  removeTab,
};
