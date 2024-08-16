import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { initializeDataSource } from './database/data-source';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { SeederService } from './database/seeders/seeder.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  try {
    await initializeDataSource();
    console.log('Data Source has been initialized!');

    const seederService = app.get(SeederService);
    const seedResult = await seederService.seedUsers();
    console.log(seedResult);
  } catch (error) {
    console.error('Error during Data Source initialization', error);
    process.exit(1);
  }
  app.enable('trust proxy');
  app.enableCors();
  app.setGlobalPrefix('api/v1', { exclude: ['api/docs'] });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  
  const options = new DocumentBuilder()
    .setTitle('Write-Up API Documentation')
    .setDescription('API documentation for Write-Up CMS app')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  const port =
    app.get<ConfigService>(ConfigService).get<number>('PORT') || 3000;
  await app.listen(port);

  console.log({
    message: 'server started 🚀',
    port,
    server_url: `http://localhost:${port}/api/v1`,
    swagger_docs_url: `http://localhost:${port}/api/docs`,
  });
}
bootstrap().catch(error => {
  console.error('Error while boostraping', error);
  process.exit(1);
});
