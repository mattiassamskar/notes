import { NoteData } from "./types";

export const fetchNotes = async (): Promise<NoteData[]> => {
  const respone = await fetch("notes");
  return await respone.json();
};

export const saveNote = async ({ id, title, text, column, index }: NoteData) =>
  await fetch("notes", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({ id, title, text, column, index }),
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
  await saveNote({
    id: note.id,
    title: note.title,
    text: note.text,
    column,
    index,
  });
};
