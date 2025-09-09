import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { calculateStreak } from '@/lib/utils'

const habitSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  cue: z.string().min(1, 'La señal es requerida'),
  routine: z.string().min(1, 'La rutina es requerida'),
  reward: z.string().min(1, 'La recompensa es requerida'),
  craving: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  targetCount: z.number().min(1),
  unit: z.string().optional(),
  stackAfter: z.string().optional(),
  stackBefore: z.string().optional(),
  difficulty: z.number().min(1).max(5),
  importance: z.number().min(1).max(5),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      )
    }

    const habits = await prisma.habit.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      include: {
        logs: {
          orderBy: { date: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calculate current streak and completion rate for each habit
    const habitsWithStats = habits.map(habit => {
      const completedDates = habit.logs
        .filter(log => log.completed)
        .map(log => new Date(log.date))
      
      const currentStreak = calculateStreak(completedDates)
      
      // Calculate completion rate for the last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const recentLogs = habit.logs.filter(log => 
        new Date(log.date) >= thirtyDaysAgo
      )
      
      const completedCount = recentLogs.filter(log => log.completed).length
      const completionRate = recentLogs.length > 0 
        ? (completedCount / recentLogs.length) * 100 
        : 0

      return {
        ...habit,
        currentStreak,
        completionRate,
      }
    })

    return NextResponse.json(habitsWithStats)
  } catch (error) {
    console.error('Error fetching habits:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const habitData = habitSchema.parse(body)

    const habit = await prisma.habit.create({
      data: {
        ...habitData,
        userId: session.user.id,
      },
      include: {
        logs: true,
      },
    })

    return NextResponse.json({
      ...habit,
      currentStreak: 0,
      completionRate: 0,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Datos inválidos', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating habit:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
