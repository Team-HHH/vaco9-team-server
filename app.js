require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const statuses = require('statuses');
const mongoose = require('mongoose');
const createError = require('http-errors');
const { authHeader } = require('./constants');
const port = process.env.PORT || '5000';
const db = mongoose.connection;

db.on('error', console.error);
db.once('open', () => console.log('Connected to mongoDB server'));

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  dbName: process.env.MONGODB_NAME,
});

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
    message: statuses[res.status]
  });
});

server.listen(port);
