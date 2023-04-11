import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDTO } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async register(auth: AuthDTO) {
    try {
      const hashedPassword = await argon.hash(auth.password);
      const user = await this.prismaService.user.create({
        data: {
          email: auth.email,
          hashedPassword,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      return user;
    } catch (error) {
      return { error };
    }
  }
  async login(auth: AuthDTO) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: auth.email,
        },
      });
      if (!user) {
        throw new ForbiddenException('User not found');
      }
      const passwordMatched = await argon.verify(
        user.hashedPassword,
        auth.password,
      );
      if (!passwordMatched) {
        throw new ForbiddenException('Email or password is incorrect');
      }
      delete user.hashedPassword;
      return await this.signJwtToken(user.id, user.email);
    } catch (error) {
      return { error };
    }
  }

  async signJwtToken(userId: number, email: string): Promise<any> {
    const payload = {
      sub: userId,
      email,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT_EXPIRE_IN'),
      secret: this.configService.get('JWT_SECRET'),
    });
    return {
      accessToken,
    };
  }
}
