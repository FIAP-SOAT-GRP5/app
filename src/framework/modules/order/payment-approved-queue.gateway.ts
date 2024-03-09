/* v8 ignore start */
import { Inject, Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { Consumer } from 'sqs-consumer';
import env from '../../../config/env';
import { IUpdateOrderUseCase } from '../../../domain/application/interfaces/order/update-order.use-case.interface';
import { UPDATE_ORDER_USE_CASE } from '../../../domain/application/symbols/order.symbols';
import { OrderStatus } from '../../../domain/enterprise/value-objects/order-status';

@Injectable()
export class PaymentApprovedQueueGateway implements OnApplicationBootstrap, OnApplicationShutdown {

	private readonly consumer: Consumer;

	constructor(
		@Inject(UPDATE_ORDER_USE_CASE)
		private readonly updateOrderUseCase: IUpdateOrderUseCase
	) {
		this.consumer = Consumer.create({
			queueUrl: `${env.QUEUE_PAYMENT_APPROVED_URL ?? ''}_order`,
			region: 'us-east-1',
			handleMessage: async (message) => {
				const { orderId } = JSON.parse(message.Body);
				await this.updateOrderUseCase.update({
					id: orderId,
					status: OrderStatus.RECEIVED
				});
			}
		});
	}

	onApplicationBootstrap() {
		this.consumer.start();
	}

	onApplicationShutdown() {
		this.consumer.stop();
	}

}
/* v8 ignore stop */
