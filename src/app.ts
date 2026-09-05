import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { NOT_FOUND } from './utils/constants';

const PORT = 3000;
const DB_ADDRESS = 'mongodb://localhost:27017/mestodb';

const app = express();

mongoose.connect(DB_ADDRESS);

app.use(express.json());

/**
 * Temporary stand-in for authentication
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6a9e83ef93132d5fd76a3566',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req: Request, res: Response) => {
  res.status(NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT);
