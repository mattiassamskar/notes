const MongoClient = require("mongodb").MongoClient;

var db;

exports.connectToMongoDb = async () => {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  db = client.db();
};

exports.getNotes = async () => {
  return await db.collection("notes").find().toArray();
};

exports.getNote = async (id) => await db.collection("notes").findOne({ id });

exports.saveNote = async ({ id, title, text, column }) => {
  const note = await this.getNote(id);
  if (note) {
    return await updateNote({ id, title, text, column });
  }
  await db.collection("notes").insertOne({ id, title, text, column });
};

const updateNote = async ({ id, title, text, column }) => {
  await db
    .collection("notes")
    .findOneAndUpdate({ id }, { $set: { title, text, column } });
};
