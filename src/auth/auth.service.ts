import { Cache } from 'cache-manager';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { UsersService } from '../users/users.service';

interface verifyOTPResponse {
  access_token: string;
  user?: User;
  newUser?: boolean;
}

interface ErrorResponse {
  error: string;
  code: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async verifyOTP(verificationUUID: string, code: string): Promise<any> {
    const cachedCode = await this.cacheManager.get(verificationUUID);
    if (cachedCode !== Number(code)) {
      return {
        error: 'Invalid OTP',
        code: 401,
      };
    }

    const parts = verificationUUID.split('-');
    const phoneNumber = parts[parts.length - 1];

    const user: User = await this.userService.findOne(phoneNumber);

    const access_token = await this.generateToken(user);

    //delete otp from cache
    await this.cacheManager.del(verificationUUID);

    return {
      access_token,
      ...(user ? { user } : { newUser: true }),
    };
  }

  private async generateToken(user: User | null) {
    const payload = {
      ...(!user
        ? { new_user: true }
        : {
            email: user.email,
            sub: user.id,
            role: user.role,
          }),
    };
    try {
      const token = await this.jwtService.signAsync(payload);
      return token;
    } catch (e) {
      console.log(e);
      throw new Error('Error generating token');
    }
  }

  async getUser(id: string): Promise<User> {
    return await this.userService.findOneById(id);
  }
}
