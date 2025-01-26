import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

// Entities
import { Register } from './entities/register.entity';

// Services
import { RegisterService } from './register.service';

// Dto
import { CreateRegisterDto } from './dto';

// Decorators
import { AllRoles, Roles, UserToken } from '../auth/decorators';

// Interface
import { IUserAuth } from '../../commons/Interface';

// Auth
import { JwtAuthGuard, RolesGuard } from '../auth/guards';

// Interceptors
import { ResponseInterceptor } from '../../commons/interceptors';

// Models
import { ROLES } from '../../commons/models';
import { UpdateRegisterDto } from './dto/updateRegister.dto';

@ApiTags('Register')
@ApiBearerAuth()
@Controller('register')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ResponseInterceptor)
export class RegisterController {
  constructor(private readonly registerServices: RegisterService) {}

  @ApiOperation({
    summary: 'Create register.',
    description: 'this endpoint is for create a register.',
  })
  @ApiBody({
    type: CreateRegisterDto,
    description: 'The fields to be created.',
  })
  @Post()
  @AllRoles()
  createRegister(@Body() body: CreateRegisterDto, @UserToken() me: IUserAuth) {
    return this.registerServices.createRegister({ body, me });
  }

  @ApiOperation({
    summary: 'Get all register.',
    description: 'this endpoint is for return all register.',
  })
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  @Get()
  getAllRegisters(): Promise<{ data: Register[]; count: number }> {
    return this.registerServices.getAllRegisters();
  }

  @ApiOperation({
    summary: 'Get register by id.',
    description: 'This endpoint is to bring a register through the id.',
  })
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  @Get(':id')
  getUserById(@Param('id') id: string): Promise<Register> {
    return this.registerServices.getIdRegister({ id });
  }

  @ApiOperation({
    summary: 'Edit register.',
    description: 'This endpoint is for editing the register.',
  })
  @ApiBody({
    type: UpdateRegisterDto,
    description: 'The fields to be edit register.',
  })
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  @Patch(':id')
  editUser(
    @Param('id') id: string,
    @Body() body: UpdateRegisterDto,
  ): Promise<Register> {
    return this.registerServices.editRegister({ id, body });
  }

  @ApiOperation({
    summary: 'Delete register.',
    description: 'This endpoint is for delete the register.',
  })
  @Delete(':id')
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  deleteUser(@Param('id') id: string): Promise<Register> {
    return this.registerServices.deleteRegister({ id });
  }
}
