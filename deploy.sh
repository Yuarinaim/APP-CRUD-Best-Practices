#!/bin/bash

# Script de deployment para Ubuntu
# Uso: ./deploy.sh

set -e  # Salir si hay algún error

echo "🚀 Iniciando deployment de NestJS API..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Instalando Node.js 18..."
    
    # Instalar Node.js 18 usando NodeSource
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    print_status "Node.js instalado correctamente"
else
    print_status "Node.js ya está instalado: $(node --version)"
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado"
    exit 1
fi

print_status "npm versión: $(npm --version)"

# Instalar PM2 globalmente si no está instalado
if ! command -v pm2 &> /dev/null; then
    print_status "Instalando PM2..."
    sudo npm install -g pm2
    print_status "PM2 instalado correctamente"
else
    print_status "PM2 ya está instalado: $(pm2 --version)"
fi

# Verificar si el archivo .env existe
if [ ! -f ".env" ]; then
    print_warning "Archivo .env no encontrado. Copiando desde env.example..."
    if [ -f "env.example" ]; then
        cp env.example .env
        print_warning "IMPORTANTE: Edita el archivo .env con tus configuraciones antes de continuar"
        print_warning "Especialmente las variables de base de datos y JWT_SECRET"
        read -p "Presiona Enter cuando hayas editado el archivo .env..."
    else
        print_error "No se encontró env.example. Crea un archivo .env manualmente"
        exit 1
    fi
fi

# Instalar dependencias
print_status "Instalando dependencias..."
npm install

# Compilar la aplicación
print_status "Compilando aplicación..."
npm run build

# Verificar que la compilación fue exitosa
if [ ! -d "dist" ]; then
    print_error "La compilación falló. No se encontró el directorio dist/"
    exit 1
fi

print_status "Compilación exitosa"

# Configurar PM2
print_status "Configurando PM2..."

# Crear archivo de configuración de PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'nestjs-crud-api',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max_old_space_size=1024'
  }]
};
EOF

# Crear directorio de logs
mkdir -p logs

# Detener aplicación si está corriendo
print_status "Deteniendo aplicación anterior (si existe)..."
pm2 stop nestjs-crud-api 2>/dev/null || true
pm2 delete nestjs-crud-api 2>/dev/null || true

# Iniciar aplicación con PM2
print_status "Iniciando aplicación con PM2..."
pm2 start ecosystem.config.js

# Configurar PM2 para que se inicie automáticamente
print_status "Configurando PM2 para inicio automático..."
pm2 startup
pm2 save

print_status "✅ Deployment completado exitosamente!"
print_status "La aplicación está corriendo en el puerto 3001"
print_status "Para ver los logs: pm2 logs nestjs-crud-api"
print_status "Para ver el estado: pm2 status"
print_status "Para reiniciar: pm2 restart nestjs-crud-api"

# Mostrar estado actual
echo ""
print_status "Estado actual de la aplicación:"
pm2 status
