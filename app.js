const helmet = require('helmet');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const router = require('./routes');
const { login, registerUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/errors');

const app = express();
app.use(helmet());
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/(?:www\.)?[a-zA-Z0-9а-яА-Я-._~:/?#[\]@!$&'()*+,;=]+/im),
  }),
}), registerUser);
app.use(auth);
app.use(router);
app.use(errors());
app.use(errorsHandler);
app.listen(3000, () => console.log('server started'));
