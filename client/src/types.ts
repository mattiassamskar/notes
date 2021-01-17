export interface NoteData {
  id: string;
  title: string;
  text: string;
  tabId: string;
  column: number;
  index: number;
}

export interface NotesTab {
  id: string;
  title: string;
  index: number;
}
