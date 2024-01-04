import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildCreateOrderUseCase } from '../../../domain/application/factories/order/create-order.use-case.factory';
import { buildGetOrderUseCase } from '../../../domain/application/factories/order/get-order.use-case.factory';
import { buildNotifyOrderGateway } from '../../../domain/application/factories/order/notify-order.gateway.factory';
import { buildOrderGateway } from '../../../domain/application/factories/order/order.gateway.factory';
import { GET_ITEM_USE_CASE } from '../../../domain/application/symbols/item.symbols';
import {
	CREATE_ORDER_USE_CASE,
	FAKE_NOTIFY_ORDER_GATEWAY,
	GET_ORDER_USE_CASE,
	ORDER_GATEWAY
} from '../../../domain/application/symbols/order.symbols';
import { OrderEntity } from '../../entities/order.entity';
import { ItemModule } from '../item/item.module';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';

@Module({
	imports: [
		TypeOrmModule.forFeature([OrderEntity]),
		ItemModule,
	],
	providers: [
		OrderRepository,
		{
			provide: ORDER_GATEWAY,
			inject: [OrderRepository],
			useFactory: buildOrderGateway,
		},
		{
			provide: FAKE_NOTIFY_ORDER_GATEWAY,
			useFactory: buildNotifyOrderGateway,
		},
		{
			provide: CREATE_ORDER_USE_CASE,
			inject: [ORDER_GATEWAY, GET_ITEM_USE_CASE],
			useFactory: buildCreateOrderUseCase,
		},
		{
			provide: GET_ORDER_USE_CASE,
			inject: [ORDER_GATEWAY],
			useFactory: buildGetOrderUseCase,
		},
	],
	controllers: [OrderController],
})
export class OrderModule {}
