import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const lifeWheelSchema = z.object({
  scores: z.record(z.string(), z.number().min(1).max(10)),
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
    const { scores } = lifeWheelSchema.parse(body)

    // Save life wheel assessment
    const assessment = await prisma.lifeWheelAssessment.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        scores,
        completedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        scores,
        completedAt: new Date(),
      },
    })

    return NextResponse.json(assessment)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Datos inválidos', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error saving life wheel assessment:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      )
    }

    const assessment = await prisma.lifeWheelAssessment.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    return NextResponse.json(assessment)
  } catch (error) {
    console.error('Error fetching life wheel assessment:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
