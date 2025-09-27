import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
  IsDateString,
} from 'class-validator';
import { CouponState } from '../enums/coupon-state.enum';

export class CreateCouponDto {
  @ApiProperty({
    description: 'Código único del cupón',
    example: 'NAVIDAD2024',
    minLength: 3,
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'El código es requerido' })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @MinLength(3, { message: 'El código debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El código no puede exceder 50 caracteres' })
  code: string;

  @ApiProperty({
    description: 'Descripción del cupón',
    example: 'Descuento especial de Navidad 2024',
    minLength: 5,
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MinLength(5, { message: 'La descripción debe tener al menos 5 caracteres' })
  @MaxLength(255, { message: 'La descripción no puede exceder 255 caracteres' })
  description?: string;

  @ApiProperty({
    description: 'Valor del cupón',
    example: 25.5,
    minimum: 0.01,
  })
  @IsNotEmpty({ message: 'El valor es requerido' })
  @IsNumber({}, { message: 'El valor debe ser un número' })
  @Min(0.01, { message: 'El valor debe ser mayor a 0' })
  value: number;

  @ApiProperty({
    description: 'Fecha de expiración del cupón',
    example: '2024-12-31T23:59:59.000Z',
  })
  @IsNotEmpty({ message: 'La fecha de expiración es requerida' })
  @IsDateString(
    {},
    { message: 'La fecha de expiración debe ser una fecha válida' },
  )
  expirationDate: string;

  @ApiProperty({
    description: 'Estado del cupón',
    enum: CouponState,
    example: CouponState.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(CouponState, {
    message: 'El estado debe ser uno de: activo, inactivo',
  })
  state?: CouponState;
}
