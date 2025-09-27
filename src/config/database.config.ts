import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: this.configService.get('DB_PORT', 5432),
      username: this.configService.get('DB_USERNAME', 'postgres'),
      password: this.configService.get('DB_PASSWORD', 'admin'),
      database: this.configService.get('DB_DATABASE', 'nestjs_crud_api'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      synchronize: this.configService.get('NODE_ENV') === 'development',
      logging: this.configService.get('NODE_ENV') === 'development',
      ssl:
        this.configService.get('NODE_ENV') === 'production'
          ? { rejectUnauthorized: false }
          : false,
      // Configuraciones específicas para PostgreSQL
      extra: {
        max: 20, // Máximo número de conexiones en el pool
        idleTimeoutMillis: 30000, // Tiempo de inactividad antes de cerrar conexión
        connectionTimeoutMillis: 2000, // Tiempo de espera para establecer conexión
      },
    };
  }
}
