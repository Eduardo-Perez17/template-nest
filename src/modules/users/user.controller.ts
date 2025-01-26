import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// Services
import { UserService } from './user.service';

// DTO'S
import { CreateUserDto, ResponseCreateUserDto } from './dto/createUser.dto';

// Guards
import { JwtAuthGuard, RolesGuard } from '../auth/guards';

// Decorators
import { Roles } from '../auth/decorators/roles.decorator';

// Commons
import { ROLES } from '../../commons/models';

// Interceptors
import { ResponseInterceptor } from '../../commons/interceptors';

// Interface
import { IUserAuth } from 'src/commons/Interface';

// Entities
import { User } from './entities/user.entity';

// Dto's
import { ChangeUserPasswordBodyDto, UpdateUserDto } from './dto';

// Decorators
import { AllRoles, IsPublic, UserToken } from '../auth/decorators';

@ApiTags('User')
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
  @IsPublic()
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

  @ApiOperation({
    summary: 'Change user password.',
    description: 'this endpoint is for change user password.',
  })
  @ApiBody({
    type: ChangeUserPasswordBodyDto,
    description: 'The fields to change the password.',
  })
  @IsPublic()
  @Patch('/changePassword')
  changePassword(
    @Body() body: ChangeUserPasswordBodyDto,
    @UserToken() me: IUserAuth,
  ): Promise<User> {
    return this.userService.changePassword({ body, me });
  }

  @ApiOperation({
    summary: 'Get user by id.',
    description: 'This endpoint is to bring a user through the id.',
  })
  @ApiOkResponse({
    type: User,
    description: 'get user successfully.',
  })
  @AllRoles()
  @Get(':id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById({ id });
  }

  @ApiOperation({
    summary: 'Edit user.',
    description: 'This endpoint is for editing the user.',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'The fields to be edit user.',
  })
  @ApiOkResponse({
    type: User,
    description: 'Edit user successfully.',
  })
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  @Patch(':id')
  editUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.userService.editUser({ id, body });
  }

  @ApiOperation({
    summary: 'Delete user.',
    description: 'This endpoint is for delete the user.',
  })
  @Delete(':id')
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  deleteUser(@Param('id') id: string): Promise<User> {
    return this.userService.deleteUser({ id });
  }
}
