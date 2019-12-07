// node chap3/server.js
const path = require('path');
const express = require('express');
const serveStatic = require('serve-static');
const app = express();

app.use(serveStatic(path.resolve(process.env.PWD)));
app.listen(8080);
