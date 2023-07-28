import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RmqModule } from './rmq/rmq.module';
import { ProductModule } from './product/product.module';
import * as Joi from 'joi';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  providers: [],
  controllers: [],
  imports: [
    RmqModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_PRODUCT_QUEUE: Joi.string().required(),
      }),
    }),
    ProductModule,
  ],
})
export class AppModule {}
