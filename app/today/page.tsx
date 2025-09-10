'use client'

import React, { useState, useEffect } from 'react'
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
  const { dashboardData, loading: isLoading } = useDashboard()
  const [isFocusMode, setIsFocusMode] = useState(false)

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, router])

  if (!session) {
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
  const nextAction = dashboardData?.goals.find((g: any) => !g.completed) || 
                   dashboardData?.habits.find((h: any) => !h.completed)

  // Get next 3 actions
  const nextActions = [
    ...(dashboardData?.goals.filter((g: any) => !g.completed) || []),
    ...(dashboardData?.habits.filter((h: any) => !h.completed) || [])
  ].slice(0, 3)

  return (
    <AppShell currentPage="today">
      <div className="h-full overflow-y-auto">
        <div className="w-full max-w-none px-4 lg:px-6 py-6 space-y-8">
          {/* Hero Section - Next Action */}
          <div className="w-full applify-slide-up">
            <NextActionHero 
              action={nextAction}
              onStart={() => setIsFocusMode(true)}
            />
          </div>

          {/* Action Stack - Next 3 Actions */}
          <div className="w-full applify-slide-up">
            <ActionStack 
              actions={nextActions}
              onStartAction={(action) => setIsFocusMode(true)}
            />
          </div>

          {/* Main Content Grid - Desktop Optimized */}
          <div className="applify-grid-3 applify-slide-up">
            {/* Left Column - Habits and Check-in */}
            <div className="applify-stack-lg">
              <QuickCheckIn />
              <TodayHabits 
                habits={dashboardData?.habits || []}
                onStartHabit={(habit) => setIsFocusMode(true)}
              />
            </div>

            {/* Center Column - Tasks and Time Blocks */}
            <div className="applify-stack-lg">
              <TodayTasks 
                tasks={dashboardData?.goals || []}
                onStartTask={(task) => setIsFocusMode(true)}
              />
              <TimeBlocks />
            </div>

            {/* Right Column - Quick Actions */}
            <div className="applify-stack-lg">
              <Card className="h-fit applify-card shadow-lg">
                <CardHeader className="applify-card-header">
                  <CardTitle className="applify-card-title flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                    Acciones Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start applify-button-lg applify-hover applify-scale-in"
                    onClick={() => router.push('/plan')}
                  >
                    <Target className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Planificar el día</div>
                      <div className="text-sm text-gray-500">Organiza tus tareas</div>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start applify-button-lg applify-hover applify-scale-in"
                    onClick={() => router.push('/progress')}
                  >
                    <CheckCircle className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Ver progreso</div>
                      <div className="text-sm text-gray-500">Analiza tu evolución</div>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start applify-button-lg applify-hover applify-scale-in"
                    onClick={() => router.push('/library')}
                  >
                    <Clock className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Protocolos</div>
                      <div className="text-sm text-gray-500">Recursos y guías</div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Focus Mode Overlay */}
          {isFocusMode && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl">
                <h3 className="text-xl font-semibold mb-4">Modo Enfoque</h3>
                <p className="text-gray-600 mb-6">
                  ¿Estás listo para concentrarte en tu siguiente acción?
                </p>
                <div className="flex space-x-4">
                  <Button 
                    onClick={() => setIsFocusMode(false)}
                    variant="outline"
                    className="flex-1 h-12"
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    No ahora
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsFocusMode(false)
                      // Open Focus Player
                    }}
                    className="flex-1 h-12"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    ¡Empezar!
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
