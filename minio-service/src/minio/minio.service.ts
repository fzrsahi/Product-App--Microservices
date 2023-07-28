import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioClientService {
  private readonly logger: Logger;
  private readonly bucketName = process.env.MINIO_BUCKET_NAME;
  constructor(
    private readonly minio: MinioService,
    private config: ConfigService,
  ) {
    this.logger = new Logger('MinioService');
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: [
            's3:ListBucketMultipartUploads',
            's3:GetBucketLocation',
            's3:ListBucket',
          ],
          Resource: [`arn:aws:s3:::${config.get('MINIO_BUCKET_NAME')}`], // Change this according to your bucket name
        },
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: [
            's3:PutObject',
            's3:AbortMultipartUpload',
            's3:DeleteObject',
            's3:GetObject',
            's3:ListMultipartUploadParts',
          ],
          Resource: [`arn:aws:s3:::${config.get('MINIO_BUCKET_NAME')}/*`], // Change this according to your bucket name
        },
      ],
    };
    this.client.setBucketPolicy(
      process.env.MINIO_BUCKET_NAME,
      JSON.stringify(policy),
      function (err) {
        if (err) throw err;

        console.log('Bucket policy set');
      },
    );
  }

  get client() {
    return this.minio.client;
  }

  async upload(file: any, bucketName: string = this.bucketName) {
    try {
      if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
        throw new HttpException(
          'File type not supported',
          HttpStatus.BAD_REQUEST,
        );
      }
      const timestamp = Date.now().toString();
      const hashedFileName = crypto
        .createHash('md5')
        .update(timestamp)
        .digest('hex');
      const extension = file.originalname.substring(
        file.originalname.lastIndexOf('.'),
        file.originalname.length,
      );
      const metaData = {
        'Content-Type': file.mimetype,
      };
      // We need to append the extension at the end otherwise Minio will save it as a generic file
      const fileName = hashedFileName + extension;
      this.client.putObject(
        bucketName,
        fileName,
        Buffer.from(file.buffer.data),
        metaData,
        function (err, res) {
          if (err) {
            console.log(err.message);
            throw new HttpException(
              'Error uploading file',
              HttpStatus.BAD_REQUEST,
            );
          }
        },
      );

      const imageUrl = `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${fileName}`;
      return imageUrl;
    } catch (error) {
      throw error;
    }
  }

  async delete(objectName: string, bucketName: string = this.bucketName) {
    try {
      this.client.removeObject(bucketName, objectName, function (err, res) {
        if (err)
          throw new HttpException(
            'An error occured when deleting!',
            HttpStatus.BAD_REQUEST,
          );
      });
    } catch (error) {
      throw error;
    }
  }
}
