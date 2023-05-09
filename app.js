const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const router = require('./routes');
const { ERROR_CODE_NOT_FOUND } = require('./utils/utils');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '64595a7869eebf53846d066e',
  };
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(router);
app.listen(3000, () => {});
app.use('**', (req, res) => res.status(ERROR_CODE_NOT_FOUND).send({ message: 'This is not the web page you are looking for' }));
