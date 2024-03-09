/* v8 ignore start */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildCreateOrderUseCase } from '../../../domain/application/factories/order/create-order.use-case.factory';
import { buildGetOrderUseCase } from '../../../domain/application/factories/order/get-order.use-case.factory';
import { buildUpdateOrderUseCase } from '../../../domain/application/factories/order/update-order.use-case.factory';
import { GET_ITEM_USE_CASE } from '../../../domain/application/symbols/item.symbols';
import {
	CREATE_ORDER_USE_CASE,
	GET_ORDER_USE_CASE,
	UPDATE_ORDER_USE_CASE,
} from '../../../domain/application/symbols/order.symbols';
import { OrderEntity } from '../../entities/order.entity';
import { ItemModule } from '../item/item.module';
import { CreateOrderQueueGateway } from './create-order-queue.gateway';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { PaymentApprovedQueueGateway } from './payment-approved-queue.gateway';
import { PaymentCanceledQueueGateway } from './payment-canceled-queue.gateway';
import { UpdateOrderQueueGateway } from './update-order-queue.gateway';

@Module({
	imports: [
		TypeOrmModule.forFeature([OrderEntity]),
		ItemModule,
	],
	providers: [
		OrderRepository,
		CreateOrderQueueGateway,
		UpdateOrderQueueGateway,
		PaymentApprovedQueueGateway,
		PaymentCanceledQueueGateway,
		{
			provide: CREATE_ORDER_USE_CASE,
			inject: [OrderRepository, GET_ITEM_USE_CASE, CreateOrderQueueGateway],
			useFactory: buildCreateOrderUseCase,
		},
		{
			provide: UPDATE_ORDER_USE_CASE,
			inject: [OrderRepository],
			useFactory: buildUpdateOrderUseCase,
		},
		{
			provide: GET_ORDER_USE_CASE,
			inject: [OrderRepository],
			useFactory: buildGetOrderUseCase,
		},
	],
	controllers: [OrderController],
})
export class OrderModule {}
/* v8 ignore stop */
