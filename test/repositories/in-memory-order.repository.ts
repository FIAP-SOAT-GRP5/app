import { IOrderRepository } from "../../src/domain/application/interfaces/order/order-repository.interface";
import { OrderToCreateDto } from "../../src/domain/enterprise/dtos/order-to-create.dto";
import { Item } from "../../src/domain/enterprise/entities/item.entity";
import { OrderItem } from "../../src/domain/enterprise/entities/order-item.entity";
import { Order } from "../../src/domain/enterprise/entities/order.entity";

export class InMemoryOrderRepository implements IOrderRepository {
	orders: Order[] = [];

	private generateId(): number {
		const findBiggestId = () => {
			let biggestId = 0;
			for (const order of this.orders) {
				if (order.getId() > biggestId) {
					biggestId = order.id;
				}
			}
			return biggestId;
		}
		return findBiggestId() + 1;
	}

	async update(id: number, order: Partial<Order>): Promise<void> {
		const orderToUpdate = await this.findById(id);
		if (!orderToUpdate) return;
		orderToUpdate.status = order.status;
		orderToUpdate.client_id = order.client_id;
		orderToUpdate.orderItems = order.orderItems;
	}

	async create(orderToCreate: OrderToCreateDto): Promise<Order> {
		const order = new Order();
		order.id = this.generateId();
		order.status = orderToCreate.status;
		order.client_id = orderToCreate.client_id;
		order.orderItems = orderToCreate.orderItems.map(oi => {
			const orderItem = new OrderItem();
			orderItem.price = oi.price;
			orderItem.quantity = oi.quantity;
			const item = new Item();
			item.id = oi.item.id;
			item.name = oi.item.name;
			orderItem.item = item;
			return orderItem;
		});

		this.orders.push(order);
		return order;
	}

	async findById(id: number): Promise<Order> {
		const order = this.orders.find(o => o.id === id);
		return order;
	}

	async listAllOrders(): Promise<Order[]> {
		return this.orders;
	}

}
