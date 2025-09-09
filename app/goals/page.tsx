'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { GoalCard } from '@/components/goals/GoalCard'
import { GoalForm } from '@/components/goals/GoalForm'
import { useGoals } from '@/hooks/useGoals'
import { Button } from '@/components/ui/Button'
import { Plus, Search, Target, TrendingUp } from 'lucide-react'
import { Input } from '@/components/ui/Input'

export default function GoalsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { goals, loading, createGoal, updateGoal, deleteGoal } = useGoals()
  
  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('active')

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || goal.type === filterType
    const matchesStatus = filterStatus === 'all' || goal.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const handleEditGoal = (goal: any) => {
    setEditingGoal(goal)
    setShowForm(true)
  }

  const handleDeleteGoal = async (goal: any) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta meta?')) {
      try {
        await deleteGoal(goal.id)
      } catch (error) {
        console.error('Error deleting goal:', error)
      }
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingGoal(null)
  }

  const getGoalsByType = (type: string) => {
    return filteredGoals.filter(goal => goal.type === type)
  }

  const getTypeStats = () => {
    const stats = {
      vision: 0,
      annual: 0,
      quarterly: 0,
      monthly: 0,
      weekly: 0,
      project: 0,
    }
    
    filteredGoals.forEach(goal => {
      if (goal.type in stats) {
        stats[goal.type as keyof typeof stats]++
      }
    })
    
    return stats
  }

  const stats = getTypeStats()

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Metas</h1>
            <p className="text-gray-600">
              Define y alcanza tus objetivos con el framework WOOP
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Meta
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {Object.entries(stats).map(([type, count]) => (
            <div key={type} className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-primary-600">{count}</div>
              <div className="text-sm text-gray-600 capitalize">{type}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar metas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input"
            >
              <option value="all">Todos los tipos</option>
              <option value="vision">Visión</option>
              <option value="annual">Anual</option>
              <option value="quarterly">Trimestral</option>
              <option value="monthly">Mensual</option>
              <option value="weekly">Semanal</option>
              <option value="project">Proyecto</option>
            </select>
          </div>
          <div className="w-full sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activas</option>
              <option value="completed">Completadas</option>
              <option value="paused">Pausadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
        </div>

        {/* Goals by Type */}
        {filteredGoals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Target className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {goals.length === 0 ? 'No tienes metas configuradas' : 'No se encontraron metas'}
            </h3>
            <p className="text-gray-600 mb-4">
              {goals.length === 0 
                ? 'Comienza definiendo tu primera meta para empezar a trabajar hacia tus sueños.'
                : 'Intenta ajustar los filtros de búsqueda.'
              }
            </p>
            {goals.length === 0 && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear mi primera meta
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {['vision', 'annual', 'quarterly', 'monthly', 'weekly', 'project'].map(type => {
              const typeGoals = getGoalsByType(type)
              if (typeGoals.length === 0) return null

              const typeLabels = {
                vision: 'Visión (10 años)',
                annual: 'Metas Anuales',
                quarterly: 'Objetivos Trimestrales',
                monthly: 'Metas Mensuales',
                weekly: 'Objetivos Semanales',
                project: 'Proyectos',
              }

              return (
                <div key={type}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-primary-600" />
                    {typeLabels[type as keyof typeof typeLabels]}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({typeGoals.length})
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {typeGoals.map((goal) => (
                      <GoalCard
                        key={goal.id}
                        goal={goal}
                        onEdit={handleEditGoal}
                        onDelete={handleDeleteGoal}
                        onAddProgress={(goal) => {
                          // TODO: Implement progress logging modal
                          console.log('Add progress for goal:', goal)
                        }}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <GoalForm
                initialData={editingGoal}
                onSuccess={handleFormSuccess}
                onCancel={() => {
                  setShowForm(false)
                  setEditingGoal(null)
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
