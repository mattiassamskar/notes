import { NoteData } from "./types";

export const fetchNotes = async (): Promise<NoteData[]> => {
  const respone = await fetch("notes");
  return await respone.json();
};

export const saveNote = async ({ id, title, text, column }: NoteData) =>
  await fetch("notes", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({ id, title, text, column }),
  });

export const removeNote = async ({ id }: { id: string }) =>
  await fetch("notes/" + id, { method: "DELETE" });
