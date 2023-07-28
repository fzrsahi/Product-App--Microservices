import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schema/product.schema';
import { RmqModule } from './../rmq/rmq.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    RmqModule,
    MongooseModule.forFeature([
      {
        name: 'Product',
        schema: ProductSchema,
      },
    ]),
  ],
})
export class ProductModule {}
