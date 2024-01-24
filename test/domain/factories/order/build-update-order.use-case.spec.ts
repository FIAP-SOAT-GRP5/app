import { buildUpdateOrderUseCase } from "../../../../src/domain/application/factories/order/update-order.use-case.factory";
import { IQueueGateway } from "../../../../src/domain/application/interfaces/queue/queue.gateway.interface";
import { InMemoryOrderRepository } from "../../../repositories/in-memory-order.repository";

let queueGateway: IQueueGateway;
let inMemoryOrderRepository: InMemoryOrderRepository;

describe("buildUpdateOrderUseCase", () => {

	beforeEach(() => {
		queueGateway = {
			send: vi.fn(),
		}
		inMemoryOrderRepository = new InMemoryOrderRepository()
	})

	it("should update a class", async () => {
		const useCase = buildUpdateOrderUseCase(inMemoryOrderRepository)

		expect(useCase).toBeDefined()
	})
})