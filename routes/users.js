const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  updateProfile, updateAvatar, getUsers, getUser, getUserById,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', getUser);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required()
      .pattern(/^https?:\/\/(?:www\.)?[a-zA-Z0-9а-яА-Я-._~:/?#[\]@!$&'()*+,;=]+/im),
  }),
}), updateAvatar);

module.exports = router;
