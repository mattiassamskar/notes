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

exports.saveNote = async ({ id, title, text, tabId, column, index }) => {
  const note = await this.getNote(id);
  if (note) {
    return await updateNote({ id, title, text, tabId, column, index });
  }
  await db
    .collection("notes")
    .insertOne({ id, title, text, tabId, column, index });
};

const updateNote = async ({ id, title, text, tabId, column, index }) => {
  await db
    .collection("notes")
    .findOneAndUpdate({ id }, { $set: { title, text, tabId, column, index } });
};

exports.getTabs = async () => {
  return await db.collection("tabs").find().toArray();
};

exports.removeTab = async (id) => {
  return await db.collection("tabs").deleteOne({ id });
};

exports.getTab = async (id) => await db.collection("tabs").findOne({ id });

exports.saveTab = async ({ id, title, index }) => {
  const tab = await this.getTab(id);
  if (tab) {
    return await updateTab({ id, title, index });
  }
  await db.collection("tabs").insertOne({ id, title, index });
};

const updateTab = async ({ id, title, index }) => {
  await db
    .collection("tabs")
    .findOneAndUpdate({ id }, { $set: { title, index } });
};

exports.switchTabOrder = async (id1, id2) => {
  const tab1 = await this.getTab(id1);
  const tab2 = await this.getTab(id2);

  if (!tab1 || !tab2) return;

  const index = tab1.index;
  tab1.index = tab2.index;
  tab2.index = index;

  await updateTab(tab1);
  await updateTab(tab2);
};
