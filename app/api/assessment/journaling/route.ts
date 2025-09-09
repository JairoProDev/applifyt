import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const journalingSchema = z.object({
  entries: z.record(z.string(), z.string().min(1, 'La reflexión no puede estar vacía')),
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
    const { entries } = journalingSchema.parse(body)

    // Save journaling assessment
    const assessment = await prisma.journalingAssessment.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        entries,
        completedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        entries,
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

    console.error('Error saving journaling assessment:', error)
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

    const assessment = await prisma.journalingAssessment.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    return NextResponse.json(assessment)
  } catch (error) {
    console.error('Error fetching journaling assessment:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
