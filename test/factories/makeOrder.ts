import { OrderToCreateDto } from "../../src/domain/enterprise/dtos/order-to-create.dto"

export function makeOrderToCreate() {
	const order = new OrderToCreateDto()
	order.client_id = 'any_client_id'
	order.orderItems = []
	return order
}
