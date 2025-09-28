import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Normalizar email a lowercase
    const normalizedEmail = createUserDto.email.toLowerCase();

    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email: normalizedEmail },
      withDeleted: true,
    });

    if (existingUser) {
      throw new ConflictException('El email ya está en uso');
    }

    // Verificar si es el primer usuario para asignar rol de administrador
    const userCount = await this.userRepository.count();
    const role = userCount === 0 ? 'admin' : 'user';

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Crear el usuario
    const user = this.userRepository.create({
      ...createUserDto,
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'name', 'email', 'role', 'isActive', 'created_at', 'updated_at'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role', 'isActive', 'created_at', 'updated_at'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Si se está actualizando el email, verificar que no esté en uso
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const normalizedEmail = updateUserDto.email.toLowerCase();
      const existingUser = await this.userRepository.findOne({
        where: { email: normalizedEmail },
        withDeleted: true,
      });

      if (existingUser) {
        throw new ConflictException('El email ya está en uso');
      }

      // Actualizar el email normalizado
      updateUserDto.email = normalizedEmail;
    }

    // Si se está actualizando la contraseña, encriptarla
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Actualizar el usuario
    await this.userRepository.update(id, updateUserDto);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.softDelete(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }
}
