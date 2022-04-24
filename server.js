const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const compression = require("compression");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const db = require("./db");
const app = express();

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", express.static("./build", { index: "index.html" }));

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "userName",
      passwordField: "password",
    },
    async (userName, password, done) => {
      try {
        const hash = await bcrypt.hash(password, 10);
        await db.saveUser({ userName, password: hash });
        const user = await db.getUser(userName);
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "userName",
      passwordField: "password",
    },
    async (userName, password, done) => {
      try {
        const user = await db.getUser(userName);
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        const validate = await bcrypt.compare(password, user.password);
        if (!validate) {
          return done(null, false, { message: "Wrong password" });
        }
        return done(null, user, { message: "Logged in successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWTKEY,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token);
      } catch (error) {
        done(error);
      }
    }
  )
);

app.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res) => {
    try {
      res.send();
    } catch (error) {
      console.error("server/signup: Error:", error);
      res.sendStatus(500);
    }
  }
);

app.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user) => {
    try {
      if (err || !user) {
        return next(new Error("An error occurred"));
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const token = jwt.sign({ userName: user.userName }, process.env.JWTKEY);
        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

app.get(
  "/notes",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (!req.user) {
        console.error("server/notes: No user");
        return res.sendStatus(400);
      }
      const notes = await db.getNotes(req.user.userName);
      res.send(notes);
    } catch (error) {
      console.error("server/notes: Error:", error);
      res.sendStatus(500);
    }
  }
);

app.post(
  "/notes",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (!req.body || !req.user) {
        console.error("server/notes: No body or user");
        return res.sendStatus(400);
      }

      await db.saveNote(req.user.userName, {
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
  }
);

app.post(
  "/notes/switch",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (!req.body || !req.body.id1 || !req.body.id2) {
        console.error("server/notes: No body");
        return res.sendStatus(400);
      }
      await db.switchNoteOrder(req.body.id1, req.body.id2);
      res.send();
    } catch (error) {
      console.error("server/notes/switch: Error:", error);
      res.sendStatus(500);
    }
  }
);

app.delete(
  "/notes/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
  }
);

app.get(
  "/tabs",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (!req.user) {
        console.error("server/notes: No user");
        return res.sendStatus(400);
      }
      const tabs = await db.getTabs(req.user.userName);
      res.send(tabs);
    } catch (error) {
      console.error("server/tabs: Error:", error);
      res.sendStatus(500);
    }
  }
);

app.post(
  "/tabs",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (!req.body || !req.user) {
        console.error("server/tabs: No body or user");
        return res.sendStatus(400);
      }

      await db.saveTab(req.user.userName, {
        id: req.body.id,
        title: req.body.title,
        index: req.body.index,
      });
      res.send();
    } catch (error) {
      console.error("server/tabs: Error:", error);
      res.sendStatus(500);
    }
  }
);

app.delete(
  "/tabs/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
  }
);

app.post(
  "/tabs/switch",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (!req.body || !req.body.id1 || !req.body.id2) {
        console.error("server/notes: No body");
        return res.sendStatus(400);
      }
      await db.switchTabOrder(req.body.id1, req.body.id2);
      res.send();
    } catch (error) {
      console.error("server/tabs/switch: Error:", error);
      res.sendStatus(500);
    }
  }
);

try {
  db.connectToMongoDb();
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`Running on port ${PORT}`));
} catch (error) {
  console.error(error);
}
