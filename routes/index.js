const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { ERROR_CODE_NOT_FOUND } = require('../utils/utils');

router.use(userRouter);
router.use(cardRouter);
router.use('**', (req, res) => res.status(ERROR_CODE_NOT_FOUND).send({ message: 'This is not the web page you are looking for' }));

module.exports = router;
