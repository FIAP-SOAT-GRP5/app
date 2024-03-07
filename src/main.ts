import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import env from './config/env';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = new DocumentBuilder()
		.setTitle('MS Order')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	app.use((req, res, next) => {
		res.set('X-Content-Type-Options', 'nosniff');
		res.removeHeader('X-Powered-By');
		next();
	});

	await app.listen(env.PORT || 3000);
	Logger.log(`Server running on port ${env.PORT || 3000}`);
}
bootstrap();
