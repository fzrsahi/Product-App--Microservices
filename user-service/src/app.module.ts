import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { RmqModule } from './rmq/rmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        uri: config.get('DATABASE_URI'),
      }),
      inject: [ConfigService],
    }),
    RmqModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
