import { Module } from '@nestjs/common';
import { RmqModule } from './rmq/rmq.module';
import { ConfigModule } from '@nestjs/config';
import { MinioClientModule } from './minio/minio.module';

@Module({
  imports: [
    MinioClientModule,
    RmqModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
