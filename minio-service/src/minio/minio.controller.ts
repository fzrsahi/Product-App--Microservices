import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { MinioService } from 'nestjs-minio-client';
import { RmqService } from 'src/rmq/rmq.service';
import { MinioClientService } from './minio.service';

@Controller('minio')
export class MinioController {
  constructor(
    private minioService: MinioClientService,
    private rmqService: RmqService,
  ) {}

  @EventPattern('send_image')
  async uploadImage(@Payload() data: any, @Ctx() context: RmqContext) {
    const imageUrl = await this.minioService.upload(data);
    return imageUrl;
  }

  @EventPattern('delete_image_by_name')
  deleteImageByName(@Payload() imageName: string, @Ctx() context: RmqContext) {
    this.minioService.delete(imageName);
    this.rmqService.ack(context);
  }
}
