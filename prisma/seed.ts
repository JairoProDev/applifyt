import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create a demo user
  const hashedPassword = await bcrypt.hash('demo123', 12)
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@applify.com' },
    update: {},
    create: {
      name: 'Usuario Demo',
      email: 'demo@applify.com',
      password: hashedPassword,
      bio: 'Usuario de demostración de Applify',
    },
  })

  console.log('✅ Demo user created:', user.email)

  // Create sample habits
  const habits = await Promise.all([
    prisma.habit.create({
      data: {
        name: 'Meditar 10 minutos',
        description: 'Práctica diaria de meditación para mejorar el bienestar mental',
        cue: 'Después de despertarme y cepillarme los dientes',
        routine: 'Me siento en mi cojín de meditación y practico mindfulness durante 10 minutos',
        reward: 'Me siento más centrado y tranquilo para comenzar el día',
        craving: 'Necesidad de paz mental y claridad',
        frequency: 'daily',
        targetCount: 1,
        unit: 'minutos',
        difficulty: 2,
        importance: 5,
        userId: user.id,
      },
    }),
    prisma.habit.create({
      data: {
        name: 'Leer 30 minutos',
        description: 'Lectura diaria para el crecimiento personal y profesional',
        cue: 'Antes de dormir, después de cenar',
        routine: 'Leo un libro de desarrollo personal o profesional durante 30 minutos',
        reward: 'Me siento más sabio y actualizado',
        craving: 'Deseo de conocimiento y crecimiento',
        frequency: 'daily',
        targetCount: 1,
        unit: 'minutos',
        difficulty: 1,
        importance: 4,
        userId: user.id,
      },
    }),
    prisma.habit.create({
      data: {
        name: 'Ejercicio físico',
        description: 'Actividad física regular para mantener la salud',
        cue: 'Después del trabajo, a las 6 PM',
        routine: 'Hago 30 minutos de ejercicio (correr, gimnasio o yoga)',
        reward: 'Me siento más energético y saludable',
        craving: 'Necesidad de energía y bienestar físico',
        frequency: 'daily',
        targetCount: 1,
        unit: 'minutos',
        difficulty: 3,
        importance: 5,
        userId: user.id,
      },
    }),
  ])

  console.log('✅ Sample habits created:', habits.length)

  // Create sample goals
  const goals = await Promise.all([
    prisma.goal.create({
      data: {
        title: 'Aprender React y Next.js',
        description: 'Dominar el desarrollo web moderno con React y Next.js',
        type: 'annual',
        level: 2,
        wish: 'Quiero convertirme en un desarrollador frontend experto',
        outcome: 'Ser capaz de crear aplicaciones web modernas y escalables',
        obstacle: 'Falta de tiempo y disciplina para estudiar consistentemente',
        plan: 'Si no tengo tiempo, entonces estudiaré al menos 30 minutos al día',
        specific: 'Aprender React, Next.js, TypeScript y mejores prácticas',
        measurable: 'Completar 3 proyectos y obtener certificación',
        achievable: true,
        relevant: 'Es fundamental para mi carrera como desarrollador',
        timebound: new Date('2024-12-31'),
        priority: 5,
        userId: user.id,
      },
    }),
    prisma.goal.create({
      data: {
        title: 'Lanzar Applify al mercado',
        description: 'Completar el desarrollo y lanzar la plataforma de crecimiento personal',
        type: 'project',
        level: 6,
        wish: 'Quiero crear una herramienta que ayude a las personas a transformar sus vidas',
        outcome: 'Tener una plataforma funcional con usuarios activos',
        obstacle: 'Complejidad técnica y falta de recursos',
        plan: 'Si encuentro obstáculos técnicos, entonces buscaré ayuda en la comunidad',
        specific: 'Desarrollar MVP completo con todas las funcionalidades core',
        measurable: 'Lanzar beta con 100 usuarios y feedback positivo',
        achievable: true,
        relevant: 'Es mi proyecto de vida y pasión personal',
        timebound: new Date('2024-06-30'),
        priority: 5,
        userId: user.id,
      },
    }),
  ])

  console.log('✅ Sample goals created:', goals.length)

  // Create some habit logs for the past week
  const today = new Date()
  const pastWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    return date
  })

  for (const habit of habits) {
    for (const date of pastWeek) {
      // Random completion (80% chance)
      const completed = Math.random() > 0.2
      
      await prisma.habitLog.create({
        data: {
          habitId: habit.id,
          userId: user.id,
          date,
          completed,
          count: completed ? 1 : 0,
          mood: completed ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * 2) + 1,
        },
      })
    }
  }

  console.log('✅ Sample habit logs created')

  // Create a daily check-in for today
  await prisma.dailyCheckIn.create({
    data: {
      userId: user.id,
      date: today,
      mood: 4,
      energy: 4,
      stress: 2,
      gratitude: 'Estoy agradecido por tener la oportunidad de trabajar en Applify',
      win: 'Completé la implementación del sistema de hábitos',
      challenge: 'Mantener el enfoque en las tareas prioritarias',
      lesson: 'La consistencia es más importante que la perfección',
    },
  })

  console.log('✅ Sample check-in created')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
