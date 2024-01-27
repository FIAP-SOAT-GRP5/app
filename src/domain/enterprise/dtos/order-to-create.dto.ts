import { OrderStatus } from '../value-objects/order-status';

export class OrderToCreateDto {
	status: OrderStatus;
	client_id: string;
	orderItems?: {
		price: number;
		quantity: number;
		item: {
			id: number,
			name: string
		};
	}[];
}
