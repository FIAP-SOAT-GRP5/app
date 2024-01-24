import { IQueueGateway } from "../../../../src/domain/application/interfaces/queue/queue.gateway.interface";
import { GetItemUseCase } from "../../../../src/domain/application/use-cases/item/get-item.use-case";
import { CreateOrderUseCase } from "../../../../src/domain/application/use-cases/order/create-order.use-case";
import { UpdateOrderUseCase } from "../../../../src/domain/application/use-cases/order/update-order.use-case";
import { CreateOrderDto } from "../../../../src/domain/enterprise/dtos/create-order.dto";
import { UpdateOrderDto } from "../../../../src/domain/enterprise/dtos/update-order.dto";
import { OrderStatus } from "../../../../src/domain/enterprise/value-objects/order-status";
import { makeDrinkCategory } from "../../../factories/makeCategory";
import { makeItem } from "../../../factories/makeItem";
import { InMemoryItemRepository } from "../../../repositories/in-memory-item.repository";
import { InMemoryOrderRepository } from "../../../repositories/in-memory-order.repository";

let queueGateway: IQueueGateway;
let inMemoryItemRepository: InMemoryItemRepository;
let getItemUseCase: GetItemUseCase;
let inMemoryOrderRepository: InMemoryOrderRepository;
let createOrderUseCase: CreateOrderUseCase;
let sut: UpdateOrderUseCase;

describe("UpdateOrderUseCase", () => {

	beforeEach(() => {
		queueGateway = {
			send: vi.fn(),
		}
		inMemoryItemRepository = new InMemoryItemRepository()
		getItemUseCase = new GetItemUseCase(inMemoryItemRepository)
		inMemoryOrderRepository = new InMemoryOrderRepository()
		createOrderUseCase = new CreateOrderUseCase(inMemoryOrderRepository, getItemUseCase, queueGateway)
		sut = new UpdateOrderUseCase(inMemoryOrderRepository)
	})

	it("should be able to update a order", async () => {
		const item = makeItem()
		const category = makeDrinkCategory()
		item.category = category
		await inMemoryItemRepository.createItem(item)

		const dto = new CreateOrderDto()
		dto.clientId = 1
		dto.itemsIds = [{
			id: item.id,
			quantity: 1,
		}]

		const order = await createOrderUseCase.create(dto)

		const updateDto = new UpdateOrderDto()
		updateDto.id = order.id
		updateDto.status = OrderStatus.FINISHED

		await sut.update(updateDto);

		expect(order.id).toBeDefined()
		expect(inMemoryOrderRepository.orders).toHaveLength(1)
		expect(inMemoryOrderRepository.orders[0].status).toBe(OrderStatus.FINISHED)
	})

	it("should not be able to update a order without items", async () => {
		sut.update({
			id: 1,
			status: OrderStatus.FINISHED,
		})

		expect(inMemoryOrderRepository.orders).toHaveLength(0)
	})
})