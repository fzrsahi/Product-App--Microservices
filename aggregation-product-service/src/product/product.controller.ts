import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto, UpdateProductDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseImagePipe } from './pipe';
import { JwtAuthGuard } from './guard';
import { Request } from 'express';
import { GetUser } from 'src/decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: ProductDto,
    @UploadedFile(ParseImagePipe)
    image: Express.Multer.File,
    @GetUser('sub') userId: string,
  ) {
    return this.productService.create(dto, image, userId);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  update(
    @GetUser('sub') userId,
    @Param('id') productId: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile(ParseImagePipe)
    image: Express.Multer.File,
  ) {
    return this.productService.update(productId, dto, image, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') productId: string, @GetUser('sub') userId: string) {
    return this.productService.remove(productId, userId);
  }
}
