/* v8 ignore start */
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import env from '../../../config/env';
import { clientSQS } from '../../../config/sqs';
import { IQueueGateway } from '../../../domain/application/interfaces/queue/queue.gateway.interface';
import { Order } from '../../../domain/enterprise/entities/order.entity';

@Injectable()
export class CreateOrderQueueGateway implements IQueueGateway {

	async send(entity: Order): Promise<void> {
		const command = new SendMessageCommand({
			QueueUrl: env.QUEUE_CREATE_ORDER_URL ?? '',
			MessageBody: JSON.stringify(entity),
		});
		await clientSQS.send(command)
	}

}
/* v8 ignore stop */
