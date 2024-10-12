"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = require("express-rate-limit");
const serve_favicon_1 = __importDefault(require("serve-favicon"));
const dotenv_1 = __importDefault(require("dotenv"));
const mysql_1 = __importDefault(require("mysql"));
const fs = __importStar(require("node:fs"));
const path = require("path");
dotenv_1.default.config();
const connection = mysql_1.default.createConnection({
    host: process.env.IP_ADD,
    port: '/var/run/mysqld/mysqld.sock',
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
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    limit: 5,
});
app.use(express_1.default.json());
app.use(limiter);
app.use(express_1.default.static(path.join(__dirname, "/src")));
app.use("/static", express_1.default.static(path.join(__dirname, "/public")));
app.use((0, serve_favicon_1.default)(path.join(__dirname, 'public', 'favicon.ico')));
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
    var _a, _b;
    const data = req.body;
    if (res.statusCode === 200) {
        if (data.bot) {
            res.status(401).send("Must be a human to submit");
        }
        else if (!((_a = data.name) === null || _a === void 0 ? void 0 : _a.length) || !((_b = data.msg) === null || _b === void 0 ? void 0 : _b.length)) {
            res.status(400).send("Missing fields for name or message");
        }
        else {
            // add to database
            connection.query(`INSERT INTO chatbox_msg (name, message) VALUES ('${data.name}', '${data.msg}')`, function (err, result) {
                if (err)
                    res.status(400).send("Could not add message to the chatbox");
                res.redirect("/");
            });
        }
    }
    else {
        throw "Invalid status code";
    }
});
app.get("/chat/retrieve", (req, res) => {
    connection.query("SELECT * FROM chatbox_msg", function (err, result, fields) {
        if (err)
            res.status(500).send("Could not retrieve chatbox messages");
        else
            res.send(result);
    });
});
app.get("/music/retrieve", (req, res) => {
    const MUSIC_PATH = "/public/music";
    const musicFiles = fs.readdirSync(path.join(__dirname, MUSIC_PATH));
    if (musicFiles) {
        res.status(200).send(musicFiles);
    }
    else {
        console.error("could not retrieve music files");
        res.status(500).send("Could not retrieve music files");
    }
});
