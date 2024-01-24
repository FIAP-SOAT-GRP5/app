import { UpdateOrderDto } from '../../../enterprise/dtos/update-order.dto';
import { IOrderRepository } from '../../interfaces/order/order-repository.interface';
import { IUpdateOrderUseCase } from '../../interfaces/order/update-order.use-case.interface';

export class UpdateOrderUseCase implements IUpdateOrderUseCase {
	constructor(
		private readonly repository: IOrderRepository,
	) {}

	async update({ id, status }: UpdateOrderDto): Promise<void> {
		const order = await this.repository.findById(id);
		if (!order) return;
		await this.repository.update(id, { status });
	}
}
