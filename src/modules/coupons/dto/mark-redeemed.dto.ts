import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class MarkRedeemedDto {
  @ApiProperty({
    description: 'Código único del cupón a marcar como canjeado',
    example: 'DESCUENTO20',
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'El código del cupón es requerido' })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El código no puede exceder 50 caracteres' })
  code: string;
}
