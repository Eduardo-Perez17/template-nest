import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';

// Entities
import { User } from '../../users/entities/user.entity';

// Strategies
import { LOCAL_STRATEGY } from '../strategies/local.strategy';

@ApiTags('Auth')
@Controller('auth')
@Throttle({ default: { limit: 1000, ttl: 3600000 } })
export class AuthController {
  @UseGuards(AuthGuard(LOCAL_STRATEGY))
  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user with email and password.',
  })
  @ApiResponse({
    status: 201,
    description: 'User authenticated successfully.',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials.',
  })
  login(@Req() req: Request) {
    return req.user;
  }
}
