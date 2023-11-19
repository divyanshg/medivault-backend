import { Request, Response } from 'express';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';

import { NotificationsModule } from '../notifications/notifications.module';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { VerifyOTP_DTO } from './dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let notificationService: NotificationsService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        UsersModule,
        NotificationsModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: configService.get<string>('EXPIRES_IN') },
          }),
          inject: [ConfigService],
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    notificationService =
      module.get<NotificationsService>(NotificationsService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('sendOtp', () => {
    it('should send OTP successfully', async () => {
      const phoneNumber = '1234567890';
      const req = { body: { phoneNumber } } as Request;
      const verificationUUID = 'UUID123';
      jest
        .spyOn(notificationService, 'generateAndSendOtp')
        .mockResolvedValue({ message: 'OTP sent', verificationUUID });

      const response = await controller.sendOtp(req);
      expect(response).toEqual({ message: 'OTP sent', verificationUUID });
    });
  });

  describe('verifyOTP', () => {
    it('should verify OTP successfully and set a cookie', async () => {
      const verificationUUID = 'UUID123';
      const code = '123456';
      const body: VerifyOTP_DTO = { verificationUUID, code };
      const res = {
        cookie: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;
      const authServiceResult = {
        access_token: 'your_access_token',
        user: { id: 1, name: 'John Doe' },
      };

      jest.spyOn(authService, 'verifyOTP').mockResolvedValue(authServiceResult);

      const response = await controller.verifyOTP(body, res);

      expect(response).toEqual({
        message: 'OTP verified',
        user: { id: 1, name: 'John Doe' },
      });
      expect(res.cookie).toHaveBeenCalledWith(
        'JWT_COOKIE_NAME',
        'your_access_token',
        {
          httpOnly: true,
          secure: false, // Change this to match your environment
        },
      );
      expect(res.json).toHaveBeenCalledWith({
        message: 'OTP verified',
        user: { id: 1, name: 'John Doe' },
      });
    });

    it('should handle verification errors', async () => {
      const verificationUUID = 'UUID123';
      const code = '123456';
      const body: VerifyOTP_DTO = { verificationUUID, code };
      const res = {
        cookie: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;
      const errorMessage = 'Verification error';

      jest
        .spyOn(authService, 'verifyOTP')
        .mockRejectedValue(new Error(errorMessage));

      const response = await controller.verifyOTP(body, res);

      expect(response).toEqual({ error: errorMessage, code: 401 });
      expect(res.cookie).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage, code: 401 });
    });
  });

  describe('me', () => {
    it('should return user information', async () => {
      const req = { user: { sub: '123' } } as Partial<Request>;
      const user: Partial<User> = {
        id: '123',
        email: 'test@mail.com',
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(authService, 'getUser').mockResolvedValue(user as User);

      const response = await controller.me(req as Request);
      expect(response).toEqual(user);
    });
  });
});
