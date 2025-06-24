import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

// Auth
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { AllRoles, UserToken } from '../auth/decorators';

// Services
import { MeService } from './me.service';

// Interface
import { IUserAuth } from '../../../src/commons/Interface';

// Interceptors
import { ResponseInterceptor } from 'src/commons/interceptors';

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
    summary: 'Get me.',
    description: 'this endpoint is for get me information.',
  })
  async getMe(@UserToken() me: IUserAuth) {
    const meInformation = await this.meService.getMe({ me });
    return {
      data: meInformation,
    };
  }
}
