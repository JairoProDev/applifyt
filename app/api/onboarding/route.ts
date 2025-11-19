import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema
const onboardingSchema = z.object({
  profile: z.object({
    name: z.string(),
    timezone: z.string(),
    bio: z.string().optional(),
  }).optional(),
  lifeWheel: z.record(z.number()).optional(),
  values: z.array(z.string()).optional(),
  firstGoal: z.object({
    title: z.string(),
    wish: z.string(),
    outcome: z.string(),
    obstacle: z.string().optional(),
    plan: z.string().optional(),
  }).optional(),
  firstHabit: z.object({
    name: z.string(),
    cue: z.string(),
    routine: z.string(),
    reward: z.string(),
    craving: z.string().optional(),
  }).optional(),
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
    const validatedData = onboardingSchema.parse(body)

    // Update user profile if provided
    if (validatedData.profile) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name: validatedData.profile.name,
          timezone: validatedData.profile.timezone,
          bio: validatedData.profile.bio,
        },
      })
    }

    // Save life wheel assessment if provided
    if (validatedData.lifeWheel) {
      await prisma.lifeWheelAssessment.upsert({
        where: { userId: session.user.id },
        update: {
          scores: validatedData.lifeWheel,
          completedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          scores: validatedData.lifeWheel,
          completedAt: new Date(),
        },
      })
    }

    // Save values assessment if provided
    if (validatedData.values && validatedData.values.length > 0) {
      await prisma.valuesAssessment.upsert({
        where: { userId: session.user.id },
        update: {
          values: validatedData.values,
          completedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          values: validatedData.values,
          completedAt: new Date(),
        },
      })
    }

    // Create first goal if provided
    if (validatedData.firstGoal) {
      const deadline = new Date()
      deadline.setMonth(deadline.getMonth() + 3) // 3 months from now

      await prisma.goal.create({
        data: {
          userId: session.user.id,
          title: validatedData.firstGoal.title,
          type: 'quarterly',
          level: 3,
          wish: validatedData.firstGoal.wish,
          outcome: validatedData.firstGoal.outcome,
          obstacle: validatedData.firstGoal.obstacle || 'Por determinar',
          plan: validatedData.firstGoal.plan || 'Por determinar',
          specific: validatedData.firstGoal.title,
          measurable: 'Por definir',
          timebound: deadline,
          relevant: validatedData.firstGoal.outcome,
          status: 'active',
          priority: 5,
        },
      })
    }

    // Create first habit if provided
    if (validatedData.firstHabit) {
      await prisma.habit.create({
        data: {
          userId: session.user.id,
          name: validatedData.firstHabit.name,
          cue: validatedData.firstHabit.cue,
          routine: validatedData.firstHabit.routine,
          reward: validatedData.firstHabit.reward,
          craving: validatedData.firstHabit.craving || '',
          frequency: 'daily',
          targetCount: 1,
          isActive: true,
          difficulty: 1,
          importance: 5,
        },
      })
    }

    return NextResponse.json({
      message: 'Onboarding completed successfully',
      success: true,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error completing onboarding:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
