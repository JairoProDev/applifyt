import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const progressSchema = z.object({
  goalId: z.string().min(1, 'ID de la meta es requerido'),
  progress: z.number().min(0).max(100, 'El progreso debe estar entre 0 y 100'),
  notes: z.string().optional(),
  evidence: z.string().optional(),
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
    const { goalId, progress, notes, evidence } = progressSchema.parse(body)

    // Check if goal belongs to user
    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: session.user.id,
      },
    })

    if (!goal) {
      return NextResponse.json(
        { message: 'Meta no encontrada' },
        { status: 404 }
      )
    }

    // Create progress log
    const progressLog = await prisma.goalProgress.create({
      data: {
        goalId,
        userId: session.user.id,
        progress,
        notes,
        evidence,
      },
    })

    // Update goal progress
    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: { progress },
      include: {
        progressLogs: {
          orderBy: { date: 'desc' },
        },
      },
    })

    return NextResponse.json({
      ...progressLog,
      updatedProgress: updatedGoal.progress,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Datos inválidos', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error logging progress:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
