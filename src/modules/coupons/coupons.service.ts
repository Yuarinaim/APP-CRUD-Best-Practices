import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { RedeemCouponDto } from './dto/redeem-coupon.dto';
import { CouponState } from './enums/coupon-state.enum';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
    // Verificar si el código ya existe
    const existingCoupon = await this.couponRepository.findOne({
      where: { code: createCouponDto.code },
      withDeleted: true,
    });

    if (existingCoupon) {
      throw new ConflictException('El código del cupón ya está en uso');
    }

    // Crear el cupón
    const coupon = this.couponRepository.create({
      ...createCouponDto,
      expirationDate: new Date(createCouponDto.expirationDate),
      state: createCouponDto.state ?? CouponState.ACTIVE,
    });

    return await this.couponRepository.save(coupon);
  }

  async findAll(): Promise<Coupon[]> {
    return await this.couponRepository.find();
  }

  async findRedeemedCoupons(): Promise<Coupon[]> {
    return await this.couponRepository.find({
      where: {
        redeemedAt: Not(null),
        state: CouponState.INACTIVE,
      },
      order: { redeemedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException(`Cupón con ID ${id} no encontrado`);
    }

    return coupon;
  }

  async update(id: string, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
    const coupon = await this.findOne(id);

    // Si se está actualizando el código, verificar que no esté en uso
    if (updateCouponDto.code && updateCouponDto.code !== coupon.code) {
      const existingCoupon = await this.couponRepository.findOne({
        where: { code: updateCouponDto.code },
        withDeleted: true,
      });

      if (existingCoupon) {
        throw new ConflictException('El código del cupón ya está en uso');
      }
    }

    // Actualizar el cupón
    await this.couponRepository.update(id, updateCouponDto);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const coupon = await this.findOne(id);
    await this.couponRepository.softDelete(id);
  }

  async findByCode(code: string): Promise<Coupon | null> {
    return await this.couponRepository.findOne({
      where: { code },
    });
  }

  async redeemCoupon(
    redeemCouponDto: RedeemCouponDto,
  ): Promise<{ message: string; coupon: Coupon }> {
    const { code } = redeemCouponDto;

    // Buscar el cupón por código
    const coupon = await this.findByCode(code);

    if (!coupon) {
      throw new NotFoundException('Cupón no encontrado');
    }

    // Validar que el cupón esté activo
    if (coupon.state !== CouponState.ACTIVE) {
      throw new BadRequestException('El cupón no está activo');
    }

    // Validar que no esté expirado
    const now = new Date();
    if (coupon.expirationDate < now) {
      throw new BadRequestException('El cupón ha expirado');
    }

    // Validar que no esté ya canjeado
    if (coupon.redeemedAt) {
      throw new BadRequestException('El cupón ya ha sido canjeado');
    }

    // Marcar como canjeado
    coupon.redeemedAt = now;
    coupon.state = CouponState.INACTIVE;

    await this.couponRepository.save(coupon);

    return {
      message: `Cupón canjeado exitosamente. Valor: $${coupon.value}`,
      coupon,
    };
  }
}
