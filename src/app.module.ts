import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDbConfig } from './config/database';

import { AuthModule } from './framework/modules/auth/auth.module';
import { ItemModule } from './framework/modules/item/item.module';
import { OrderModule } from './framework/modules/order/order.module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			...getDbConfig(),
		}),
		OrderModule,
		ItemModule,
		AuthModule,
	],
})
export class AppModule {}
