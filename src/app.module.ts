import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Services
import { AuthService } from './modules/auth/services/auth/auth.service';

// Module
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';

// Web Socket
import { WebSocketModule } from './websocket/websocket.module'

// Config
import { configSchema } from '../config/validationSchema';
import { enviroments } from '../enviroments';
import { RegisterModule } from './modules/register/register.module';
import config from '../config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.dev.env',
      load: [config],
      isGlobal: true,
      validationSchema: configSchema,
    }),
    UserModule,
    DatabaseModule,
    AuthModule,
    JwtModule,
    WebSocketModule,
    RegisterModule,
  ],
  controllers: [],
  providers: [AuthService],
})
export class AppModule {}
