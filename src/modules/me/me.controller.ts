import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

// Auth
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { AllRoles, UserToken } from '../auth/decorators';

// Services
import { MeService } from './me.service';

// Interface
import { IUserAuth } from '../../../src/commons/Interface';

@ApiTags('Me')
@ApiBearerAuth()
@Controller('me')
@UseGuards(JwtAuthGuard, RolesGuard)
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
