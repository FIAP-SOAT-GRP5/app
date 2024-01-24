import { OrderStatus } from "../value-objects/order-status";

export class UpdateOrderDto {
	id: number;
	status: OrderStatus;
}