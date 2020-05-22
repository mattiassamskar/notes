import { NoteData, NotesTab } from "./types";

export const fetchNotes = async (): Promise<NoteData[]> => {
  const respone = await fetch("notes");
  return await respone.json();
};

export const saveNote = async (note: NoteData) =>
  await fetch("notes", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(note),
  });

export const removeNote = async ({ id }: { id: string }) =>
  await fetch("notes/" + id, { method: "DELETE" });

export const switchNoteOrder = async (id1: string, id2: string) =>
  await fetch("notes/switch", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({ id1, id2 }),
  });

export const updateNotePosition = async (
  note: NoteData,
  column: number,
  index: number
) => {
  await saveNote({ ...note, column, index });
};

export const fetchTabs = async (): Promise<NotesTab[]> => {
  const respone = await fetch("tabs");
  return await respone.json();
};

export const saveTab = async (tab: NotesTab) =>
  await fetch("tabs", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(tab),
  });

export const removeTab = async ({ id }: { id: string }) =>
  await fetch("tabs/" + id, { method: "DELETE" });
