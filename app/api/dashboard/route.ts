import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateStreak } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get habits with logs
    const habits = await prisma.habit.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        logs: {
          orderBy: { date: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Get goals with progress
    const goals = await prisma.goal.findMany({
      where: {
        userId,
        status: 'active',
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
      ],
    })

    // Get today's check-in
    const todayCheckIn = await prisma.dailyCheckIn.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    })

    // Get this week's review
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay() + 1) // Monday
    weekStart.setHours(0, 0, 0, 0)
    
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6) // Sunday
    weekEnd.setHours(23, 59, 59, 999)

    const weeklyReview = await prisma.weeklyReview.findFirst({
      where: {
        userId,
        weekStart: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    })

    // Calculate stats
    const totalHabits = habits.length
    
    const completedHabitsToday = habits.filter(habit => {
      const todayLog = habit.logs.find(log => {
        const logDate = new Date(log.date)
        logDate.setHours(0, 0, 0, 0)
        return logDate.getTime() === today.getTime()
      })
      return todayLog?.completed
    }).length

    const activeGoals = goals.length

    // Calculate current streak (longest streak among all habits)
    let currentStreak = 0
    habits.forEach(habit => {
      const completedDates = habit.logs
        .filter(log => log.completed)
        .map(log => new Date(log.date))
      
      const streak = calculateStreak(completedDates)
      if (streak > currentStreak) {
        currentStreak = streak
      }
    })

    // Calculate weekly progress (average of all active goals)
    const weeklyProgress = goals.length > 0 
      ? goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length
      : 0

    // Add calculated stats to habits
    const habitsWithStats = habits.map(habit => {
      const completedDates = habit.logs
        .filter(log => log.completed)
        .map(log => new Date(log.date))
      
      const habitStreak = calculateStreak(completedDates)
      
      // Calculate completion rate for the last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const recentLogs = habit.logs.filter(log => 
        new Date(log.date) >= thirtyDaysAgo
      )
      
      const completedCount = recentLogs.filter(log => log.completed).length
      const completionRate = recentLogs.length > 0 
        ? (completedCount / recentLogs.length) * 100 
        : 0

      return {
        ...habit,
        currentStreak: habitStreak,
        completionRate,
      }
    })

    const dashboardData = {
      habits: habitsWithStats,
      goals,
      todayCheckIn,
      weeklyReview,
      stats: {
        totalHabits,
        completedHabitsToday,
        activeGoals,
        currentStreak,
        weeklyProgress,
      },
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
