import { OrderToCreateDto } from "../../src/domain/enterprise/dtos/order-to-create.dto"

export function makeOrderToCreate() {
	const order = new OrderToCreateDto()
	order.client_id = 1
	order.orderItems = []
	return order
}
