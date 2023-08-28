import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServicesDto, EditServicesDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guards';

@UseGuards(JwtGuard)
@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}
  @Get()
  getAll() {
    return this.servicesService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.getById(id);
  }

  @Post()
  create(@GetUser('id') user_id: number, @Body() dto: CreateServicesDto) {
    return this.servicesService.create(user_id, dto);
  }

  @Patch(':id')
  edit(
    @Body() dto: EditServicesDto,
    @GetUser('id') user_id: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.servicesService.edit(id, user_id, dto);
  }

  @Delete(':id')
  delete(
    @GetUser('id') user_id: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.servicesService.delete(id, user_id);
  }
}
