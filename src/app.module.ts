import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDbConfig } from './config/database';
import { AdapterModule } from './adapter/adapter.module';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			...getDbConfig(),
		}),
		AdapterModule,
		HttpModule,
	],
})
export class AppModule {}