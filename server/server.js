const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const compression = require("compression");

const app = express();
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, `/../build`)));

app.get("/ping", async (req, res) => {
  try {
    res.send({ response: "pong" });
  } catch (error) {
    console.error("server/ping: Error:", error);
    res.sendStatus(500);
  }
});

try {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Running on port ${PORT}`));
} catch (error) {
  console.error(error);
}
