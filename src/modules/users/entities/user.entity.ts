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

@Entity('users')
export class User extends ModelEntity {
  @ApiProperty({ description: 'Nombre del usuario' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ description: 'Email del usuario' })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({ description: 'Contraseña del usuario' })
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({ description: 'Estado activo del usuario' })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
