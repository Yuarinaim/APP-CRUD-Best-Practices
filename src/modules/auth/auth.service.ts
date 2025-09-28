import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email.toLowerCase());

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }

  async register(
    registerDto: RegisterDto,
  ): Promise<{ message: string; user: Partial<User> }> {
    // Verificar si el email ya existe
    const existingUser = await this.usersService.findByEmail(registerDto.email.toLowerCase());

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Crear el usuario usando el servicio de usuarios
    const user = await this.usersService.create(registerDto);

    // Retornar el usuario sin la contraseña
    const { password, ...userWithoutPassword } = user;

    return {
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword,
    };
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;

    // Obtener el usuario completo (incluyendo la contraseña)
    const user = await this.usersService.findOne(userId);

    // Verificar que la contraseña actual sea correcta
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    // Verificar que la nueva contraseña sea diferente a la actual
    if (currentPassword === newPassword) {
      throw new BadRequestException(
        'La nueva contraseña debe ser diferente a la actual',
      );
    }

    // Actualizar la contraseña
    await this.usersService.update(userId, { password: newPassword });

    return {
      message: 'Contraseña actualizada exitosamente',
    };
  }
}
