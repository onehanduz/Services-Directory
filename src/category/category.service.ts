import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    const categories = this.prisma.category.findMany();
    return categories;
  }

  getById(id: number) {
    const category = this.prisma.category.findFirst({ where: { id } });
    return category;
  }

  create(dto: CreateCategoryDto) {
    const category = this.prisma.category.create({
      data: {
        ...dto,
      },
    });
    return category;
  }

  update(id: number, dto: CreateCategoryDto) {
    const category = this.prisma.category.update({
      where: {
        id: id,
      },
      data: {
        ...dto,
      },
    });
    return category;
  }

  delete(id: number) {
    const category = this.prisma.category.delete({
      where: { id },
    });

    return {
      massage: 'Category deleted',
    };
  }
}
