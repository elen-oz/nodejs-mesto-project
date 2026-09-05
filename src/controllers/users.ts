import { Request, Response } from 'express';
import User from '../models/user';
import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from '../utils/constants';

const DEFAULT_ERROR_MESSAGE = 'На сервере произошла ошибка';

/**
 * GET /users — returns every user.
 */
export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send(users))
  .catch(() => res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: DEFAULT_ERROR_MESSAGE }));

/**
 * GET /users/:userId — returns a single user.
 */
export const getUserById = (req: Request, res: Response) => User
  .findById(req.params.userId)
  .then((user) => {
    if (!user) {
      return res
        .status(NOT_FOUND)
        .send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res
        .status(BAD_REQUEST)
        .send({ message: 'Передан некорректный _id пользователя' });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: DEFAULT_ERROR_MESSAGE });
  });

/**
 * POST /users — creates a user from `name`, `about` and `avatar` in the request body.
 */
export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

/**
 * PATCH /users/me — updates `name` and `about` of the current user.
 * The user is taken from `req.user._id`.
 */
export const updateProfile = (req: Request, res: Response) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

/**
 * PATCH /users/me/avatar — updates the avatar of the current user.
 */
export const updateAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: DEFAULT_ERROR_MESSAGE });
    });
};
