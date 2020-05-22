const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const compression = require("compression");
const wwwhisper = require("connect-wwwhisper");
const db = require("./db");

const app = express();
if (process.env.NODE_ENV === "production") {
  app.use(wwwhisper());
}
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, `/../build`)));

app.get("/notes", async (req, res) => {
  try {
    const notes = await db.getNotes();
    res.send(notes);
  } catch (error) {
    console.error("server/notes: Error:", error);
    res.sendStatus(500);
  }
});

app.post("/notes", async (req, res) => {
  try {
    if (!req.body) {
      console.error("server/notes: No body");
      return res.sendStatus(400);
    }

    await db.saveNote({
      id: req.body.id,
      title: req.body.title,
      text: req.body.text,
      tabId: req.body.tabId,
      column: req.body.column,
      index: req.body.index,
    });
    res.send();
  } catch (error) {
    console.error("server/notes: Error:", error);
    res.sendStatus(500);
  }
});

app.post("/notes/switch", async (req, res) => {
  try {
    if (!req.body || !req.body.id1 || !req.body.id2) {
      console.error("server/notes: No body");
      return res.sendStatus(400);
    }
    await db.switchNoteOrder(req.body.id1, req.body.id2);
    res.send();
  } catch (error) {
    console.error("server/notes: Error:", error);
    res.sendStatus(500);
  }
});

app.delete("/notes/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      console.error("server/notes: No id");
      return res.sendStatus(400);
    }
    await db.removeNote(req.params.id);
    res.send();
  } catch (error) {
    console.error("server/notes: Error:", error);
    res.sendStatus(500);
  }
});

try {
  db.connectToMongoDb();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Running on port ${PORT}`));
} catch (error) {
  console.error(error);
}

app.get("/tabs", async (req, res) => {
  try {
    const tabs = await db.getTabs();
    res.send(tabs);
  } catch (error) {
    console.error("server/tabs: Error:", error);
    res.sendStatus(500);
  }
});

app.post("/tabs", async (req, res) => {
  try {
    if (!req.body) {
      console.error("server/tabs: No body");
      return res.sendStatus(400);
    }

    await db.saveTab({
      id: req.body.id,
      title: req.body.title,
      index: req.body.index,
    });
    res.send();
  } catch (error) {
    console.error("server/tabs: Error:", error);
    res.sendStatus(500);
  }
});

app.delete("/tabs/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      console.error("server/tabs: No id");
      return res.sendStatus(400);
    }
    await db.removeTab(req.params.id);
    res.send();
  } catch (error) {
    console.error("server/tabs: Error:", error);
    res.sendStatus(500);
  }
});
