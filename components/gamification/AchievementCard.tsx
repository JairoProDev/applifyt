'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Achievement, getTierColor } from '@/lib/achievements'
import { Lock, Check } from 'lucide-react'

interface AchievementCardProps {
  achievement: Achievement
  unlocked: boolean
  progress?: number
}

export function AchievementCard({ achievement, unlocked, progress = 0 }: AchievementCardProps) {
  const Icon = achievement.icon
  const tierColor = getTierColor(achievement.tier)

  return (
    <Card className={`
      transition-all hover:shadow-lg
      ${unlocked ? 'border-primary-200' : 'opacity-60 grayscale'}
    `}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0
            ${unlocked ? tierColor : 'bg-gray-200 text-gray-400'}
          `}>
            {unlocked ? (
              <Icon className="h-8 w-8" />
            ) : (
              <Lock className="h-8 w-8" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className={`font-semibold ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                {achievement.title}
              </h3>
              {unlocked && (
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              )}
            </div>

            <p className="text-sm text-gray-600 mb-3">
              {achievement.description}
            </p>

            <div className="flex items-center justify-between">
              <Badge variant="secondary" size="sm">
                {achievement.tier.charAt(0).toUpperCase() + achievement.tier.slice(1)}
              </Badge>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-primary-600">
                  +{achievement.points} pts
                </span>
              </div>
            </div>

            {!unlocked && progress > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Progreso</span>
                  <span>{progress}/{achievement.requirement}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 transition-all"
                    style={{ width: `${(progress / achievement.requirement) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
