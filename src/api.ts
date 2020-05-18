import { NoteData } from "./types";

export const getNotes = async (): Promise<NoteData[]> => {
  const respone = await fetch("notes");
  return await respone.json();
};

export const saveNote = async ({ id, title, text, column }: NoteData) => {
  const response = await fetch("notes", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({ id, title, text, column }),
  });
  return await response.json();
};
