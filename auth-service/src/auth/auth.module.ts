import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/auth.schema';
import { RmqModule } from 'src/rmq/rmq.module';
import { USER_PERSISTANCE_SERVICE } from 'src/constant';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    JwtModule.register({}),
    RmqModule.register({
      name: USER_PERSISTANCE_SERVICE,
    }),
  ],
})
export class AuthModule {}
