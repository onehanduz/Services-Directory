import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards';
import { ServicesService } from './services.service';
import { CreateServicesDto, EditServicesDto } from './dto';
import { GetUser } from 'src/auth/decorator';

UseGuards(JwtGuard);
@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}
  @Get()
  getAll() {
    return this.servicesService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.servicesService.getById(id);
  }

  @Post()
  create(@Body() dto: CreateServicesDto, @GetUser('id') user_id: number) {
    return this.servicesService.create(user_id, dto);
  }

  @Patch(':id')
  edit(
    @Body() dto: EditServicesDto,
    @GetUser('id') user_id: number,
    @Param('id') id: number,
  ) {
    return this.servicesService.edit(id, user_id, dto);
  }

  @Delete(':id')
  delete(@GetUser('id') user_id: number, @Param('id') id: number) {
    return this.servicesService.delete(id, user_id);
  }
}
