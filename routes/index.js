const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFoundError = require('../errors/not-found-err');

router.use(userRouter);
router.use(cardRouter);
router.use('**', () => {
  throw new NotFoundError('This is not the web page you are looking for');
});

module.exports = router;
