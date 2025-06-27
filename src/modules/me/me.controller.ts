import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  Body,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

// Auth
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { AllRoles, UserToken } from '../auth/decorators';

// Services
import { MeService } from './me.service';

// Commons
import { ResponseInterceptor } from 'src/commons/interceptors';
import { IUserAuth } from '../../../src/commons/Interface';

// Entities
import { User } from '../users/entities/user.entity';

// Dto's
import { UpdateUserDto } from '../users/dto/updateUser.dto';
import { ChangeUserPasswordBodyDto } from './dto';

@ApiTags('Me')
@ApiBearerAuth()
@Controller('me')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ResponseInterceptor)
@Throttle({ default: { limit: 1000, ttl: 3600000 } })
export class MeController {
  constructor(private readonly meService: MeService) {}

  @AllRoles()
  @Get()
  @ApiOperation({
    summary: 'Get authenticated user information',
    description:
      'This endpoint returns the information of the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully.',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  async getMe(@UserToken() me: IUserAuth) {
    const meInformation = await this.meService.getMe({ me });
    return {
      data: meInformation,
    };
  }

  @AllRoles()
  @Patch()
  @ApiOperation({
    summary: 'Update authenticated user information',
    description:
      'This endpoint allows updating the information of the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data for update.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  async updateMe(@UserToken() me: IUserAuth, @Body() body: UpdateUserDto) {
    const updatedUser = await this.meService.updateMe({ me, body });
    return {
      data: updatedUser,
    };
  }

  @AllRoles()
  @Patch('change-password')
  @ApiOperation({
    summary: 'Change authenticated user password',
    description:
      'This endpoint allows the authenticated user to change their password using their email or username, current password, and new password.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or current password is incorrect.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  async changePasswordMe(
    @UserToken() me: IUserAuth,
    @Body() body: ChangeUserPasswordBodyDto,
  ) {
    const updatedUser = await this.meService.changePasswordMe({ me, body });
    return {
      data: updatedUser,
    };
  }
}
