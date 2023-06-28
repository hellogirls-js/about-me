import express, { Express } from "express";
import dotenv from "dotenv";
import mysql from "mysql";
import path = require("path");

dotenv.config();

// const connection = mysql.createConnection({
//   host: process.env.IP_ADD,
//   port: '/var/run/mysqld/mysqld.sock' as any,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DB_NAME
// });

// connection.connect(function (err) {
//   if (err) {
//     console.error(err);
//     throw err;
//   }
// });

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, "/src")));
app.use("/static", express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/src/views/index.html"));
});

app.get("/partial/:id", (req, res) => {
  console.log("requesting ", req.params.id);
  res.sendFile(path.join(__dirname, `/src/views/partials/${req.params.id}.html`));
})

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// app.post("/chat/send", (req, res) => {
//   const data = req.body;
//   if (res.statusCode === 200) {
//     if (data.bot) {
//       res.status(401);
//     } else {
//       // add to database
//       connection.query(`INSERT INTO chatbox_msg (name, message) VALUES ('${data.name}', '${data.msg}')`, function (err, result) {
//         if (err) throw err;
//         res.redirect("/");
//       });
//     }
//   } else {
//     throw "Invalid status code";
//   }
// });

// app.get("/chat/retrieve", (req, res) => {
//   connection.query("SELECT * FROM chatbox_msg", function(err, result, fields) {
//     if (err) throw err;
//     res.send(result);
//   })
// })