import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// Services
import { UserService } from './user.service';

// DTO'S
import { CreateUserDto, ResponseCreateUserDto } from './dto/createUser.dto';

// Guards
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

// Decorators
import { Roles } from '../auth/decorators/roles.decorator';

// Commons
import { ROLES } from '../../commons/models';

// Interceptors
import { ResponseInterceptor } from '../../commons/interceptors';

// Entities
import { User } from './entities/user.entity';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ResponseInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Create user.',
    description: 'this endpoint is for create a user.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'The fields to be created.',
  })
  @ApiResponse({
    status: 201,
    type: () => ResponseCreateUserDto,
    description: 'create user successfully.',
  })
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Get all users.',
    description: 'this endpoint is for return all users.',
  })
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }
}
