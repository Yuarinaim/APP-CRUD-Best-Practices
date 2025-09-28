# 🚀 API CRUD Best Practices - NestJS

Una API REST moderna construida con NestJS siguiendo las mejores prácticas de desarrollo, con autenticación JWT, gestión de usuarios y cupones.

## ✨ Características

- 🔐 **Autenticación JWT** con roles (admin/user)
- 👥 **Gestión de usuarios** completa (CRUD)
- 🎫 **Sistema de cupones** con estados y canje
- 📚 **Documentación automática** con Swagger
- 🗄️ **Base de datos PostgreSQL** con TypeORM
- ✅ **Validación robusta** con class-validator
- 🧪 **Testing** con Jest
- 🐳 **Docker** para desarrollo local
- 🚀 **Deployment** automatizado con PM2

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (viene con Node.js)
- **Docker** y **Docker Compose** (para la base de datos)
- **Git**

### Verificar instalaciones:

```bash
node --version    # Debe ser v18+
npm --version     # Debe ser v8+
docker --version  # Docker debe estar instalado
docker-compose --version  # Docker Compose debe estar instalado
```

## 🚀 Guía de Instalación Paso a Paso

### Paso 1: Clonar el Repositorio

```bash
git clone <tu-repositorio-url>
cd APP-CRUD-Best-Practices
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp env.example .env
```

**Editar el archivo `.env`** con un editor de texto (nano, vim, code, etc.):

```bash
# En Windows
notepad .env

# En Mac/Linux
nano .env
```

El archivo `.env` debe verse así:

```env
# Configuración de la aplicación
NODE_ENV=development
PORT=3001

# Configuración de la base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=admin
DB_DATABASE=nestjs_crud_api

# Configuración JWT
JWT_SECRET=mi-super-secreto-jwt-para-desarrollo
JWT_EXPIRES_IN=24h

# Configuración CORS
FRONTEND_URL=http://localhost:3000

# Configuración de logging
LOG_LEVEL=debug
```

### Paso 4: Levantar la Base de Datos con Docker

```bash
# Levantar PostgreSQL con Docker Compose
docker-compose up -d
```

**Verificar que la base de datos esté funcionando:**

```bash
# Ver el estado de los contenedores
docker-compose ps

# Ver los logs de PostgreSQL
docker-compose logs postgres
```

### Paso 5: Iniciar la Aplicación

```bash
# Modo desarrollo (con hot-reload)
npm run start:dev
```

**¡Listo!** 🎉 Tu aplicación debería estar corriendo en:

- **API**: http://localhost:3001
- **Documentación Swagger**: http://localhost:3001/api/docs

## 📚 Documentación de la API

Una vez que la aplicación esté corriendo, puedes acceder a la documentación interactiva de Swagger en:

**🔗 http://localhost:3001/api/docs**

Aquí podrás:

- Ver todos los endpoints disponibles
- Probar la API directamente desde el navegador
- Ver los modelos de datos
- Ejecutar requests de ejemplo

## 🎯 Endpoints Principales

### 🔐 Autenticación

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/change-password` - Cambiar contraseña

### 👥 Usuarios

- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear usuario
- `PATCH /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### 🎫 Cupones

- `GET /api/coupons/all` - Listar todos los cupones
- `GET /api/coupons/redeemed` - Listar cupones canjeados
- `GET /api/coupons/getone/:id` - Obtener cupón por ID
- `POST /api/coupons/create` - Crear cupón
- `PATCH /api/coupons/update/:id` - Actualizar cupón
- `DELETE /api/coupons/delete/:id` - Eliminar cupón
- `POST /api/coupons/redeem` - Canjear cupón

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm run test

# Tests con cobertura
npm run test:cov

# Tests en modo watch
npm run test:watch

# Tests end-to-end
npm run test:e2e
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run start:dev      # Iniciar con hot-reload
npm run start:debug    # Iniciar en modo debug

# Producción
npm run build          # Compilar aplicación
npm run start:prod     # Iniciar versión compilada

# Calidad de código
npm run lint           # Ejecutar linter
npm run format         # Formatear código

# Testing
npm run test           # Tests unitarios
npm run test:cov       # Tests con cobertura
npm run test:e2e       # Tests end-to-end
```

## 🐳 Comandos Docker Útiles

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f postgres

# Detener servicios
docker-compose down

# Reiniciar PostgreSQL
docker-compose restart postgres

# Conectar a la base de datos
docker-compose exec postgres psql -U postgres -d nestjs_crud_api
```

## 🔧 Solución de Problemas

### ❌ Error: "Puerto 3001 ya está en uso"

```bash
# Encontrar el proceso que usa el puerto
lsof -i :3001  # Mac/Linux
netstat -ano | findstr :3001  # Windows

# Matar el proceso
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### ❌ Error: "Puerto 5432 ya está en uso"

```bash
# Detener PostgreSQL local si está corriendo
sudo service postgresql stop  # Linux
brew services stop postgresql  # Mac
```

### ❌ Error de conexión a la base de datos

1. Verificar que Docker esté corriendo
2. Verificar que el contenedor PostgreSQL esté activo:
   ```bash
   docker-compose ps
   ```
3. Verificar las variables de entorno en `.env`

### ❌ Error: "Module not found"

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 📁 Estructura del Proyecto

```
src/
├── common/                 # Utilidades compartidas
│   └── entity/            # Entidad base
├── config/                # Configuraciones
│   └── database.config.ts # Configuración de BD
├── modules/               # Módulos de la aplicación
│   ├── auth/             # Autenticación
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/            # Gestión de usuarios
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   └── coupons/          # Sistema de cupones
│       ├── dto/
│       ├── entities/
│       ├── enums/
│       ├── coupons.controller.ts
│       ├── coupons.service.ts
│       └── coupons.module.ts
├── app.module.ts         # Módulo principal
└── main.ts              # Punto de entrada
```

## 🚀 Deployment en Producción

Para desplegar en un servidor Ubuntu con RDS y EC2, consulta la sección de [Deployment en Producción](#-deployment-en-producción-ubuntu) más abajo.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🚀 Deployment en Producción (Ubuntu)

Para desplegar en un servidor Ubuntu con RDS y EC2:

### 1. Conectar a tu instancia EC2

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 2. Clonar el repositorio

```bash
git clone <repository-url>
cd nestjs-crud-api
```

### 3. Ejecutar el script de deployment

```bash
chmod +x deploy.sh
./deploy.sh
```

### 4. Configurar variables de entorno para producción

```bash
cp env.production .env
nano .env  # Editar con tus datos de RDS
```

### 5. Reiniciar la aplicación

```bash
pm2 restart nestjs-crud-api
```

### 📋 Comandos de PM2

```bash
pm2 status              # Ver estado
pm2 logs nestjs-crud-api # Ver logs
pm2 restart nestjs-crud-api # Reiniciar
pm2 monit               # Monitorear recursos
```

---

**¿Necesitas ayuda?** Abre un issue en el repositorio o contacta al equipo de desarrollo.
