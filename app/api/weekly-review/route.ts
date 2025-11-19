import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { startOfWeek, endOfWeek, subDays } from 'date-fns'

// Validation schema
const weeklyReviewSchema = z.object({
  wins: z.array(z.string()).min(1, 'At least one win is required'),
  challenges: z.array(z.string()).min(1, 'At least one challenge is required'),
  lessons: z.array(z.string()).min(1, 'At least one lesson is required'),
  nextWeekFocus: z.string().optional(),
  adjustments: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = weeklyReviewSchema.parse(body)

    // Get week range
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 }) // Sunday

    // Calculate metrics for the week
    const metrics = await calculateWeeklyMetrics(session.user.id, weekStart, weekEnd)

    // Create or update weekly review
    const weeklyReview = await prisma.weeklyReview.upsert({
      where: {
        userId_weekStart: {
          userId: session.user.id,
          weekStart,
        },
      },
      update: {
        wins: validatedData.wins,
        challenges: validatedData.challenges,
        lessons: validatedData.lessons,
        nextWeekFocus: validatedData.nextWeekFocus || null,
        adjustments: validatedData.adjustments || null,
        habitsCompleted: metrics.habitsCompleted,
        goalsProgress: metrics.goalsProgress,
        moodAverage: metrics.moodAverage,
        energyAverage: metrics.energyAverage,
        weekEnd,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        weekStart,
        weekEnd,
        wins: validatedData.wins,
        challenges: validatedData.challenges,
        lessons: validatedData.lessons,
        nextWeekFocus: validatedData.nextWeekFocus || null,
        adjustments: validatedData.adjustments || null,
        habitsCompleted: metrics.habitsCompleted,
        goalsProgress: metrics.goalsProgress,
        moodAverage: metrics.moodAverage,
        energyAverage: metrics.energyAverage,
      },
    })

    return NextResponse.json(weeklyReview)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating weekly review:', error)
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

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    // Fetch weekly reviews
    const weeklyReviews = await prisma.weeklyReview.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        weekStart: 'desc',
      },
      take: limit,
    })

    return NextResponse.json(weeklyReviews)
  } catch (error) {
    console.error('Error fetching weekly reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to calculate weekly metrics
async function calculateWeeklyMetrics(
  userId: string,
  weekStart: Date,
  weekEnd: Date
) {
  // Calculate habits completed
  const habitLogs = await prisma.habitLog.findMany({
    where: {
      userId,
      date: {
        gte: weekStart,
        lte: weekEnd,
      },
      completed: true,
    },
  })

  const habitsCompleted = habitLogs.length

  // Calculate average goal progress for the week
  const goalProgress = await prisma.goalProgress.findMany({
    where: {
      userId,
      date: {
        gte: weekStart,
        lte: weekEnd,
      },
    },
  })

  const goalsProgress = goalProgress.length > 0
    ? goalProgress.reduce((sum, gp) => sum + gp.progress, 0) / goalProgress.length
    : 0

  // Calculate mood and energy averages
  const dailyCheckIns = await prisma.dailyCheckIn.findMany({
    where: {
      userId,
      date: {
        gte: weekStart,
        lte: weekEnd,
      },
    },
  })

  const moodAverage = dailyCheckIns.length > 0
    ? dailyCheckIns.reduce((sum, ci) => sum + ci.mood, 0) / dailyCheckIns.length
    : 0

  const energyAverage = dailyCheckIns.length > 0
    ? dailyCheckIns.reduce((sum, ci) => sum + ci.energy, 0) / dailyCheckIns.length
    : 0

  return {
    habitsCompleted,
    goalsProgress,
    moodAverage,
    energyAverage,
  }
}
