import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  ParseFilePipeBuilder,
} from '@nestjs/common';

export class ParseImagePipe extends ParseFilePipe {
  constructor() {
    super({
      fileIsRequired: false,
      validators: [
        new FileTypeValidator({
          fileType: '.(png|jpeg|jpg)',
        }),
        new MaxFileSizeValidator({
          maxSize: 1024 * 1024 * 4,
          message(maxSize) {
            return 'Validation failed (expected size is less than 5 Mb)';
          },
        }),
      ],
    });
  }
}
