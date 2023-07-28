import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MINIO_SERVICE, PRODUCT_SERVICE, USER_SERVICE } from 'src/constants';
import { ProductDto, UpdateProductDto } from './dto';
import { firstValueFrom } from 'rxjs';

interface Product {
  id?: string;
  name?: string;
  description?: string;
  image?: string;
  price?: number;
  userId?: string;
}

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_SERVICE) private productClient: ClientProxy,
    @Inject(MINIO_SERVICE) private minioClient: ClientProxy,
    @Inject(USER_SERVICE) private userClient: ClientProxy,
  ) {}

  async create(dto: ProductDto, image: Express.Multer.File, userId: string) {
    const imageUrl$ = this.minioClient.send('send_image', image);
    const imageUrl = await firstValueFrom(imageUrl$);
    const data = { ...dto, imageUrl, userId };
    await this.productClient.emit('create_product', data);

    return {
      statusCode: 201,
      message: 'Success Create Product',
      data,
    };
  }

  async findAll() {
    const products$ = this.productClient.send('get_all_data', {});
    const products = await firstValueFrom(products$);
    return {
      statusCode: 200,
      message: 'Success Get All data',
      data: products,
    };
  }

  async findOne(id: string) {
    const product$$ = this.productClient.send('get_data_by_id', id);
    const product = await firstValueFrom(product$$);

    const user$ = this.userClient.send('get_user_by_id', product.userId);
    const user = await firstValueFrom(user$);

    const data = { ...product, ...user };
    return {
      statusCode: 200,
      message: `Success Get Product Id : ${id}`,
      data,
    };
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    image: Express.Multer.File,
    userId: string,
  ) {
    const product$ = this.productClient.send('get_data_by_id', id);
    const currentProduct: Product = await firstValueFrom(product$);

    if (userId != currentProduct.userId) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'This is not your product',
      });
    }
    const imageUrl = await this.handleImageUrl(image, currentProduct);

    dto = this.handleDto(dto, currentProduct);

    const data = { id, ...dto, imageUrl };

    await this.productClient.emit('update_product', data);

    return {
      statusCode: 201,
      message: `Success Update Product Id : ${id}`,
    };
  }

  async remove(id: string, userId: string) {
    const product$$ = this.productClient.send('get_data_by_id', id);
    const product: Product = await firstValueFrom(product$$);

    if (userId != product.userId) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'This is not your product',
      });
    }
    this.productClient.emit('delete_product_by_id', id);

    return {
      statusCode: 200,
      message: `Success Delete Product Id : ${id}`,
    };
  }

  async handleImageUrl(image, currentProduct) {
    let imageUrl;

    if (!image) {
      imageUrl = currentProduct.image;
    } else {
      const newImageUrl$ = this.minioClient.send('send_image', image);
      const newImageUrl = await firstValueFrom(newImageUrl$);
      const imageName = currentProduct.image.substring(
        currentProduct.image.lastIndexOf('/') + 1,
      );
      this.minioClient.emit('delete_image_by_name', imageName);
      imageUrl = newImageUrl;
    }

    return imageUrl;
  }

  handleDto(dto, currentProduct) {
    let name;
    if (!dto.name) {
      name = currentProduct.name;
    } else {
      name = dto.name;
    }

    let description;
    if (!dto.description) {
      description = currentProduct.description;
    } else {
      description = dto.description;
    }

    let price;
    if (!dto.price) {
      price = currentProduct.price;
    } else {
      price = dto.price;
    }

    return { name, description, price };
  }
}
