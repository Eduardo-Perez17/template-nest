import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

// Services
import { AuthService } from './modules/auth/services/auth/auth.service';

// Module
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MeModule } from './modules/me/me.module';

// Config
import { configSchema } from '../config/validationSchema';
import { enviroments } from '../enviroments';
import config from '../config/config';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 60000,
        limit: 100,
      },
      {
        name: 'long',
        ttl: 3600000,
        limit: 1000,
      },
    ]),
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
    MeModule,
  ],
  controllers: [],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
