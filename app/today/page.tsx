'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/shell/AppShell'
import { NextActionHero } from '@/components/today/NextActionHero'
import { ActionStack } from '@/components/today/ActionStack'
import { QuickCheckIn } from '@/components/today/QuickCheckIn'
import { TodayHabits } from '@/components/today/TodayHabits'
import { TodayTasks } from '@/components/today/TodayTasks'
import { TimeBlocks } from '@/components/today/TimeBlocks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function TodayPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { data: dashboardData, isLoading } = useDashboard()
  const [isFocusMode, setIsFocusMode] = useState(false)

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  if (isLoading) {
    return (
      <AppShell currentPage="today">
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </AppShell>
    )
  }

  // Get next action (highest priority task or first habit)
  const nextAction = dashboardData?.todayGoals.find(g => !g.completed) || 
                   dashboardData?.todayHabits.find(h => !h.completed)

  // Get next 3 actions
  const nextActions = [
    ...(dashboardData?.todayGoals.filter(g => !g.completed) || []),
    ...(dashboardData?.todayHabits.filter(h => !h.completed) || [])
  ].slice(0, 3)

  return (
    <AppShell currentPage="today">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Hero Section - Next Action */}
        <NextActionHero 
          action={nextAction}
          onStart={() => setIsFocusMode(true)}
        />

        {/* Action Stack - Next 3 Actions */}
        <ActionStack 
          actions={nextActions}
          onStartAction={(action) => setIsFocusMode(true)}
        />

        {/* Quick Check-in */}
        <QuickCheckIn />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Today's Habits */}
            <TodayHabits 
              habits={dashboardData?.todayHabits || []}
              onStartHabit={(habit) => setIsFocusMode(true)}
            />

            {/* Time Blocks */}
            <TimeBlocks />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Today's Tasks */}
            <TodayTasks 
              tasks={dashboardData?.todayGoals || []}
              onStartTask={(task) => setIsFocusMode(true)}
            />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/plan')}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Planificar el día
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/progress')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Ver progreso
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/library')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Protocolos
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Focus Mode Overlay */}
        {isFocusMode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Modo Enfoque</h3>
              <p className="text-gray-600 mb-6">
                ¿Estás listo para concentrarte en tu siguiente acción?
              </p>
              <div className="flex space-x-3">
                <Button 
                  onClick={() => setIsFocusMode(false)}
                  variant="outline"
                  className="flex-1"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  No ahora
                </Button>
                <Button 
                  onClick={() => {
                    setIsFocusMode(false)
                    // Open Focus Player
                  }}
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  ¡Empezar!
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
