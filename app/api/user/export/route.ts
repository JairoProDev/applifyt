import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch all user data
    const userData = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        habits: {
          include: {
            logs: true,
          },
        },
        goals: {
          include: {
            progressLogs: true,
            subGoals: true,
          },
        },
        dailyCheckIns: true,
        weeklyReviews: true,
        lifeWheelAssessment: true,
        valuesAssessment: true,
        journalingAssessment: true,
      },
    })

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Remove sensitive data
    const { password, ...safeUserData } = userData

    // Create export data
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      user: safeUserData,
    }

    // Return as JSON file download
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="applifyt-data-${new Date().toISOString().split('T')[0]}.json"`,
      },
    })
  } catch (error) {
    console.error('Error exporting user data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
