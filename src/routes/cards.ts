import { Router } from 'express';
import {
  createCard,
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';
import { validateCardId, validateCreateCard } from '../middlewares/validation';

const cardsRouter = Router();

cardsRouter.get('/', getCards);
cardsRouter.post('/', validateCreateCard, createCard);
cardsRouter.delete('/:cardId', validateCardId, deleteCard);
cardsRouter.put('/:cardId/likes', validateCardId, likeCard);
cardsRouter.delete('/:cardId/likes', validateCardId, dislikeCard);

export default cardsRouter;
