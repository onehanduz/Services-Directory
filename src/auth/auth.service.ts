import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async signup(dto: AuthDto) {
    const hash = await argon2.hash(dto.password);
    const userCheckEmail = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (userCheckEmail) throw new ForbiddenException('Email is alrady used');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
    });
    return this.signToken(user.id, user.email);
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('email or password wrong');

    const hash = await argon2.verify(user.hash, dto.password);
    if (!hash) throw new ForbiddenException('email or password wrong');

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
