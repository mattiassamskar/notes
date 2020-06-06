import { getPreviousNote } from "./App.utils";
import { NoteData } from "./types";

describe("getPreviousNote", () => {
  describe("when previous note exists", () => {
    it("returns note", () => {
      const note = {
        id: "",
        title: "",
        text: "",
        column: 1,
        index: 5,
        tabId: "",
      };

      const notes: NoteData[] = [
        note,
        {
          id: "",
          title: "",
          text: "",
          column: 1,
          index: 1,
          tabId: "",
        },
        {
          id: "",
          title: "",
          text: "",
          column: 1,
          index: 3,
          tabId: "",
        },
        {
          id: "",
          title: "",
          text: "",
          column: 1,
          index: 7,
          tabId: "",
        },
        {
          id: "",
          title: "",
          text: "",
          column: 2,
          index: 4,
          tabId: "",
        },
      ];

      expect(getPreviousNote(notes, note)?.index).toEqual(3);
    });
  });

  describe("when only one note in list", () => {
    it("returns null", () => {
      const note = { id: "", title: "", text: "", column: 1, index: 3 };

      expect(getPreviousNote([note], note)).toEqual(null);
    });
  });

  describe("when note is first in list", () => {
    it("returns null", () => {
      const note = { id: "", title: "", text: "", column: 1, index: 3 };

      const notes: NoteData[] = [
        note,
        {
          id: "",
          title: "",
          text: "",
          column: 1,
          index: 4,
        },
      ];

      expect(getPreviousNote(notes, note)).toEqual(null);
    });
  });
});
