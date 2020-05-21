const MongoClient = require("mongodb").MongoClient;

var db;

exports.connectToMongoDb = async () => {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  db = client.db();
};

exports.getNotes = async () => {
  return await db.collection("notes").find().toArray();
};

exports.removeNote = async (id) => {
  return await db.collection("notes").deleteOne({ id });
};

exports.getNote = async (id) => await db.collection("notes").findOne({ id });

exports.switchNoteOrder = async (id1, id2) => {
  const note1 = await this.getNote(id1);
  const note2 = await this.getNote(id2);

  if (!note1 || !note2) return;

  const index = note1.index;
  note1.index = note2.index;
  note2.index = index;

  await updateNote(note1);
  await updateNote(note2);
};

exports.saveNote = async ({ id, title, text, column, index }) => {
  const note = await this.getNote(id);
  if (note) {
    return await updateNote({ id, title, text, column, index });
  }
  await db.collection("notes").insertOne({ id, title, text, column, index });
};

const updateNote = async ({ id, title, text, column, index }) => {
  await db
    .collection("notes")
    .findOneAndUpdate({ id }, { $set: { title, text, column, index } });
};
