class ItemDto {
	id: number;
	quantity: number;

}

export class CreateOrderDto {
	itemsIds: ItemDto[];
	clientId: string;
}