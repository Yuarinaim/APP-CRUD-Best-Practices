# API CRUD Best Practices - NestJS

Una API REST construida con NestJS siguiendo las mejores prácticas de desarrollo.

## 🚀 Características

- **Framework**: NestJS con TypeScript
- **Base de datos**: PostgreSQL con TypeORM
- **Autenticación**: JWT
- **Documentación**: Swagger/OpenAPI
- **Validación**: class-validator
- **Testing**: Jest
- **Linting**: ESLint + Prettier

## 📁 Estructura del Proyecto

```
src/
├── common/                 # Utilidades compartidas
│   ├── decorators/        # Decoradores personalizados
│   ├── filters/           # Filtros de excepción
│   ├── guards/            # Guards de autenticación/autorización
│   ├── interceptors/      # Interceptores
│   ├── pipes/             # Pipes de validación
│   └── middleware/        # Middleware personalizado
├── config/                # Configuraciones
├── database/              # Migraciones y seeds
├── modules/               # Módulos de la aplicación
│   ├── auth/             # Módulo de autenticación
│   └── users/            # Módulo de usuarios
└── main.ts               # Punto de entrada
```

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd nestjs-crud-api
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```
   
   Editar el archivo `.env` con tus configuraciones:
   ```env
   NODE_ENV=development
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=password
   DB_DATABASE=nestjs_crud_api
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Configurar base de datos**
   - Instalar PostgreSQL
   - Crear la base de datos `nestjs_crud_api`
   - Las tablas se crearán automáticamente en modo desarrollo

## 🚀 Ejecución

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

## 📚 Documentación API

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación de Swagger en:
- **URL**: http://localhost:3000/api/docs

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:cov

# Tests e2e
npm run test:e2e
```

## 📝 Scripts Disponibles

- `npm run start` - Iniciar aplicación
- `npm run start:dev` - Iniciar en modo desarrollo con hot-reload
- `npm run start:debug` - Iniciar en modo debug
- `npm run build` - Compilar aplicación
- `npm run lint` - Ejecutar linter
- `npm run format` - Formatear código
- `npm run test` - Ejecutar tests

## 🔧 Tecnologías Utilizadas

- **NestJS** - Framework de Node.js
- **TypeScript** - Lenguaje de programación
- **TypeORM** - ORM para TypeScript
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Swagger** - Documentación API
- **Jest** - Framework de testing
- **ESLint** - Linter
- **Prettier** - Formateador de código

## 📋 Endpoints Disponibles

### Autenticación
- `POST /api/v1/auth/login` - Iniciar sesión

### Usuarios
- `GET /api/v1/users` - Obtener todos los usuarios
- `GET /api/v1/users/:id` - Obtener usuario por ID
- `POST /api/v1/users` - Crear nuevo usuario
- `PATCH /api/v1/users/:id` - Actualizar usuario
- `DELETE /api/v1/users/:id` - Eliminar usuario (soft delete)

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
