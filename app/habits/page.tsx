'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { HabitCard } from '@/components/habits/HabitCard'
import { HabitForm } from '@/components/habits/HabitForm'
import { useHabits } from '@/hooks/useHabits'
import { Button } from '@/components/ui/Button'
import { Plus, Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/Input'

export default function HabitsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { habits, loading, createHabit, updateHabit, deleteHabit } = useHabits()
  
  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterFrequency, setFilterFrequency] = useState('all')

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
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

  const filteredHabits = habits.filter(habit => {
    const matchesSearch = habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         habit.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFrequency = filterFrequency === 'all' || habit.frequency === filterFrequency
    return matchesSearch && matchesFrequency
  })

  const handleEditHabit = (habit: any) => {
    setEditingHabit(habit)
    setShowForm(true)
  }

  const handleDeleteHabit = async (habit: any) => {
    if (confirm('¿Estás seguro de que quieres eliminar este hábito?')) {
      try {
        await deleteHabit(habit.id)
      } catch (error) {
        console.error('Error deleting habit:', error)
      }
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingHabit(null)
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Hábitos</h1>
            <p className="text-gray-600">
              Administra tus hábitos y construye la vida que deseas
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Hábito
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar hábitos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={filterFrequency}
              onChange={(e) => setFilterFrequency(e.target.value)}
              className="input"
            >
              <option value="all">Todas las frecuencias</option>
              <option value="daily">Diarios</option>
              <option value="weekly">Semanales</option>
              <option value="monthly">Mensuales</option>
            </select>
          </div>
        </div>

        {/* Habits Grid */}
        {filteredHabits.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {habits.length === 0 ? 'No tienes hábitos configurados' : 'No se encontraron hábitos'}
            </h3>
            <p className="text-gray-600 mb-4">
              {habits.length === 0 
                ? 'Comienza creando tu primer hábito para empezar tu viaje de crecimiento personal.'
                : 'Intenta ajustar los filtros de búsqueda.'
              }
            </p>
            {habits.length === 0 && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear mi primer hábito
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onEdit={handleEditHabit}
                onDelete={handleDeleteHabit}
              />
            ))}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <HabitForm
                initialData={editingHabit}
                onSuccess={handleFormSuccess}
                onCancel={() => {
                  setShowForm(false)
                  setEditingHabit(null)
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
