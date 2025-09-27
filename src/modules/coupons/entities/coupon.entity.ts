import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ModelEntity } from '@/common/entity/base.entity';
import { CouponState } from '../enums/coupon-state.enum';

@Entity('coupons')
export class Coupon extends ModelEntity {
  @ApiProperty({ description: 'Código único del cupón' })
  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @ApiProperty({ description: 'Descripción del cupón' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @ApiProperty({ description: 'Valor del cupón' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @ApiProperty({ description: 'Fecha de expiración del cupón' })
  @Column({ type: 'timestamp' })
  expirationDate: Date;

  @ApiProperty({
    description: 'Estado del cupón',
    enum: CouponState,
    example: CouponState.ACTIVE,
  })
  @Column({
    type: 'enum',
    enum: CouponState,
    default: CouponState.ACTIVE,
  })
  state: CouponState;

  @ApiProperty({ description: 'Fecha de canje del cupón', required: false })
  @Column({ type: 'timestamp', nullable: true })
  redeemedAt?: Date;
}
