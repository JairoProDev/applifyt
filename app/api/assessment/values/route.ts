import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const valuesSchema = z.object({
  values: z.array(z.string()).min(3, 'Selecciona al menos 3 valores'),
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
    const { values } = valuesSchema.parse(body)

    // Save values assessment
    const assessment = await prisma.valuesAssessment.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        values,
        completedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        values,
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

    console.error('Error saving values assessment:', error)
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

    const assessment = await prisma.valuesAssessment.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    return NextResponse.json(assessment)
  } catch (error) {
    console.error('Error fetching values assessment:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
