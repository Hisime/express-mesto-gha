const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFoundError = require('../errors/not-found-err');
const { login, registerUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateLogin, validateRegister } = require('../middlewares/validations');

router.post('/signin', validateLogin, login);
router.post('/signup', validateRegister, registerUser);

router.use(auth);

router.use(userRouter);
router.use(cardRouter);
router.use('**', () => {
  throw new NotFoundError('This is not the web page you are looking for');
});

module.exports = router;
