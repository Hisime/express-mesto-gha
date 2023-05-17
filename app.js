const helmet = require('helmet');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const router = require('./routes');
const { login, registerUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errors = require('./middlewares/errors');

const app = express();
app.use(helmet());
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.post('/signin', login);
app.post('/signup', registerUser);
app.use(auth);
app.use(router);
app.use(errors);
app.listen(3000, () => console.log('server started'));
