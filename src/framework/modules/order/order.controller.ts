import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	ParseIntPipe,
	Post,
	Res
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { OrderWithoutItemsError } from '../../../core/errors/order-without-items.error';
import { ICreateOrderUseCase } from '../../../domain/application/interfaces/order/create-order.use-case.interface';
import { IGetOrderUseCase } from '../../../domain/application/interfaces/order/get-order.use-case.interface';
import {
	CREATE_ORDER_USE_CASE,
	GET_ORDER_USE_CASE
} from '../../../domain/application/symbols/order.symbols';
import { AuthJwt } from '../../decorators/auth-jwt.decorator';
import { ReqCurrentUser } from '../../decorators/current-user.decorator';
import { CurrentUser } from '../../model/current-user.model';
import { CreateOrderBodyDto } from './dtos/create-order.dto';

@Controller('order')
@ApiTags('Order')
export class OrderController {
	constructor(
		@Inject(CREATE_ORDER_USE_CASE)
		private readonly createOrderUseCase: ICreateOrderUseCase,
		@Inject(GET_ORDER_USE_CASE)
		private readonly getOrderUseCase: IGetOrderUseCase,
	) {}

	@Get('list-all-orders')
	public async listAllOrders(@Res() res: Response): Promise<void> {
		try {
			const list = await this.getOrderUseCase.listAllOrders();
			res.status(200).send({ list });
		} catch (error) {
			res.status(500).send(error.message);
		}
	}

	@Get(':id')
	public async findById(
		@Res() res: Response,
		@Param('id', ParseIntPipe) id: number
	): Promise<void> {
		try {
			const order = await this.getOrderUseCase.findById(id);
			if (!order) {
				res.status(404).send('Orders not found');
			} else {
				res.status(200).send({ order });
			}
		} catch (error) {
			res.status(500).send(error.message);
		}
	}

	@Post()
	@AuthJwt()
	public async create(
		@ReqCurrentUser() currentUser: CurrentUser,
		@Res() res: Response,
		@Body() body: CreateOrderBodyDto
	): Promise<void> {
		try {
			const order = await this.createOrderUseCase.create({
				...body,
				clientId: currentUser.id,
			});
			res.status(201).send({ order });
		} catch (error) {
			if (error instanceof OrderWithoutItemsError) {
				res.status(400).send(error.message);
			} else {
				res.status(500).send(error.message);
			}
		}
	}
}
