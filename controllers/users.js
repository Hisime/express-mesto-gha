const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  VALIDATION_ERROR,
  INVALID_ID_ERROR,
} = require('../utils/utils');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const AuthError = require('../errors/auth-err');

const USER_NOT_FOUND_ERROR_MESSAGE = 'Запрашиваемый пользователь не найден';
const SALT_ROUNDS = 10;
const { getJwtToken } = require('../utils/jwt');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user.id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError(USER_NOT_FOUND_ERROR_MESSAGE));
      } else if (err.name === INVALID_ID_ERROR) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError(USER_NOT_FOUND_ERROR_MESSAGE));
      } else if (err.name === INVALID_ID_ERROR) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const data = {
    name: req.body.name,
    about: req.body.about,
  };
  User.findByIdAndUpdate(req.user.id, data, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))

    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError(USER_NOT_FOUND_ERROR_MESSAGE));
      } else if ([VALIDATION_ERROR, INVALID_ID_ERROR].includes(err.name)) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const data = {
    avatar: req.body.avatar,
  };
  User.findByIdAndUpdate(req.user.id, data, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError(USER_NOT_FOUND_ERROR_MESSAGE));
      } else if ([VALIDATION_ERROR, INVALID_ID_ERROR].includes(err.name)) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.registerUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }).then((user) => {
      res.status(201).send(user);
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
      }
      if (err.name === VALIDATION_ERROR) {
        next(new BadRequestError(err.message));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new AuthError('Неправильная почта или пароль');
      bcrypt.compare(password, user.password)
        .then((isValidPassword) => {
          if (!isValidPassword) return next(new BadRequestError('Неправильная почта или пароль'));
          const token = getJwtToken(user._id);
          res.cookie('jwt', token, {
            maxAge: 604800,
            httpOnly: true,
          });
          return res.send({ token });
        });
    })
    .catch(next);
};
