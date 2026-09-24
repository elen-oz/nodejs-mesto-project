import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import Card from '../models/card';
import { CREATED } from '../utils/constants';
import { NotFoundError, BadRequestError, ForbiddenError } from '../errors';

/**
 * GET /cards — returns every card.
 */
export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

/**
 * POST /cards — creates a card from `name` and `link` in the request body.
 * The owner is taken from `req.user._id`.
 */
export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Incorrect data provided when creating a card'));
        return;
      }
      next(err);
    });
};

/**
 * DELETE /cards/:cardId — deletes a card if it belongs to the current user.
 * Responds 403 for someone else's card, 404 if it doesn't exist, 400 if the _id is malformed.
 */
export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('You cannot delete someone elses card.');
      }
      return card.deleteOne().then(() => res.send({ message: 'Card deleted' }));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Invalid card ID'));
        return;
      }
      next(err);
    });
};

/**
 * PUT /cards/:cardId/likes — adds the current user to `likes`.
 * `$addToSet` keeps the array free of duplicates.
 */
export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Invalid card ID'));
        return;
      }
      next(err);
    });
};

/**
 * DELETE /cards/:cardId/likes — removes the current user from `likes`.
 */
export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Invalid card ID'));
        return;
      }
      next(err);
    });
};
