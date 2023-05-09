const Card = require('../models/card');
const {
  ERROR_CODE_DEFAULT, ERROR_DEFAULT_MESSAGE,
  ERROR_CODE_NOT_FOUND, VALIDATION_ERROR, ERROR_CODE_INVALID,
  ERROR_VALIDATION_MESSAGE, INVALID_ID_ERROR,
} = require('../utils/utils');

const CARD_NOT_FOUND_ERROR_MESSAGE = 'Запрашиваемая карточка не найдена';

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: ERROR_DEFAULT_MESSAGE }));
};

module.exports.createCard = (req, res) => {
  const data = {
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
  };
  Card.create(data)
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if ([VALIDATION_ERROR, INVALID_ID_ERROR].includes(err.name)) {
        res.status(ERROR_CODE_INVALID).send({ message: ERROR_VALIDATION_MESSAGE });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: ERROR_DEFAULT_MESSAGE });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: CARD_NOT_FOUND_ERROR_MESSAGE });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if ([VALIDATION_ERROR, INVALID_ID_ERROR].includes(err.name)) {
        res.status(ERROR_CODE_INVALID).send({ message: ERROR_VALIDATION_MESSAGE });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: ERROR_DEFAULT_MESSAGE });
      }
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(ERROR_CODE_NOT_FOUND).send({ message: CARD_NOT_FOUND_ERROR_MESSAGE });
    }
    return res.send(card);
  })
  .catch((err) => {
    if ([VALIDATION_ERROR, INVALID_ID_ERROR].includes(err.name)) {
      res.status(ERROR_CODE_INVALID).send({ message: ERROR_VALIDATION_MESSAGE });
    } else {
      res.status(ERROR_CODE_DEFAULT).send({ message: ERROR_DEFAULT_MESSAGE });
    }
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(ERROR_CODE_NOT_FOUND).send({ message: CARD_NOT_FOUND_ERROR_MESSAGE });
    }
    return res.send(card);
  })
  .catch((err) => {
    if ([VALIDATION_ERROR, INVALID_ID_ERROR].includes(err.name)) {
      res.status(ERROR_CODE_INVALID).send({ message: ERROR_VALIDATION_MESSAGE });
    } else {
      res.status(ERROR_CODE_DEFAULT).send({ message: ERROR_DEFAULT_MESSAGE });
    }
  });
