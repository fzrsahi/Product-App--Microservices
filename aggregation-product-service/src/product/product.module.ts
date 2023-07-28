import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { RmqModule } from 'src/rmq/rmq.module';
import { MINIO_SERVICE, PRODUCT_SERVICE, USER_SERVICE } from 'src/constants';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        global: true,
      }),
    }),
    RmqModule.register({
      name: PRODUCT_SERVICE,
    }),
    RmqModule.register({
      name: MINIO_SERVICE,
    }),
    RmqModule.register({
      name: USER_SERVICE,
    }),
  ],
})
export class ProductModule {}
