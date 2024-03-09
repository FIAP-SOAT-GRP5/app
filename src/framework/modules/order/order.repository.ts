/* v8 ignore start */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { IOrderRepository } from '../../../domain/application/interfaces/order/order-repository.interface';
import { OrderToCreateDto } from '../../../domain/enterprise/dtos/order-to-create.dto';
import { Order } from '../../../domain/enterprise/entities/order.entity';
import { OrderStatus } from '../../../domain/enterprise/value-objects/order-status';
import { OrderEntity } from '../../entities/order.entity';

@Injectable()
export class OrderRepository implements IOrderRepository {
	constructor(
		@InjectRepository(OrderEntity)
		private readonly orderRepository: Repository<OrderEntity>
	) {}

	async update(id: number, order: Partial<Order>): Promise<void> {
		await this.orderRepository.update(id, order);
	}

	async create(orderToCreate: OrderToCreateDto): Promise<Order> {
		return this.orderRepository.save(orderToCreate).then((order) => {
			return this.findById(order.id);
		});
	}

	findById(id: number): Promise<Order> {
		return this.orderRepository.findOne({
			where: {
				id,
			},
			relations: [
				'orderItems',
				'orderItems.item',
				'orderItems.item.category',
			],
		});
	}

	listAllOrders(): Promise<Order[]> {
		return this.orderRepository.find({
			where: {
				status: In([
					OrderStatus.AWAITING_PAYMENT,
					OrderStatus.FINISHED,
					OrderStatus.PROCESSING,
					OrderStatus.READY,
					OrderStatus.RECEIVED,
					OrderStatus.CANCELED,
				]),
			},
			relations: [
				'orderItems',
				'orderItems.item',
				'orderItems.item.category',
			],
		});
	}

}
/* v8 ignore stop */
