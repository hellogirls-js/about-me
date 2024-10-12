import express, { Express } from "express";
import { rateLimit } from "express-rate-limit";
import favicon from "serve-favicon";
import dotenv from "dotenv";
import mysql from "mysql";
import * as fs from "node:fs";
import path = require("path");

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.IP_ADD,
  port: '/var/run/mysqld/mysqld.sock' as any,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_NAME
});

connection.connect(function (err) {
  if (err) {
    console.error(err);
    throw err;
  }
});

const app: Express = express();
const port = process.env.PORT || 3001;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
})

app.use(express.json());
app.use(limiter);
app.use(express.static(path.join(__dirname, "/src")));
app.use("/static", express.static(path.join(__dirname, "/public")));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/src/views/index.html"));
});

app.get("/partial/:mode", (req, res) => {
  res.sendFile(path.join(__dirname, `/src/views/partials/${req.params.mode}/index.html`));
});

app.get("/partial/:mode/:id", (req, res) => {
  res.sendFile(path.join(__dirname, `/src/views/partials/${req.params.mode}/${req.params.id}.html`));
});

app.get("/data/:file", (req, res) => {
  res.sendFile(path.join(__dirname, `src/data/${req.params.file}`));
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.post("/chat/send", (req, res) => {
  const data = req.body;
  if (res.statusCode === 200) {
    if (data.bot) {
      res.status(401).send("Must be a human to submit");
    } else if (!data.name?.length || !data.msg?.length) {
      res.status(400).send("Missing fields for name or message");
    } else {
      // add to database
      connection.query(`INSERT INTO chatbox_msg (name, message) VALUES ('${data.name}', '${data.msg}')`, function (err, result) {
        if (err) res.status(400).send("Could not add message to the chatbox");
        res.redirect("/");
      });
    }
  } else {
    throw "Invalid status code";
  }
});

app.get("/chat/retrieve", (req, res) => {
  connection.query("SELECT * FROM chatbox_msg", function(err, result, fields) {
    if (err) res.status(500).send("Could not retrieve chatbox messages");
    else res.send(result);
  });
});

app.get("/music/retrieve", (req, res) => {
  const MUSIC_PATH = "/public/music";
  const musicFiles = fs.readdirSync(path.join(__dirname, MUSIC_PATH));
  if (musicFiles) {
    res.status(200).send(musicFiles);
  } else {
    console.error("could not retrieve music files");
    res.status(500).send("Could not retrieve music files");
  }
});
