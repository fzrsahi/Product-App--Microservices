import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema';
import mongoose from 'mongoose';

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  userId: string;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: mongoose.Model<Product>,
  ) {}

  async createProduct(data: ProductData) {
    try {
      await this.productModel.create({
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.imageUrl,
        userId: data.userId,
      });
    } catch (error) {
      console.error(data);
    }
  }

  async getAllProducts() {
    try {
      const products = await this.productModel.find();
      return products;
    } catch (error) {
      console.error(error);
    }
  }

  async getProductById(id: any) {
    try {
      const product = await this.productModel.findOne({
        _id: id,
      });

      return product;
    } catch (error) {
      console.error(error);
    }
  }

  async updateProduct(data: ProductData) {
    try {
      await this.productModel.updateOne(
        {
          _id: data.id,
        },
        {
          $set: {
            name: data.name,
            description: data.description,
            image: data.imageUrl,
            price: data.price,
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  }

  async deleteProduct(id: string) {
    try {
      await this.productModel.deleteOne({
        _id: id,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
