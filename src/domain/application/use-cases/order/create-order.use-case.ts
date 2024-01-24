import { OrderWithoutItemsError } from '../../../../core/errors/order-without-items.error';
import { CreateOrderDto } from '../../../enterprise/dtos/create-order.dto';
import { Order } from '../../../enterprise/entities/order.entity';
import { OrderStatus } from '../../../enterprise/value-objects/order-status';
import { IGetItemUseCase } from '../../interfaces/Item/get-item.use-case.interface';
import { ICreateOrderUseCase } from '../../interfaces/order/create-order.use-case.interface';
import { IOrderRepository } from '../../interfaces/order/order-repository.interface';
import { IQueueGateway } from '../../interfaces/queue/queue.gateway.interface';

export class CreateOrderUseCase implements ICreateOrderUseCase {
	constructor(
		private readonly repository: IOrderRepository,
		private readonly getItemUseCase: IGetItemUseCase,
		private readonly queueGateway: IQueueGateway,
	) {}

	async create(dto: CreateOrderDto): Promise<Order> {
		const items = await Promise.all(
			dto.itemsIds.map(async (item) => {
				const itemEntity = await this.getItemUseCase.findById(item.id);
				return {
					quantity: item.quantity,
					price: itemEntity.price,
					id: itemEntity.id,
					name: itemEntity.name
				};
			})
		);
		if (items.length === 0) throw new OrderWithoutItemsError();

		const order = await this.repository.create({
			client_id: dto.clientId,
			status: OrderStatus.AWAITING_PAYMENT,
			orderItems: items.map((item) => ({
				item: {
					id: item.id,
					name: item.name
				},
				price: item.price,
				quantity: item.quantity
			})),
		});
		await this.queueGateway.send(order);
		return order;
	}
}
