'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  Target,
  CheckSquare,
  BarChart3,
  Calendar,
  BookOpen,
  Users,
  Settings,
  Plus,
  Trophy,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Evaluación', href: '/assessment', icon: BookOpen },
  { name: 'Hábitos', href: '/habits', icon: CheckSquare },
  { name: 'Metas', href: '/goals', icon: Target },
  { name: 'Logros', href: '/achievements', icon: Trophy },
  { name: 'Revisión Semanal', href: '/weekly-review', icon: BookOpen },
  { name: 'Resiliencia', href: '/resilience', icon: Users },
  { name: 'Trascender', href: '/transcend', icon: Users },
  { name: 'Configuración', href: '/settings', icon: Settings },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn('flex flex-col h-full bg-white border-r border-gray-200', className)}>
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <Button className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Hábito
        </Button>
      </div>
    </div>
  )
}
