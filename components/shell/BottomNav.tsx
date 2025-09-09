'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { 
  Home, 
  Calendar, 
  BarChart3, 
  BookOpen, 
  Target,
  Plus,
  Bot
} from 'lucide-react'

interface NavigationItem {
  id: string
  name: string
  icon: React.ComponentType<any>
  href: string
}

interface BottomNavProps {
  navigation: NavigationItem[]
  currentPage: string
  onOpenKai: () => void
  onOpenComposer: () => void
}

export function BottomNav({ navigation, currentPage, onOpenKai, onOpenComposer }: BottomNavProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-around py-2 px-4 bg-white">
      {/* Navigation Items */}
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = currentPage === item.id
        
        return (
          <button
            key={item.id}
            onClick={() => router.push(item.href)}
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              isActive
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.name}</span>
          </button>
        )
      })}

      {/* Kai AI Assistant */}
      <button
        onClick={onOpenKai}
        className="flex flex-col items-center space-y-1 p-2 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
      >
        <div className="relative">
          <Bot className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary-500 rounded-full animate-pulse"></span>
        </div>
        <span className="text-xs font-medium">Kai</span>
      </button>

      {/* Universal Composer */}
      <button
        onClick={onOpenComposer}
        className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
      >
        <Plus className="h-5 w-5" />
        <span className="text-xs font-medium">Agregar</span>
      </button>
    </div>
  )
}
