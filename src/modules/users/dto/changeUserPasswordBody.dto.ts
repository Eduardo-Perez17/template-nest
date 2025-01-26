import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeUserPasswordBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 'Qwerty1$' })
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '2134' })
  readonly otpCode: string;
}
