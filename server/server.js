const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const compression = require("compression");
const db = require("./db");

const app = express();
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, `/../build`)));

app.get("/notes", async (req, res) => {
  try {
    const notes = await db.getNotes();
    res.send({ notes });
  } catch (error) {
    console.error("server/ping: Error:", error);
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
      column: req.body.column,
    });
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
