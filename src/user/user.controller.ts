import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guards';
import { UserService } from './user.service';
import { EditUserDto } from './dto';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  user(@GetUser() user: User) {
    return user;
  }
  @Patch('edit')
  edit(@Body() dto: EditUserDto, @GetUser('id') userId: number) {
    return this.userService.edit(userId, dto);
  }
}
