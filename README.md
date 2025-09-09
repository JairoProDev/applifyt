# Applify - La App del Progreso

Una plataforma completa para el crecimiento personal basada en el Protocolo U.P.L.I.F.T. - Un framework científico de 6 fases para la auto-superación.

## 🚀 Características Principales

### Sistema de Hábitos Avanzado
- **Bucle de Hábitos**: Implementa señales, rutinas y recompensas basado en "Atomic Habits"
- **Habit Stacking**: Conecta hábitos para crear rutinas más sólidas
- **Tracking Inteligente**: Seguimiento de rachas, tasas de finalización y análisis de tendencias
- **Diseño de Entorno**: Sugerencias para modificar tu entorno y apoyar tus metas

### Metas con Framework WOOP
- **Método WOOP**: Deseo, Resultado, Obstáculo, Plan para maximizar el éxito
- **Jerarquía de Metas**: Desde visión a 10 años hasta proyectos semanales
- **Criterios SMART**: Metas específicas, medibles, alcanzables, relevantes y con plazo
- **Seguimiento de Progreso**: Visualización del avance con métricas detalladas

### Check-ins y Reflexión
- **Check-ins Diarios**: Reflexión sobre estado de ánimo, energía y estrés
- **Revisión Semanal**: Análisis de victorias, desafíos y lecciones aprendidas
- **Gratitud y Victorias**: Registro de aspectos positivos del día

### Dashboard Inteligente
- **Estadísticas en Tiempo Real**: Progreso de hábitos, metas activas y rachas
- **Visualizaciones**: Gráficos y métricas para entender tu evolución
- **Insights Personalizados**: Correlaciones entre hábitos y bienestar

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: NextAuth.js
- **UI Components**: Componentes personalizados con Lucide React
- **Formularios**: React Hook Form con validación Zod
- **Estado**: Zustand para manejo de estado global

## 📋 Prerrequisitos

- Node.js 18+ 
- PostgreSQL 14+
- npm o yarn

## 🚀 Instalación

1. **Clona el repositorio**
```bash
git clone <repository-url>
cd applify
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura la base de datos**
```bash
# Crea una base de datos PostgreSQL
createdb applify

# Copia el archivo de variables de entorno
cp env.example .env.local
```

4. **Configura las variables de entorno**
Edita `.env.local` con tus credenciales:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/applify"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

5. **Configura la base de datos**
```bash
# Genera el cliente de Prisma
npx prisma generate

# Ejecuta las migraciones
npx prisma db push

# (Opcional) Siembra la base de datos con datos de ejemplo
npx prisma db seed
```

6. **Inicia el servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🏗️ Estructura del Proyecto

```
applify/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   ├── auth/              # Páginas de autenticación
│   ├── dashboard/         # Dashboard principal
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (Button, Card, etc.)
│   ├── layout/           # Componentes de layout
│   ├── habits/           # Componentes de hábitos
│   ├── goals/            # Componentes de metas
│   └── dashboard/        # Componentes del dashboard
├── hooks/                # Custom hooks
├── lib/                  # Utilidades y configuración
├── prisma/               # Esquema de base de datos
├── types/                # Definiciones de TypeScript
└── public/               # Archivos estáticos
```

## 🎯 Protocolo U.P.L.I.F.T.

### Fase 1: U - Understand (Comprensión)
- Auditoría de vida y evaluación de áreas clave
- Identificación de valores fundamentales
- Análisis de causa raíz de malos hábitos

### Fase 2: P - Plan (Planificación)
- Definición de visión a 10 años
- Ingeniería inversa hacia metas anuales y trimestrales
- Aplicación del método WOOP

### Fase 3: L - Launch (Lanzamiento)
- Implementación del bucle de hábitos
- Regla de los 2 minutos para nuevos hábitos
- Diseño de entorno para apoyar el cambio

### Fase 4: I - Iterate (Iteración)
- Revisión semanal y análisis de métricas
- A/B testing personal para optimizar rutinas
- Ajustes basados en retroalimentación

### Fase 5: F - Fortify (Fortalecimiento)
- Construcción de resiliencia mental
- Planificación de fallos y gestión de contratiempos
- Celebración del esfuerzo, no solo resultados

### Fase 6: T - Transcend (Trascender)
- Transición de superación personal a contribución
- Mentoría y enseñanza a otros
- Proyectos de impacto y legado

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construcción para producción
npm run start        # Servidor de producción
npm run lint         # Linting del código
npm run type-check   # Verificación de tipos TypeScript
```

## 📊 Base de Datos

El esquema incluye modelos para:
- **Users**: Usuarios y perfiles
- **Habits**: Hábitos con bucle completo (señal, rutina, recompensa)
- **HabitLogs**: Registro diario de hábitos
- **Goals**: Metas con jerarquía y framework WOOP
- **GoalProgress**: Seguimiento de progreso de metas
- **DailyCheckIns**: Check-ins diarios de bienestar
- **WeeklyReviews**: Revisiones semanales

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Docker
```bash
# Construir imagen
docker build -t applify .

# Ejecutar contenedor
docker run -p 3000:3000 applify
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- James Clear por "Atomic Habits"
- Gabriele Oettingen por el método WOOP
- Carol Dweck por la mentalidad de crecimiento
- Todos los investigadores en psicología del comportamiento

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:
- Abre un issue en GitHub
- Contacta al equipo en [email@example.com]

---

**Applify** - Transforma tu vida, un hábito a la vez. 🚀
