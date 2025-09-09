'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { HabitFormData } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Input'
import { useHabits } from '@/hooks/useHabits'
import toast from 'react-hot-toast'

const habitSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es muy largo'),
  description: z.string().optional(),
  cue: z.string().min(1, 'La señal es requerida'),
  routine: z.string().min(1, 'La rutina es requerida'),
  reward: z.string().min(1, 'La recompensa es requerida'),
  craving: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  targetCount: z.number().min(1, 'Debe ser al menos 1'),
  unit: z.string().optional(),
  stackAfter: z.string().optional(),
  stackBefore: z.string().optional(),
  difficulty: z.number().min(1).max(5),
  importance: z.number().min(1).max(5),
})

interface HabitFormProps {
  initialData?: Partial<HabitFormData>
  onSuccess?: () => void
  onCancel?: () => void
}

export function HabitForm({ initialData, onSuccess, onCancel }: HabitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createHabit, updateHabit } = useHabits()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      cue: initialData?.cue || '',
      routine: initialData?.routine || '',
      reward: initialData?.reward || '',
      craving: initialData?.craving || '',
      frequency: initialData?.frequency || 'daily',
      targetCount: initialData?.targetCount || 1,
      unit: initialData?.unit || '',
      stackAfter: initialData?.stackAfter || '',
      stackBefore: initialData?.stackBefore || '',
      difficulty: initialData?.difficulty || 1,
      importance: initialData?.importance || 1,
    },
  })

  const frequency = watch('frequency')

  const onSubmit = async (data: HabitFormData) => {
    try {
      setIsSubmitting(true)
      
      if (initialData) {
        // Update existing habit
        await updateHabit(initialData.id!, data)
        toast.success('Hábito actualizado exitosamente')
      } else {
        // Create new habit
        await createHabit(data)
        toast.success('Hábito creado exitosamente')
      }
      
      onSuccess?.()
    } catch (error) {
      toast.error('Error al guardar el hábito')
    } finally {
      setIsSubmitting(false)
    }
  }

  const frequencyOptions = [
    { value: 'daily', label: 'Diario' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensual' },
  ]

  const difficultyOptions = [
    { value: 1, label: 'Muy Fácil' },
    { value: 2, label: 'Fácil' },
    { value: 3, label: 'Moderado' },
    { value: 4, label: 'Difícil' },
    { value: 5, label: 'Muy Difícil' },
  ]

  const importanceOptions = [
    { value: 1, label: 'Baja' },
    { value: 2, label: 'Media-Baja' },
    { value: 3, label: 'Media' },
    { value: 4, label: 'Media-Alta' },
    { value: 5, label: 'Alta' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Editar Hábito' : 'Crear Nuevo Hábito'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
            
            <Input
              label="Nombre del hábito"
              {...register('name')}
              error={errors.name?.message}
              placeholder="Ej: Meditar 10 minutos"
            />
            
            <Textarea
              label="Descripción (opcional)"
              {...register('description')}
              error={errors.description?.message}
              placeholder="Describe brevemente este hábito..."
            />
          </div>

          {/* Habit Loop (Atomic Habits) */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Bucle del Hábito</h3>
            <p className="text-sm text-gray-600">
              Define la señal, rutina y recompensa que forman tu hábito.
            </p>
            
            <Input
              label="Señal (Cue)"
              {...register('cue')}
              error={errors.cue?.message}
              placeholder="Ej: Después de despertarme"
            />
            
            <Input
              label="Rutina (Routine)"
              {...register('routine')}
              error={errors.routine?.message}
              placeholder="Ej: Medito durante 10 minutos"
            />
            
            <Input
              label="Recompensa (Reward)"
              {...register('reward')}
              error={errors.reward?.message}
              placeholder="Ej: Me siento más centrado y tranquilo"
            />
            
            <Input
              label="Antojo que satisface (opcional)"
              {...register('craving')}
              error={errors.craving?.message}
              placeholder="Ej: Necesidad de paz mental"
            />
          </div>

          {/* Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Configuración</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Frecuencia"
                {...register('frequency')}
                error={errors.frequency?.message}
                options={frequencyOptions}
              />
              
              <Input
                label="Cantidad objetivo"
                type="number"
                min="1"
                {...register('targetCount', { valueAsNumber: true })}
                error={errors.targetCount?.message}
                placeholder="1"
              />
            </div>
            
            <Input
              label="Unidad (opcional)"
              {...register('unit')}
              error={errors.unit?.message}
              placeholder="Ej: minutos, páginas, vasos"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Dificultad"
                {...register('difficulty', { valueAsNumber: true })}
                error={errors.difficulty?.message}
                options={difficultyOptions}
              />
              
              <Select
                label="Importancia"
                {...register('importance', { valueAsNumber: true })}
                error={errors.importance?.message}
                options={importanceOptions}
              />
            </div>
          </div>

          {/* Habit Stacking */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Apilamiento de Hábitos (Opcional)</h3>
            <p className="text-sm text-gray-600">
              Conecta este hábito con otros para crear una rutina más sólida.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Después de (opcional)"
                {...register('stackAfter')}
                error={errors.stackAfter?.message}
                placeholder="Ej: Después de cepillarme los dientes"
              />
              
              <Input
                label="Antes de (opcional)"
                {...register('stackBefore')}
                error={errors.stackBefore?.message}
                placeholder="Ej: Antes de desayunar"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            )}
            
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {initialData ? 'Actualizar Hábito' : 'Crear Hábito'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
