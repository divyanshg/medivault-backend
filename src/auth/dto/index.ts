import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOTP_DTO {
  @IsNotEmpty()
  @IsString()
  verificationUUID: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
