import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './schema/auth.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { USER_PERSISTANCE_SERVICE } from 'src/constant';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: mongoose.Model<User>,
    private readonly config: ConfigService,
    private JwtService: JwtService,
    @Inject(USER_PERSISTANCE_SERVICE) private userClient: ClientProxy,
  ) {}

  async register(dto: RegisterDto) {
    const createUser$ = this.userClient.send('create_user', dto);
    const response: any = await firstValueFrom(createUser$);

    try {
      if (response.statusCode === 201) {
        return response;
      } else if (!response.statusCode && response.status == 400) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Username or Email Already Exist!',
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const loginUser$ = this.userClient.send('login_user', dto);
    const response = await firstValueFrom(loginUser$);

    try {
      if (!response) {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Account Not Found!',
        });
      }
      const token = await this.getToken(response._id, response.username);

      return {
        statusCode: 200,
        message: 'Login Success',
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  async getToken(userId: string, username: string): Promise<string> {
    const accessToken = this.JwtService.signAsync(
      {
        sub: userId,
        username,
      },
      {
        expiresIn: '1d',
        secret: this.config.get('SECRET_KEY'),
      },
    );
    return accessToken;
  }
}
