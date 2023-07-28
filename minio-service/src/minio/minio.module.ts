import { Module } from '@nestjs/common';
import { MinioClientService } from './minio.service';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioController } from './minio.controller';
import { RmqModule } from 'src/rmq/rmq.module';

@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [ConfigModule, RmqModule],
      useFactory: async (configService: ConfigService) => ({
        endPoint: configService.get('MINIO_ENDPOINT'),
        port: parseInt(configService.get('MINIO_PORT')),
        useSSL: false,
        accessKey: configService.get('MINIO_ACCESS_KEY'),
        secretKey: configService.get('MINIO_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    RmqModule,
  ],
  providers: [MinioClientService],
  exports: [MinioClientService],
  controllers: [MinioController],
})
export class MinioClientModule {}
export { MinioModule };
