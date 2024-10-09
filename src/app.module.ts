import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Controllers
import { AppController } from './app.controller';

// Services
import { AuthService } from './modules/auth/services/auth/auth.service';
import { AppService } from './app.service';

// Module
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

// Config
import { configSchema } from '../config/validationSchema';
import { enviroments } from '../enviroments';
import config from '../config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.dev.env',
      load: [config],
      isGlobal: true,
      validationSchema: configSchema,
    }),
    UsersModule,
    DatabaseModule,
    AuthModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
