# Configuración de PostgreSQL con Docker Compose

Este proyecto incluye una configuración completa de PostgreSQL usando Docker Compose para desarrollo local.

## Requisitos

- Docker
- Docker Compose
- Node.js (para la aplicación NestJS)

## Configuración

### 1. Variables de entorno

Copia el archivo `env.example` a `.env` y ajusta las variables según sea necesario:

```bash
cp env.example .env
```

Las variables de base de datos están configuradas para funcionar con el contenedor Docker:

- `DB_HOST=localhost`
- `DB_PORT=5432`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=password`
- `DB_DATABASE=nestjs_crud_api`

### 2. Iniciar PostgreSQL con Docker Compose

```bash
# Iniciar solo PostgreSQL
docker-compose up postgres -d

# O iniciar todos los servicios (PostgreSQL + pgAdmin)
docker-compose up -d
```

### 3. Verificar que PostgreSQL esté funcionando

```bash
# Ver logs del contenedor
docker-compose logs postgres

# Conectar a la base de datos desde la línea de comandos
docker-compose exec postgres psql -U postgres -d nestjs_crud_api
```

### 4. Iniciar la aplicación NestJS

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run start:dev
```

## Servicios incluidos

### PostgreSQL

- **Puerto**: 5432
- **Base de datos**: nestjs_crud_api
- **Usuario**: postgres
- **Contraseña**: password
- **Volumen persistente**: Los datos se mantienen entre reinicios

### pgAdmin (Opcional)

- **Puerto**: 8080
- **URL**: http://localhost:8080
- **Email**: admin@admin.com
- **Contraseña**: admin

Para conectar pgAdmin a PostgreSQL:

1. Abre http://localhost:8080
2. Inicia sesión con las credenciales
3. Agrega un nuevo servidor:
   - Host: postgres
   - Puerto: 5432
   - Usuario: postgres
   - Contraseña: password

## Comandos útiles

```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (¡CUIDADO! Esto elimina todos los datos)
docker-compose down -v

# Ver estado de los contenedores
docker-compose ps

# Reiniciar un servicio específico
docker-compose restart postgres

# Ver logs en tiempo real
docker-compose logs -f postgres
```

## Estructura de la base de datos

La aplicación creará automáticamente las tablas necesarias cuando se inicie, incluyendo:

- `users`: Tabla de usuarios con campos para id, name, email, password, isActive, timestamps y soft delete

## Migraciones

Para producción, se recomienda usar migraciones en lugar de `synchronize: true`. Las migraciones se encuentran en `src/database/migrations/`.

## Solución de problemas

### Puerto 5432 ya está en uso

Si tienes PostgreSQL instalado localmente, detén el servicio o cambia el puerto en `docker-compose.yml`:

```yaml
ports:
  - '5433:5432' # Usar puerto 5433 en lugar de 5432
```

Y actualiza la variable `DB_PORT=5433` en tu archivo `.env`.

### Error de conexión

Asegúrate de que:

1. El contenedor PostgreSQL esté ejecutándose: `docker-compose ps`
2. Las variables de entorno en `.env` coincidan con la configuración de Docker
3. No haya firewall bloqueando el puerto 5432

