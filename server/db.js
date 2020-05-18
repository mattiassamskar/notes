const MongoClient = require("mongodb").MongoClient;

var db;

const connectToMongoDb = async () => {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  db = client.db();
};

const getNotes = async () => {
  return await db.collection("notes").find().toArray();
};

const getNote = async (id) => await db.collection("notes").findOne({ id });

const saveNote = async ({ id, title, text, column }) => {
  const note = await getNote(id);
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

export { connectToMongoDb, getNotes, saveNote };
