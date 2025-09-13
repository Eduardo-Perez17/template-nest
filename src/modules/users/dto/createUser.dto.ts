import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

// Interface
import { IUser } from 'src/commons/Interface';

// Commons
import { ROLES } from 'src/commons/models';

export class CreateUserDto implements IUser {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(ROLES, { message: 'The role you are trying to use does not exist' })
  role: ROLES;
}

export class ResponseCreateUserDto extends CreateUserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: ROLES;
  otpCode: string;
  deleteAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
