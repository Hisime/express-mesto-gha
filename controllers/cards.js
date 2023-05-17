const Card = require('../models/card');
const {
  ERROR_CODE_DEFAULT, ERROR_DEFAULT_MESSAGE,
  ERROR_CODE_NOT_FOUND, VALIDATION_ERROR, ERROR_CODE_INVALID,
  INVALID_ID_ERROR, SUCCESSES_STATUS_CODE,
} = require('../utils/utils');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const CARD_NOT_FOUND_ERROR_MESSAGE = 'Запрашиваемая карточка не найдена';

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const data = {
    name: req.body.name,
    link: req.body.link,
    owner: req.user.id,
  };
  Card.create(data)
    .then((card) => res.status(SUCCESSES_STATUS_CODE).send(card))
    .catch((err) => {
      if ([VALIDATION_ERROR, INVALID_ID_ERROR].includes(err.name)) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user.id;
  Card.findById(cardId)
    .populate('owner')
    .orFail(new Error('NotValidId'))
    .then((card) => {
      if (userId === card.owner.id) {
        Card.findByIdAndRemove(cardId)
          .then((removedCard) => res.send(removedCard));
      } else {
        throw new Error('CardOwnerError');
      }
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError(CARD_NOT_FOUND_ERROR_MESSAGE));
      } else if (err.name === INVALID_ID_ERROR) {
        next(new BadRequestError(err.message));
      } else if (err.message === 'CardOwnerError') {
        next(new ForbiddenError('Удаление чужой карточки недоступно'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(new Error('NotValidId'))
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.message === 'NotValidId') {
      next(new NotFoundError(CARD_NOT_FOUND_ERROR_MESSAGE));
    } else if (err.name === INVALID_ID_ERROR) {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(new Error('NotValidId'))
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.message === 'NotValidId') {
      next(new NotFoundError(CARD_NOT_FOUND_ERROR_MESSAGE));
    } else if (err.name === INVALID_ID_ERROR) {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  });
