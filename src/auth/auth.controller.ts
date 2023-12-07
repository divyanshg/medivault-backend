import { Request, Response } from 'express';

import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Roles } from '../decorators/roles/roles.decorator';
import { AuthGuard } from '../guards/jwt.guard';
import { NotificationsService } from '../notifications/notifications.service';
import { AuthService } from './auth.service';
import { VerifyOTP_DTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationsService,
    private readonly config: ConfigService,
  ) {}

  @Post('sendOTP')
  async sendOtp(@Req() req: Request) {
    const { phoneNumber } = req.body;
    const { verificationUUID } =
      await this.notificationService.generateAndSendOtp(phoneNumber);
    return {
      message: 'OTP sent',
      verificationUUID,
    };
  }

  @Post('verifyOTP')
  async verifyOTP(@Body() body: VerifyOTP_DTO, @Res() res: Response) {
    try {
      const data = await this.authService.verifyOTP(
        body.verificationUUID,
        body.code,
      );

      if (data.error) return res.json(data);
      //set cookie
      const cookie_name = this.config.get<string>('JWT_COOKIE_NAME');
      res.cookie(cookie_name, data.access_token, {
        httpOnly: true,
        secure: this.config.get<string>('NODE_ENV') === 'production',
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { access_token, ...rest } = data;

      return res.json({
        message: 'OTP verified',
        ...rest,
      });
    } catch (e) {
      return e.message;
    }
  }

  @Roles('user')
  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    const user = await this.authService.getUser(req.user.sub);
    console.log(user);
    return user;
  }
}
