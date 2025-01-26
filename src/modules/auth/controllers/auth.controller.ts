import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

// Strategies
import { LOCAL_STRATEGY } from '../strategies/local.strategy';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard(LOCAL_STRATEGY))
  @Post('login')
  login(@Req() req: Request) {
    return req.user;
  }
}
