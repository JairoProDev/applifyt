# 🚀 Guía Completa de Configuración - Applify

## 📋 Tabla de Contenidos
1. [Prerrequisitos](#prerrequisitos)
2. [Instalación de PostgreSQL](#instalación-de-postgresql)
3. [Configuración del Proyecto](#configuración-del-proyecto)
4. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
5. [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
6. [Primera Ejecución](#primera-ejecución)
7. [Verificación del Sistema](#verificación-del-sistema)
8. [Solución de Problemas](#solución-de-problemas)

---

## 🔧 Prerrequisitos

### Software Necesario
- **Node.js 18+** - [Descargar aquí](https://nodejs.org/)
- **PostgreSQL 14+** - [Descargar aquí](https://www.postgresql.org/download/)
- **Git** - [Descargar aquí](https://git-scm.com/)

### Verificar Instalaciones
```bash
# Verificar Node.js
node --version
# Debe mostrar v18.x.x o superior

# Verificar npm
npm --version
# Debe mostrar 8.x.x o superior

# Verificar PostgreSQL
psql --version
# Debe mostrar 14.x o superior
```

---

## 🐘 Instalación de PostgreSQL

### Windows
1. **Descargar PostgreSQL**
   - Ve a [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
   - Descarga el instalador oficial
   - Ejecuta el instalador como administrador

2. **Configuración durante la instalación**
   - Puerto: `5432` (por defecto)
   - Contraseña del superusuario: **¡RECUÉRDALA!**
   - Configuración regional: `Default locale`

3. **Verificar instalación**
   ```bash
   # Abrir Command Prompt
   psql --version
   ```

### macOS
```bash
# Usando Homebrew (recomendado)
brew install postgresql@14

# Iniciar PostgreSQL
brew services start postgresql@14

# Crear usuario
createuser --interactive
```

### Ubuntu/Debian
```bash
# Actualizar paquetes
sudo apt update

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Iniciar servicio
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Cambiar a usuario postgres
sudo -u postgres psql
```

---

## 📁 Configuración del Proyecto

### 1. Navegar al Directorio
```bash
cd /home/jairoprodev/proyectos/uplifyt
```

### 2. Instalar Dependencias
```bash
# Instalar todas las dependencias
npm install

# Esto instalará:
# - Next.js 14
# - React 18
# - TypeScript
# - Prisma ORM
# - NextAuth.js
# - Tailwind CSS
# - Y muchas más...
```

### 3. Verificar Instalación
```bash
# Verificar que todo se instaló correctamente
npm list --depth=0
```

---

## 🔐 Configuración de Variables de Entorno

### 1. Crear Archivo de Variables
```bash
# Copiar el archivo de ejemplo
cp env.example .env.local
```

### 2. Configurar Variables de Entorno
Abre el archivo `.env.local` y configura las siguientes variables:

```env
# ===========================================
# CONFIGURACIÓN DE BASE DE DATOS
# ===========================================
DATABASE_URL="postgresql://username:password@localhost:5432/applify"

# ===========================================
# CONFIGURACIÓN DE AUTENTICACIÓN
# ===========================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-clave-secreta-muy-larga-y-segura-aqui"

# ===========================================
# PROVEEDORES OAuth (OPCIONAL)
# ===========================================
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# ===========================================
# CONFIGURACIÓN DE LA APLICACIÓN
# ===========================================
NODE_ENV="development"
```

### 3. Generar NEXTAUTH_SECRET
```bash
# Generar una clave secreta segura
openssl rand -base64 32

# O usar este comando alternativo
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Copia el resultado y pégalo en `NEXTAUTH_SECRET`**

---

## 🗄️ Configuración de la Base de Datos

### 1. Crear Base de Datos
```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE applify;

# Crear usuario (opcional, puedes usar postgres)
CREATE USER applify_user WITH PASSWORD 'tu_password_seguro';

# Dar permisos
GRANT ALL PRIVILEGES ON DATABASE applify TO applify_user;

# Salir de psql
\q
```

### 2. Actualizar DATABASE_URL
En tu archivo `.env.local`, actualiza la URL de la base de datos:

```env
# Si usas el usuario postgres
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/applify"

# Si creaste un usuario específico
DATABASE_URL="postgresql://applify_user:tu_password_seguro@localhost:5432/applify"
```

### 3. Configurar Prisma
```bash
# Generar el cliente de Prisma
npx prisma generate

# Aplicar el esquema a la base de datos
npx prisma db push

# (Opcional) Abrir Prisma Studio para ver la base de datos
npx prisma studio
```

---

## 🚀 Primera Ejecución

### 1. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```

### 2. Verificar que Funciona
- Abre tu navegador en: `http://localhost:3000`
- Deberías ver la página de inicio de Applify
- Haz clic en "Registrarse" para crear una cuenta

### 3. Crear Usuario de Prueba
```bash
# (Opcional) Sembrar la base de datos con datos de ejemplo
npm run db:seed
```

Esto creará:
- Un usuario demo: `demo@applify.com` / `demo123`
- Hábitos de ejemplo
- Metas de ejemplo
- Datos de prueba

---

## ✅ Verificación del Sistema

### 1. Verificar Funcionalidades
- [ ] **Registro de usuarios** - Crear cuenta nueva
- [ ] **Inicio de sesión** - Loguearse con credenciales
- [ ] **Dashboard** - Ver estadísticas y resumen
- [ ] **Hábitos** - Crear, editar y completar hábitos
- [ ] **Metas** - Crear metas con framework WOOP
- [ ] **Evaluación** - Completar rueda de la vida
- [ ] **Check-ins** - Registrar estado diario
- [ ] **Revisión semanal** - Completar reflexión

### 2. Verificar Base de Datos
```bash
# Abrir Prisma Studio
npx prisma studio

# Verificar que las tablas se crearon:
# - User
# - Habit
# - Goal
# - HabitLog
# - GoalProgress
# - DailyCheckIn
# - WeeklyReview
# - LifeWheelAssessment
# - ValuesAssessment
# - JournalingAssessment
```

### 3. Verificar APIs
```bash
# Probar endpoints de la API
curl http://localhost:3000/api/habits
curl http://localhost:3000/api/goals
curl http://localhost:3000/api/dashboard
```

---

## 🛠️ Comandos Útiles

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start

# Verificar tipos TypeScript
npm run type-check

# Formatear código
npm run format
```

### Base de Datos
```bash
# Generar cliente Prisma
npm run db:generate

# Aplicar cambios al esquema
npm run db:push

# Abrir Prisma Studio
npm run db:studio

# Sembrar base de datos
npm run db:seed
```

### Utilidades
```bash
# Ejecutar setup automático
./scripts/setup.sh

# Ver logs de la aplicación
npm run dev 2>&1 | tee app.log
```

---

## 🚨 Solución de Problemas

### Error: "Cannot connect to database"
```bash
# Verificar que PostgreSQL esté ejecutándose
sudo systemctl status postgresql  # Linux
brew services list | grep postgres  # macOS

# Verificar conexión
psql -U postgres -h localhost -p 5432

# Verificar variables de entorno
cat .env.local | grep DATABASE_URL
```

### Error: "Module not found"
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 already in use"
```bash
# Encontrar proceso usando el puerto
lsof -ti:3000

# Matar proceso
kill -9 $(lsof -ti:3000)

# O usar otro puerto
npm run dev -- -p 3001
```

### Error: "Prisma schema not found"
```bash
# Verificar que el archivo existe
ls -la prisma/schema.prisma

# Regenerar cliente
npx prisma generate
```

### Error: "NextAuth configuration"
```bash
# Verificar NEXTAUTH_SECRET
echo $NEXTAUTH_SECRET

# Verificar NEXTAUTH_URL
echo $NEXTAUTH_URL
```

---

## 📞 Soporte Adicional

### Logs de la Aplicación
```bash
# Ver logs en tiempo real
npm run dev

# Ver logs de errores
tail -f app.log
```

### Verificar Estado del Sistema
```bash
# Verificar Node.js
node --version
npm --version

# Verificar PostgreSQL
psql --version
sudo systemctl status postgresql

# Verificar puertos
netstat -tulpn | grep :3000
netstat -tulpn | grep :5432
```

### Resetear Todo
```bash
# ⚠️ CUIDADO: Esto borrará todos los datos
npx prisma db push --force-reset
npm run db:seed
```

---

## 🎉 ¡Felicitaciones!

Si has llegado hasta aquí, Applify debería estar funcionando perfectamente. 

### Próximos Pasos:
1. **Explora la aplicación** - Navega por todas las funcionalidades
2. **Completa la evaluación** - Haz la rueda de la vida y descubre tus valores
3. **Crea tus primeros hábitos** - Comienza con hábitos simples
4. **Define tus metas** - Usa el framework WOOP
5. **Haz check-ins diarios** - Mantén el hábito de reflexión
6. **Completa revisiones semanales** - Analiza tu progreso

### Recursos Adicionales:
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de NextAuth.js](https://next-auth.js.org/getting-started/introduction)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)

---

**¡Disfruta tu viaje de crecimiento personal con Applify! 🚀**
