require('dotenv').config();
require('./loaders/mongoose');

const http = require('http');
const port = process.env.PORT || '5000';

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const statuses = require('statuses');
const createError = require('http-errors');

const { authHeader } = require('./constants');

const app = express();
const server = http.createServer(app);

app.use(cors({ exposedHeaders: authHeader }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(require('./routes'));

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    code: res.status,
    message: statuses[res.status],
  });
});

server.listen(port);
