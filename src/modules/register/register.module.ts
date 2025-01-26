import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import { RegisterService } from './register.service';
import { UserService } from '../users/user.service';

// Controller
import { RegisterController } from './register.controller';

// Entities
import { Register } from './entities/register.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Register, User])],
  providers: [RegisterService, UserService],
  controllers: [RegisterController],
})
export class RegisterModule {}
