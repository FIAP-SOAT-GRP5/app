/* v8 ignore start */
import { OrderToCreateDto } from "../../../enterprise/dtos/order-to-create.dto";
import { Order } from "../../../enterprise/entities/order.entity";

export interface IOrderRepository {
	findById(id: number): Promise<Order>;
	listAllOrders(): Promise<Order[]>;
	create(orderToCreate: OrderToCreateDto): Promise<Order>;
	update(id: number, orderToUpdate: Partial<Order>): Promise<void>;
}
/* v8 ignore stop */