import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { RedeemCouponDto } from './dto/redeem-coupon.dto';
import { MarkRedeemedDto } from './dto/mark-redeemed.dto';
import { Coupon } from './entities/coupon.entity';

@ApiTags('Cupones')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get('all')
  @ApiOperation({ summary: 'Obtener todos los cupones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de cupones obtenida exitosamente',
    type: [Coupon],
  })
  async findAll(): Promise<Coupon[]> {
    return await this.couponsService.findAll();
  }

  @Get('redeemed')
  @ApiOperation({ summary: 'Obtener todos los cupones canjeados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de cupones canjeados obtenida exitosamente',
    type: [Coupon],
  })
  async findRedeemedCoupons(): Promise<Coupon[]> {
    return await this.couponsService.findRedeemedCoupons();
  }

  @Get('getone/:id')
  @ApiOperation({ summary: 'Obtener un cupón por ID' })
  @ApiParam({ name: 'id', description: 'ID único del cupón' })
  @ApiResponse({
    status: 200,
    description: 'Cupón encontrado exitosamente',
    type: Coupon,
  })
  @ApiResponse({
    status: 404,
    description: 'Cupón no encontrado',
  })
  async findOne(@Param('id') id: string): Promise<Coupon> {
    return await this.couponsService.findOne(id);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo cupón' })
  @ApiResponse({
    status: 201,
    description: 'Cupón creado exitosamente',
    type: Coupon,
  })
  @ApiResponse({
    status: 409,
    description: 'El código del cupón ya está en uso',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async create(@Body() createCouponDto: CreateCouponDto): Promise<Coupon> {
    return await this.couponsService.create(createCouponDto);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Actualizar un cupón' })
  @ApiParam({ name: 'id', description: 'ID único del cupón' })
  @ApiResponse({
    status: 200,
    description: 'Cupón actualizado exitosamente',
    type: Coupon,
  })
  @ApiResponse({
    status: 404,
    description: 'Cupón no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'El código del cupón ya está en uso',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCouponDto: UpdateCouponDto,
  ): Promise<Coupon> {
    return await this.couponsService.update(id, updateCouponDto);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un cupón (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID único del cupón' })
  @ApiResponse({
    status: 204,
    description: 'Cupón eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Cupón no encontrado',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.couponsService.remove(id);
  }

  @Post('redeem')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Canjear un cupón' })
  @ApiResponse({
    status: 200,
    description: 'Cupón canjeado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Cupón canjeado exitosamente. Valor: $25.50',
        },
        coupon: { $ref: '#/components/schemas/Coupon' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Cupón no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'El cupón no está activo, ha expirado o ya fue canjeado',
  })
  async redeemCoupon(
    @Body() redeemCouponDto: RedeemCouponDto,
  ): Promise<{ message: string; coupon: Coupon }> {
    return await this.couponsService.redeemCoupon(redeemCouponDto);
  }
}
