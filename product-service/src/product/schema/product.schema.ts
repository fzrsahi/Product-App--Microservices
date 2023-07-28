import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({})
export class Product {
  @Prop({
    required: true,
  })
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  price: string;

  @Prop()
  userId: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
