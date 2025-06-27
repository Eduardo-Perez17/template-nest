import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeUserPasswordBodyDto {
  @ApiProperty({ description: 'Current password' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ description: 'New password' })
  @IsString()
  @MinLength(6)
  newPassword: string;

  @ApiProperty({ description: 'Email or username' })
  @IsString()
  emailOrUserName: string;
}
