import { NoteData, NotesTab } from "./types";

const fetchNotes = async (token: string): Promise<NoteData[]> => {
  const respone = await fetch("notes", {
    method: "GET",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: "Bearer " + token,
    },
  });
  return await respone.json();
};

const saveNote = async (token: string, note: NoteData) =>
  await fetch("notes", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: "Bearer " + token,
    },
    body: JSON.stringify(note),
  });

const removeNote = async (token: string, { id }: { id: string }) =>
  await fetch("notes/" + id, {
    method: "DELETE",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: "Bearer " + token,
    },
  });

const switchNoteOrder = async (token: string, id1: string, id2: string) =>
  await fetch("notes/switch", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: "Bearer " + token,
    },
    body: JSON.stringify({ id1, id2 }),
  });

const switchTabOrder = async (token: string, id1: string, id2: string) =>
  await fetch("tabs/switch", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: "Bearer " + token,
    },
    body: JSON.stringify({ id1, id2 }),
  });

const updateNotePosition = async (
  token: string,
  note: NoteData,
  column: number,
  index: number
) => {
  await saveNote(token, { ...note, column, index });
};

const fetchTabs = async (token: string): Promise<NotesTab[]> => {
  const respone = await fetch("tabs", {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: "Bearer " + token,
    },
  });
  return await respone.json();
};

const saveTab = async (token: string, tab: NotesTab) =>
  await fetch("tabs", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: "Bearer " + token,
    },
    body: JSON.stringify(tab),
  });

const removeTab = async (token: string, { id }: { id: string }) =>
  await fetch("tabs/" + id, {
    method: "DELETE",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: "Bearer " + token,
    },
  });

const login = async (userName: string, password: string) => {
  const response = await fetch("login", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
    },
    body: `userName=${userName}&password=${password}`,
  });
  return await response.json();
};

const signup = async (userName: string, password: string) =>
  await fetch("signup", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
    },
    body: `userName=${userName}&password=${password}`,
  });

export const api = {
  fetchNotes,
  saveNote,
  removeNote,
  switchNoteOrder,
  updateNotePosition,
  fetchTabs,
  saveTab,
  removeTab,
  switchTabOrder,
  login,
  signup,
};
