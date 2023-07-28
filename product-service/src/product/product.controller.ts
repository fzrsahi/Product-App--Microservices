import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from './../rmq/rmq.service';

@Controller()
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('create_product')
  createProduct(@Payload() data, @Ctx() context: RmqContext) {
    console.log(data);

    this.productService.createProduct(data);
    this.rmqService.ack(context);
  }

  @EventPattern('get_all_data')
  getAllProduct(@Payload() data: any, @Ctx() context) {
    const products = this.productService.getAllProducts();
    this.rmqService.ack(context);
    return products;
  }

  @EventPattern('get_data_by_id')
  async getProductById(@Payload() data: any, @Ctx() context) {
    const product = await this.productService.getProductById(data);
    this.rmqService.ack(context);
    return product;
  }

  @EventPattern('update_product')
  updateProduct(@Payload() data: any, @Ctx() context) {
    const product = this.productService.updateProduct(data);
    this.rmqService.ack(context);
    return product;
  }

  @EventPattern('delete_product_by_id')
  deleteProduct(@Payload() data: any, @Ctx() context) {
    this.productService.deleteProduct(data);
    this.rmqService.ack(context);
  }
}
