import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema';
import * as mongosee from 'mongoose';
import * as bcrypt from 'bcrypt';

interface UserData {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: mongosee.Model<User>,
  ) {}

  async createUser(data: UserData) {
    const hash = await bcrypt.hash(data.password, 10);
    data.password = hash;
    try {
      const createUser = await this.userModel.create(data);
      createUser.password = null;
      return {
        statusCode: 201,
        message: 'Success Create Account',
        data: createUser,
      };
    } catch (error) {
      if (error.code === 11000) {
        try {
          throw new BadRequestException({
            statusCode: 400,
            message: 'Username or Email Already Exist!',
          });
        } catch (error) {
          return error;
        }
      }
      return error;
    }
  }

  async loginUser(data: UserData) {
    let user = await this.userModel.findOne({
      username: data.username,
    });

    if (!user) {
      return null;
    }

    const pwMatches = await bcrypt.compare(data.password, user.password);
    if (!pwMatches) {
      return null;
    }

    user.password = null;

    return user;
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(
      { _id: id },
      {
        password: 0,
        email: 0,
      },
    );
    if (!user) return null;

    return user;
  }

  // Every String can be casted in ObjectId now
}
