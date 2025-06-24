import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// Module
import { AppModule } from './app.module';

// Librerias
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan(process.env.NODE_ENV));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Glamofy API')
    .setDescription(
      'API para una aplicación de conexión entre profesionales de la belleza (barberos, manicuristas, peluquer@s) y clientes. Permite crear perfiles profesionales, buscar servicios cercanos mediante geolocalización, agendar citas, recibir calificaciones y ofrecer servicios a domicilio o en local.',
    )
    .setVersion('1.0')
    .addTag('Autenticación')
    .addTag('Usuarios')
    .addTag('Profesionales')
    .addTag('Servicios')
    .addTag('Reservas')
    .addTag('Ubicación')
    .addTag('Reputación')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  await app.listen(process.env.APP_PORT);
}
bootstrap();
