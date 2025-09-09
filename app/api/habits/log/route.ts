import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { calculateStreak } from '@/lib/utils'

const logHabitSchema = z.object({
  habitId: z.string().min(1, 'ID del hábito es requerido'),
  completed: z.boolean(),
  count: z.number().min(0).default(1),
  notes: z.string().optional(),
  mood: z.number().min(1).max(5).optional(),
})

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
    const { habitId, completed, count, notes, mood } = logHabitSchema.parse(body)

    // Check if habit belongs to user
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId: session.user.id,
      },
    })

    if (!habit) {
      return NextResponse.json(
        { message: 'Hábito no encontrado' },
        { status: 404 }
      )
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if there's already a log for today
    const existingLog = await prisma.habitLog.findFirst({
      where: {
        habitId,
        userId: session.user.id,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    })

    let logData
    if (existingLog) {
      // Update existing log
      logData = await prisma.habitLog.update({
        where: { id: existingLog.id },
        data: {
          completed,
          count,
          notes,
          mood,
        },
      })
    } else {
      // Create new log
      logData = await prisma.habitLog.create({
        data: {
          habitId,
          userId: session.user.id,
          date: today,
          completed,
          count,
          notes,
          mood,
        },
      })
    }

    // Calculate updated streak and completion rate
    const allLogs = await prisma.habitLog.findMany({
      where: {
        habitId,
        userId: session.user.id,
      },
      orderBy: { date: 'desc' },
    })

    const completedDates = allLogs
      .filter(log => log.completed)
      .map(log => new Date(log.date))
    
    const currentStreak = calculateStreak(completedDates)
    
    // Calculate completion rate for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentLogs = allLogs.filter(log => 
      new Date(log.date) >= thirtyDaysAgo
    )
    
    const completedCount = recentLogs.filter(log => log.completed).length
    const completionRate = recentLogs.length > 0 
      ? (completedCount / recentLogs.length) * 100 
      : 0

    return NextResponse.json({
      ...logData,
      currentStreak,
      completionRate,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Datos inválidos', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error logging habit:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
