import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const checkInSchema = z.object({
  mood: z.number().min(1).max(5),
  energy: z.number().min(1).max(5),
  stress: z.number().min(1).max(5),
  gratitude: z.string().optional(),
  win: z.string().optional(),
  challenge: z.string().optional(),
  lesson: z.string().optional(),
  goalsProgress: z.string().optional(),
  habitsReflection: z.string().optional(),
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
    const checkInData = checkInSchema.parse(body)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if there's already a check-in for today
    const existingCheckIn = await prisma.dailyCheckIn.findFirst({
      where: {
        userId: session.user.id,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    })

    let checkIn
    if (existingCheckIn) {
      // Update existing check-in
      checkIn = await prisma.dailyCheckIn.update({
        where: { id: existingCheckIn.id },
        data: checkInData,
      })
    } else {
      // Create new check-in
      checkIn = await prisma.dailyCheckIn.create({
        data: {
          ...checkInData,
          userId: session.user.id,
          date: today,
        },
      })
    }

    return NextResponse.json(checkIn)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Datos inválidos', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating check-in:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
