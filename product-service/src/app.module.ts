import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RmqModule } from './rmq/rmq.module';

@Module({
  imports: [
    ProductModule,
    RmqModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URI, {
      dbName: process.env.DATABASE_NAME,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
