# Guía de Despliegue - Applify

## 🚀 Despliegue Rápido

### Opción 1: Vercel (Recomendado)

1. **Preparar el repositorio**
```bash
git add .
git commit -m "Initial commit: Applify MVP"
git push origin main
```

2. **Conectar a Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu repositorio de GitHub
   - Selecciona el proyecto Applify

3. **Configurar variables de entorno en Vercel**
```env
DATABASE_URL="postgresql://username:password@host:port/database"
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-secret-key-here"
```

4. **Desplegar**
   - Vercel detectará automáticamente que es un proyecto Next.js
   - El despliegue se realizará automáticamente

### Opción 2: Railway

1. **Conectar a Railway**
   - Ve a [railway.app](https://railway.app)
   - Conecta tu repositorio de GitHub
   - Selecciona el proyecto Applify

2. **Configurar base de datos**
   - Railway creará automáticamente una base de datos PostgreSQL
   - Copia la URL de conexión

3. **Configurar variables de entorno**
```env
DATABASE_URL="postgresql://username:password@host:port/database"
NEXTAUTH_URL="https://your-app.railway.app"
NEXTAUTH_SECRET="your-secret-key-here"
```

4. **Desplegar**
   - Railway construirá y desplegará automáticamente

### Opción 3: Docker

1. **Crear Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. **Construir y ejecutar**
```bash
docker build -t applify .
docker run -p 3000:3000 applify
```

## 🗄️ Configuración de Base de Datos

### PostgreSQL en la Nube

#### Supabase (Recomendado)
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia la URL de conexión
4. Configura las variables de entorno

#### PlanetScale
1. Ve a [planetscale.com](https://planetscale.com)
2. Crea una nueva base de datos
3. Copia la URL de conexión
4. Configura las variables de entorno

#### Neon
1. Ve a [neon.tech](https://neon.tech)
2. Crea un nuevo proyecto
3. Copia la URL de conexión
4. Configura las variables de entorno

### Configuración Local

1. **Instalar PostgreSQL**
```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql

# Windows
# Descargar desde postgresql.org
```

2. **Crear base de datos**
```bash
createdb applify
```

3. **Configurar variables de entorno**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/applify"
```

## 🔧 Configuración Post-Despliegue

### 1. Ejecutar Migraciones
```bash
npx prisma db push
```

### 2. Generar Cliente Prisma
```bash
npx prisma generate
```

### 3. (Opcional) Sembrar Base de Datos
```bash
npx prisma db seed
```

## 🔐 Configuración de Autenticación

### Google OAuth (Opcional)
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto
3. Habilita Google+ API
4. Crea credenciales OAuth 2.0
5. Configura las variables de entorno:
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### GitHub OAuth (Opcional)
1. Ve a [GitHub Settings](https://github.com/settings/developers)
2. Crea una nueva OAuth App
3. Configura las variables de entorno:
```env
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## 📊 Monitoreo y Analytics

### Vercel Analytics
```bash
npm install @vercel/analytics
```

### Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
```

## 🚀 Optimizaciones de Producción

### 1. Optimizar Imágenes
```bash
npm install next/image
```

### 2. Configurar CDN
- Vercel incluye CDN automáticamente
- Para otros proveedores, configurar CloudFlare o similar

### 3. Configurar Caching
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=60' },
        ],
      },
    ]
  },
}
```

## 🔍 Verificación del Despliegue

### 1. Verificar Funcionalidades
- [ ] Registro de usuarios
- [ ] Inicio de sesión
- [ ] Creación de hábitos
- [ ] Creación de metas
- [ ] Dashboard funcional
- [ ] Check-ins diarios

### 2. Verificar Performance
- [ ] Tiempo de carga < 3 segundos
- [ ] Lighthouse score > 90
- [ ] Base de datos respondiendo < 100ms

### 3. Verificar Seguridad
- [ ] HTTPS habilitado
- [ ] Variables de entorno configuradas
- [ ] Autenticación funcionando
- [ ] Validación de datos en APIs

## 🆘 Solución de Problemas

### Error de Base de Datos
```bash
# Verificar conexión
npx prisma db pull

# Resetear base de datos
npx prisma db push --force-reset
```

### Error de Build
```bash
# Limpiar cache
rm -rf .next
npm run build
```

### Error de Autenticación
- Verificar NEXTAUTH_SECRET
- Verificar NEXTAUTH_URL
- Verificar configuración de OAuth

## 📞 Soporte

Si encuentras problemas durante el despliegue:
1. Revisa los logs de la plataforma
2. Verifica las variables de entorno
3. Consulta la documentación de la plataforma
4. Abre un issue en GitHub

---

**¡Felicitaciones!** 🎉 Tu aplicación Applify está lista para ayudar a las personas a transformar sus vidas.
