import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { errors } from 'celebrate';

import usersRouter from './routes/users';
import cardsRouter from './routes/cards';

import { requestLogger, errorLogger } from './middlewares/logger';
import auth from './middlewares/auth';
import errorHandler from './middlewares/error-handler';
import { validateSignin, validateSignup } from './middlewares/validation';
import { createUser, login } from './controllers/users';
import { NotFoundError } from './errors';

const PORT = 3000;
const DB_ADDRESS = 'mongodb://localhost:27017/mestodb';

const app = express();

mongoose.connect(DB_ADDRESS);

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.post('/signin', validateSignin, login);
app.post('/signup', validateSignup, createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res, next) => {
  next(new NotFoundError('The requested resource was not found'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
