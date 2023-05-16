const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  ERROR_CODE_DEFAULT, ERROR_CODE_NOT_FOUND,
  ERROR_DEFAULT_MESSAGE, VALIDATION_ERROR,
  ERROR_CODE_INVALID, INVALID_ID_ERROR,
} = require('../utils/utils');

const USER_NOT_FOUND_ERROR_MESSAGE = 'Запрашиваемый пользователь не найден';
const SALT_ROUNDS = 10;
const { getJwtToken } = require('../utils/jwt');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: ERROR_DEFAULT_MESSAGE }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: USER_NOT_FOUND_ERROR_MESSAGE });
      } else if (err.name === INVALID_ID_ERROR) {
        res.status(ERROR_CODE_INVALID).send({ message: err.message });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: ERROR_DEFAULT_MESSAGE });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const data = {
    name: req.body.name,
    about: req.body.about,
  };
  User.findByIdAndUpdate(req.user._id, data, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))

    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: USER_NOT_FOUND_ERROR_MESSAGE });
      } else if ([VALIDATION_ERROR, INVALID_ID_ERROR].includes(err.name)) {
        res.status(ERROR_CODE_INVALID).send({ message: err.message });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: ERROR_DEFAULT_MESSAGE });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const data = {
    avatar: req.body.avatar,
  };
  User.findByIdAndUpdate(req.user._id, data, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: USER_NOT_FOUND_ERROR_MESSAGE });
      } else if ([VALIDATION_ERROR, INVALID_ID_ERROR].includes(err.name)) {
        res.status(ERROR_CODE_INVALID).send({ message: err.message });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: ERROR_DEFAULT_MESSAGE });
      }
    });
};

module.exports.registerUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    res.status(400).send({ message: 'Email или пароль не могут быть пустыми' });
    return;
  }
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.status(201).send({ message: `Пользователь ${email} успешно создан!` }))
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({ message: 'Такой пользователь уже существует' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
  res.send(req.body);
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send({ message: 'Email или пароль не могут быть пустыми' });
  return User.findOne({ email })
    .then((user) => {
      if (!user) return res.status.status(401).send({ message: 'Неправильная почта или пароль' });
      return bcrypt.compare(password, user.password)
        .then((isValidPassword) => {
          if (!isValidPassword) return res.status(401).send({ message: 'Неправильная почта или пароль' });
          const token = getJwtToken(user._id);
          return res.send({ token });
        });
    });
};
