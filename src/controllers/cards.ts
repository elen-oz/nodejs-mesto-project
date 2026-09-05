import { Request, Response } from 'express';
import Card from '../models/card';
import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from '../utils/constants';

const DEFAULT_ERROR_MESSAGE = 'На сервере произошла ошибка';

/**
 * GET /cards — returns every card.
 */
export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(() => res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: DEFAULT_ERROR_MESSAGE }));

/**
 * POST /cards — creates a card from `name` and `link` in the request body.
 * The owner is taken from `req.user._id`.
 */
export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

/**
 * DELETE /cards/:cardId — deletes a card and returns it.
 * Responds 404 if no such card exists, 400 if the `_id` is malformed.
 */
export const deleteCard = (req: Request, res: Response) => Card
  .findByIdAndDelete(req.params.cardId)
  .then((card) => {
    if (!card) {
      return res
        .status(NOT_FOUND)
        .send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res
        .status(BAD_REQUEST)
        .send({ message: 'Передан некорректный _id карточки' });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: DEFAULT_ERROR_MESSAGE });
  });

/**
 * PUT /cards/:cardId/likes — adds the current user to `likes`.
 * `$addToSet` keeps the array free of duplicates.
 */
export const likeCard = (req: Request, res: Response) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res
        .status(NOT_FOUND)
        .send({ message: 'Передан несуществующий _id карточки' });
    }
    return res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res
        .status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные для постановки лайка' });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: DEFAULT_ERROR_MESSAGE });
  });

/**
 * DELETE /cards/:cardId/likes — removes the current user from `likes`.
 */
export const dislikeCard = (req: Request, res: Response) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res
        .status(NOT_FOUND)
        .send({ message: 'Передан несуществующий _id карточки' });
    }
    return res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res
        .status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные для снятия лайка' });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: DEFAULT_ERROR_MESSAGE });
  });
