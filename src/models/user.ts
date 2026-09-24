import {
  Schema,
  model,
  Model,
  HydratedDocument,
} from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { UnauthorizedError } from '../errors';
import { URL_REGEX } from '../utils/constants';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface IUserModel extends Model<IUser> {
  findUserByCredentials: (email: string, password: string) => Promise<HydratedDocument<IUser>>;
}

const userSchema = new Schema<IUser, IUserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v: string) => URL_REGEX.test(v),
      message: 'Invalid avatar link',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Invalid email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Incorrect email or password'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Incorrect email or password'));
          }
          return user;
        });
    });
});

export default model<IUser, IUserModel>('user', userSchema);
