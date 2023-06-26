"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mysql_1 = __importDefault(require("mysql"));
const path = require("path");
dotenv_1.default.config();
const connection = mysql_1.default.createConnection({
  host: process.env.IP_ADD,
  port: "/var/run/mysqld/mysqld.sock",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
});
connection.connect(function (err) {
  if (err) {
    console.error(err);
    throw err;
  }
});
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use(express_1.default.static(path.join(__dirname, "/src")));
app.use("/static", express_1.default.static(path.join(__dirname, "/public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/src/views/index.html"));
});
app.get("/partial/:id", (req, res) => {
  res.sendFile(
    path.join(__dirname, `/src/views/partials/${req.params.id}.html`)
  );
});
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
app.post("/chat/send", (req, res) => {
  const data = req.body;
  if (res.statusCode === 200) {
    if (data.bot) {
      res.status(401);
    } else {
      // add to database
      connection.query(
        `INSERT INTO chatbox_msg (name, message) VALUES ('${data.name}', '${data.msg}')`,
        function (err, result) {
          if (err) throw err;
          res.redirect("/");
        }
      );
    }
  } else {
    throw "Invalid status code";
  }
});
app.get("/chat/retrieve", (req, res) => {
  connection.query("SELECT * FROM chatbox_msg", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});
