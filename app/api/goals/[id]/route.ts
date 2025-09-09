import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateGoalSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  type: z.enum(['vision', 'annual', 'quarterly', 'monthly', 'weekly', 'project']).optional(),
  level: z.number().min(1).max(6).optional(),
  wish: z.string().min(1).optional(),
  outcome: z.string().min(1).optional(),
  obstacle: z.string().min(1).optional(),
  plan: z.string().min(1).optional(),
  specific: z.string().min(1).optional(),
  measurable: z.string().min(1).optional(),
  achievable: z.boolean().optional(),
  relevant: z.string().min(1).optional(),
  timebound: z.string().transform(str => new Date(str)).optional(),
  priority: z.number().min(1).max(5).optional(),
  status: z.enum(['active', 'completed', 'paused', 'cancelled']).optional(),
  progress: z.number().min(0).max(100).optional(),
  parentGoalId: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const updateData = updateGoalSchema.parse(body)

    // Check if goal belongs to user
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingGoal) {
      return NextResponse.json(
        { message: 'Meta no encontrada' },
        { status: 404 }
      )
    }

    const updatedGoal = await prisma.goal.update({
      where: { id: params.id },
      data: updateData,
      include: {
        progressLogs: true,
        subGoals: true,
      },
    })

    return NextResponse.json(updatedGoal)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Datos inválidos', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating goal:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      )
    }

    // Check if goal belongs to user
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingGoal) {
      return NextResponse.json(
        { message: 'Meta no encontrada' },
        { status: 404 }
      )
    }

    // Soft delete by setting status to cancelled
    await prisma.goal.update({
      where: { id: params.id },
      data: { status: 'cancelled' },
    })

    return NextResponse.json({ message: 'Meta eliminada exitosamente' })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
