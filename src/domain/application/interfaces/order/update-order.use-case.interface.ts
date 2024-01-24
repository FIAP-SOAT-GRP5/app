/* v8 ignore start */
import { UpdateOrderDto } from "../../../enterprise/dtos/update-order.dto";

export interface IUpdateOrderUseCase {
	update(dto: UpdateOrderDto): Promise<void>;
}
/* v8 ignore stop */