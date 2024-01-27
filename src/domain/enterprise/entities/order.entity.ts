import { IEntity } from '../../application/interfaces/entity.interface';
import { OrderStatus } from '../value-objects/order-status';
import { OrderItem } from './order-item.entity';

export class Order implements IEntity {
	id: number;
	status: OrderStatus;
	finishedAt: Date;
	createdAt: Date;
	updatedAt: Date;
	client_id: string;
	orderItems?: OrderItem[];

	getId(): number {
		return this.id;
	}
}
