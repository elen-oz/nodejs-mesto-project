import { Router } from 'express';
import {
  getUserById,
  getUsers,
  updateAvatar,
  updateProfile,
  getCurrentUser,
} from '../controllers/users';

import { validateUpdateAvatar, validateUpdateProfile, validateUserId } from '../middlewares/validation';

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/me', getCurrentUser);
usersRouter.get('/:userId', validateUserId, getUserById);
usersRouter.patch('/me', validateUpdateProfile, updateProfile);
usersRouter.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

export default usersRouter;
