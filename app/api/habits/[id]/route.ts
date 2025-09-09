import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateHabitSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  cue: z.string().min(1).optional(),
  routine: z.string().min(1).optional(),
  reward: z.string().min(1).optional(),
  craving: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
  targetCount: z.number().min(1).optional(),
  unit: z.string().optional(),
  stackAfter: z.string().optional(),
  stackBefore: z.string().optional(),
  difficulty: z.number().min(1).max(5).optional(),
  importance: z.number().min(1).max(5).optional(),
  isActive: z.boolean().optional(),
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
    const updateData = updateHabitSchema.parse(body)

    // Check if habit belongs to user
    const existingHabit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingHabit) {
      return NextResponse.json(
        { message: 'Hábito no encontrado' },
        { status: 404 }
      )
    }

    const updatedHabit = await prisma.habit.update({
      where: { id: params.id },
      data: updateData,
      include: {
        logs: true,
      },
    })

    return NextResponse.json(updatedHabit)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Datos inválidos', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating habit:', error)
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

    // Check if habit belongs to user
    const existingHabit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingHabit) {
      return NextResponse.json(
        { message: 'Hábito no encontrado' },
        { status: 404 }
      )
    }

    // Soft delete by setting isActive to false
    await prisma.habit.update({
      where: { id: params.id },
      data: { isActive: false },
    })

    return NextResponse.json({ message: 'Hábito eliminado exitosamente' })
  } catch (error) {
    console.error('Error deleting habit:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
