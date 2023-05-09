const User = require('../models/user');
const {
  ERROR_CODE_DEFAULT, ERROR_CODE_NOT_FOUND,
  ERROR_DEFAULT_MESSAGE, ERROR_VALIDATION_MESSAGE, VALIDATION_ERROR,
  ERROR_CODE_INVALID,
} = require('../utils/utils');

const USER_NOT_FOUND_ERROR_MESSAGE = 'Запрашиваемый пользователь не найден';

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: ERROR_DEFAULT_MESSAGE }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: USER_NOT_FOUND_ERROR_MESSAGE });
      } else {
        res.send(user);
      }
    })
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: ERROR_DEFAULT_MESSAGE }));
};

module.exports.createUser = (req, res) => {
  const data = {
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  };
  User.create(data)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: USER_NOT_FOUND_ERROR_MESSAGE });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        res.status(ERROR_CODE_INVALID).send({ message: ERROR_VALIDATION_MESSAGE });
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
    new: true
  })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: USER_NOT_FOUND_ERROR_MESSAGE });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        res.status(ERROR_CODE_INVALID).send({ message: ERROR_VALIDATION_MESSAGE });
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
  })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: USER_NOT_FOUND_ERROR_MESSAGE });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        res.status(ERROR_CODE_INVALID).send({ message: ERROR_VALIDATION_MESSAGE });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: ERROR_DEFAULT_MESSAGE });
      }
    });
};
