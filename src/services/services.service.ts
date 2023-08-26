import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServicesDto, EditServicesDto } from './dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const services = await this.prisma.service.findMany();
    return services;
  }

  async getById(id: number) {
    const service = await this.prisma.service.findUnique({
      where: {
        id,
      },
    });
    return service;
  }

  async create(user_id: number, dto: CreateServicesDto) {
    const service = await this.prisma.service.create({
      data: {
        ...dto,
        user_id,
      },
    });
    return service;
  }

  async edit(id: number, user_id: number, dto: EditServicesDto) {
    const checkUserservice = this.prisma.service.findUnique({
      where: {
        id,
        user_id,
      },
    });
    if (!checkUserservice) throw new ForbiddenException('Credential error');
    const service = this.prisma.service.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
    return service;
  }

  delete(id: number, user_id: number) {
    const checkUserservice = this.prisma.service.findUnique({
      where: {
        id,
        user_id,
      },
    });
    if (!checkUserservice) throw new ForbiddenException('Credential error');
    this.prisma.service.delete({ where: { id } });
    return {
      massage: 'Service deleted',
    };
  }
}
