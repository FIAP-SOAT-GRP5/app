import { ApiProperty } from '@nestjs/swagger';
import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { IEntity } from '../../domain/application/interfaces/entity.interface';
import { OrderStatus } from '../../domain/enterprise/value-objects/order-status';
import { OrderItemEntity } from './order-item.entity';

@Entity('order')
export class OrderEntity implements IEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@ApiProperty()
	status: OrderStatus;

	@Column()
	@ApiProperty()
	finishedAt: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@Column()
	@ApiProperty()
	client_id: string;

	@OneToMany(() => OrderItemEntity, (item) => item.order, {
		cascade: true,
		persistence: true,
	})
	orderItems?: OrderItemEntity[];

	getId(): number {
		return this.id;
	}
}
