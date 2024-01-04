import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IItemRepository } from '../../../domain/application/interfaces/Item/item-repository.interface';
import { CreateItemDto } from '../../../domain/enterprise/dtos/create-item.dto';
import { UpdateItemDto } from '../../../domain/enterprise/dtos/update-item.dto';
import { Item } from '../../../domain/enterprise/entities/item.entity';
import { TypeItem } from '../../../domain/enterprise/value-objects/type-item';
import { ItemEntity } from '../../entities/item.entity';

@Injectable()
export class ItemRepository implements IItemRepository {
	constructor(
		@InjectRepository(ItemEntity)
		private itemRepository: Repository<ItemEntity>
	) {}

	createItem(itemToCreate: CreateItemDto) {
		return this.itemRepository.save(itemToCreate);
	}

	updateItem(id: number, itemToUpdate: UpdateItemDto) {
		return this.itemRepository.save({
			id,
			...itemToUpdate,
		});
	}

	getItemBySnack(): Promise<Item[]> {
		return this.itemRepository.find({
			where: {
				category: {
					id: TypeItem.SNACK,
				},
			}
		});
	}

	getItemByFollowUp(): Promise<Item[]> {
		return this.itemRepository.find({
			where: {
				category: {
					id: TypeItem.FOLLOW_UP,
				},
			}
		});
	}

	getItemByDrink(): Promise<Item[]> {
		return this.itemRepository.find({
			where: {
				category: {
					id: TypeItem.DRINK,
				},
			}
		});
	}

	getItemByDessert(): Promise<Item[]> {
		return this.itemRepository.find({
			where: {
				category: {
					id: TypeItem.DESSERT,
				},
			}
		});
	}

	findById(id: number): Promise<Item> {
		return this.itemRepository.findOne({
			where: {
				id,
			}
		});
	}

	findAll(): Promise<Item[]> {
		return this.itemRepository.find();
	}
}
