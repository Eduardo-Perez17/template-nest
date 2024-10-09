import { PartialType } from '@nestjs/swagger';

// DTO'S
import { CreateUserDto } from './createUser.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
