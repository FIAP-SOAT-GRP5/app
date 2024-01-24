import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import request from 'supertest';
import env from '../../../src/config/env';
import { buildGetItemUseCase } from '../../../src/domain/application/factories/item/get-item.use-case.factory';
import { buildCreateOrderUseCase } from '../../../src/domain/application/factories/order/create-order.use-case.factory';
import { buildGetOrderUseCase } from '../../../src/domain/application/factories/order/get-order.use-case.factory';
import { ICreateOrderUseCase } from '../../../src/domain/application/interfaces/Order/create-order.use-case.interface';
import { IGetOrderUseCase } from '../../../src/domain/application/interfaces/Order/get-order.use-case.interface';
import { IQueueGateway } from '../../../src/domain/application/interfaces/queue/queue.gateway.interface';
import { GET_ITEM_USE_CASE } from '../../../src/domain/application/symbols/item.symbols';
import { CREATE_ORDER_USE_CASE, GET_ORDER_USE_CASE } from '../../../src/domain/application/symbols/order.symbols';
import { AuthModule } from '../../../src/framework/modules/auth/auth.module';
import { ItemRepository } from '../../../src/framework/modules/item/item.repository';
import { CreateOrderQueueGateway } from '../../../src/framework/modules/order/create-order-queue.gateway';
import { CreateOrderBodyDto } from '../../../src/framework/modules/order/dtos/create-order.dto';
import { OrderController } from '../../../src/framework/modules/order/order.controller';
import { OrderRepository } from '../../../src/framework/modules/order/order.repository';
import { makeItem } from '../../factories/makeItem';
import { makeOrderToCreate } from '../../factories/makeOrder';
import { InMemoryItemRepository } from '../../repositories/in-memory-item.repository';
import { InMemoryOrderRepository } from '../../repositories/in-memory-order.repository';


const moduleMocker = new ModuleMocker(global);

describe('OrderController', () => {
	let queueGateway: IQueueGateway;
	let inMemoryOrderRepository: InMemoryOrderRepository;
	let inMemoryItemRepository: InMemoryItemRepository;
	let getOrderUseCase: IGetOrderUseCase;
	let createOrderUseCase: ICreateOrderUseCase;
	let app: INestApplication;

	beforeEach(async () => {
		queueGateway = {
			send: vi.fn(),
		}
		inMemoryOrderRepository = new InMemoryOrderRepository()
		inMemoryItemRepository = new InMemoryItemRepository()
		process.env.JWT_KEY = 'test'

		const module: TestingModule = await Test.createTestingModule({
			imports: [AuthModule],
			controllers: [OrderController],
			providers: [
				{
					provide: ItemRepository,
					useValue: inMemoryItemRepository,
				},
				{
					provide: OrderRepository,
					useValue: inMemoryOrderRepository,
				},
				{
					provide: CreateOrderQueueGateway,
					useValue: queueGateway,
				},
				{
					provide: GET_ITEM_USE_CASE,
					inject: [ItemRepository],
					useFactory: buildGetItemUseCase,
				},
				{
					provide: GET_ORDER_USE_CASE,
					inject: [OrderRepository],
					useFactory: buildGetOrderUseCase,
				},
				{
					provide: CREATE_ORDER_USE_CASE,
					inject: [OrderRepository, GET_ITEM_USE_CASE, CreateOrderQueueGateway],
					useFactory: buildCreateOrderUseCase,
				},
			]
		}).useMocker((token) => {
			if (typeof token === 'function') {
				const mockMetadata = moduleMocker.getMetadata(
					token
				) as MockFunctionMetadata<any, any>;
				const Mock = moduleMocker.generateFromMetadata(mockMetadata);
				return new Mock();
			}
		}).compile();

		app = module.createNestApplication()

		getOrderUseCase = module.get(GET_ORDER_USE_CASE)
		createOrderUseCase = module.get(CREATE_ORDER_USE_CASE)

		await app.init()
	});

	afterEach(() => {
		vi.clearAllMocks();
	})

	describe('[GET] /order/:id', () => {
		it('should return a order', async () => {
			const order = await inMemoryOrderRepository.create(makeOrderToCreate())

			const spyFindById = vi.spyOn(getOrderUseCase, 'findById')

			const response = await request(app.getHttpServer())
				.get(`/order/${order.id}`)
				.send();

			expect(response.body.order).toBeDefined()
			expect(response.statusCode).toBe(200)
			expect(spyFindById).toHaveBeenCalled()
		});

		it('should return 404', async () => {
			const response = await request(app.getHttpServer())
				.get('/order/1')
				.send();
			expect(response.statusCode).toBe(404)
		});

		it('should return 500', async () => {
			vi.spyOn(getOrderUseCase, 'findById').mockImplementationOnce(() => {
				throw new Error('Test')
			})
			const response = await request(app.getHttpServer())
				.get('/order/1')
				.send();
			expect(response.statusCode).toBe(500)
		});
	})

	describe('[GET] /order/list-all-orders', () => {
		it('should return a list of orders', async () => {
			await inMemoryOrderRepository.create(makeOrderToCreate())

			const spyListAllOrders = vi.spyOn(getOrderUseCase, 'listAllOrders')

			const response = await request(app.getHttpServer())
				.get('/order/list-all-orders')
				.send();

			expect(response.body.list).toHaveLength(1)
			expect(response.statusCode).toBe(200)
			expect(spyListAllOrders).toHaveBeenCalled()
		});

		it('should return 500', async () => {
			vi.spyOn(getOrderUseCase, 'listAllOrders').mockImplementationOnce(() => {
				throw new Error('Test')
			})
			const response = await request(app.getHttpServer())
				.get('/order/list-all-orders')
				.send();
			expect(response.statusCode).toBe(500)
		});
	})

	describe('[POST] /order', () => {
		it('should create a order', async () => {
			const item = makeItem()
			await inMemoryItemRepository.createItem(item)
			const dto: CreateOrderBodyDto = {
				itemsIds: [
					{
						id: item.id,
						quantity: 1
					}
				]
			}
			const spyCreateOrder = vi.spyOn(createOrderUseCase, 'create')

			const jwt = new JwtService({ secretOrPrivateKey: env.JWT_KEY }).sign({ sub: 1 })

			const response = await request(app.getHttpServer())
				.post('/order')
				.set('Authorization', `Bearer ${jwt}`)
				.send(dto);

			expect(response.body.order).toBeDefined()
			expect(response.statusCode).toBe(201)
			expect(spyCreateOrder).toHaveBeenCalled()
			expect(queueGateway.send).toHaveBeenCalled()
		});

		it('should return 500', async () => {
			vi.spyOn(createOrderUseCase, 'create').mockImplementationOnce(() => {
				throw new Error('Test')
			})

			const jwt = new JwtService({ secretOrPrivateKey: env.JWT_KEY }).sign({ sub: 1 })

			const response = await request(app.getHttpServer())
				.post('/order')
				.set('Authorization', `Bearer ${jwt}`)
				.send();
			expect(response.statusCode).toBe(500)
		});

		it('should return 400 with order is without items', async () => {
			const dto: CreateOrderBodyDto = {
				itemsIds: []
			}

			const jwt = new JwtService({ secretOrPrivateKey: env.JWT_KEY }).sign({ sub: 1 })

			const response = await request(app.getHttpServer())
				.post('/order')
				.set('Authorization', `Bearer ${jwt}`)
				.send(dto);
			expect(response.statusCode).toBe(400)
		});
	})
});
