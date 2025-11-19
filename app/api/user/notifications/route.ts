import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema
const notificationSchema = z.object({
  emailNotifications: z.boolean().optional(),
  habitReminders: z.boolean().optional(),
  weeklyReviewReminder: z.boolean().optional(),
  goalDeadlineReminders: z.boolean().optional(),
  dailyCheckInReminder: z.boolean().optional(),
})

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = notificationSchema.parse(body)

    // Update user preferences with notification settings
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        preferences: validatedData as any,
      },
      select: {
        id: true,
        preferences: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating notification settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        preferences: true,
      },
    })

    return NextResponse.json(user?.preferences || {})
  } catch (error) {
    console.error('Error fetching notification settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
