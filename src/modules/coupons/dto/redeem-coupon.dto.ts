import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class RedeemCouponDto {
  @ApiProperty({
    description: 'Código del cupón a canjear',
    example: 'NAVIDAD2024',
    minLength: 3,
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'El código del cupón es requerido' })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @MinLength(3, { message: 'El código debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El código no puede exceder 50 caracteres' })
  code: string;
}
