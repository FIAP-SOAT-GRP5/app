import { CreateOrderDto } from "../../../enterprise/dtos/create-order.dto";
import { Order } from "../../../enterprise/entities/order.entity";

export interface ICreateOrderUseCase {
	create(dto: CreateOrderDto): Promise<Order>;
}