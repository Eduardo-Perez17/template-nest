import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

// Services
import { MeService } from './me.service';

// Controller
import { MeController } from './me.controller';

// Entities
import { Register } from '../register/entities/register.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Register]) ],
  providers: [MeService],
  controllers: [MeController],
})
export class MeModule {}
