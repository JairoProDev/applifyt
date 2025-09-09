import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const goalSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  type: z.enum(['vision', 'annual', 'quarterly', 'monthly', 'weekly', 'project']),
  level: z.number().min(1).max(6),
  wish: z.string().min(1, 'El deseo es requerido'),
  outcome: z.string().min(1, 'El resultado es requerido'),
  obstacle: z.string().min(1, 'El obstáculo es requerido'),
  plan: z.string().min(1, 'El plan es requerido'),
  specific: z.string().min(1, 'La descripción específica es requerida'),
  measurable: z.string().min(1, 'La medición es requerida'),
  achievable: z.boolean(),
  relevant: z.string().min(1, 'La relevancia es requerida'),
  timebound: z.string().transform(str => new Date(str)),
  priority: z.number().min(1).max(5),
  parentGoalId: z.string().optional(),
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

    const goals = await prisma.goal.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        progressLogs: {
          orderBy: { date: 'desc' },
        },
        subGoals: {
          include: {
            progressLogs: true,
          },
        },
      },
      orderBy: [
        { level: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error('Error fetching goals:', error)
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
    const goalData = goalSchema.parse(body)

    const goal = await prisma.goal.create({
      data: {
        ...goalData,
        userId: session.user.id,
      },
      include: {
        progressLogs: true,
        subGoals: true,
      },
    })

    return NextResponse.json(goal)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Datos inválidos', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating goal:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
