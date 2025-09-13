import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// Module
import { AppModule } from './app.module';

// Librerias
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Teachers Survey API')
    .setDescription(
      'This API powers the Teachers Survey platform, allowing students to evaluate teachers through structured surveys. ' +
        'It provides endpoints for authentication, user management (students & teachers), surveys, responses, and results analysis.',
    )
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter a valid JWT token to access protected routes',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
