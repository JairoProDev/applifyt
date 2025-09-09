'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { GoalFormData } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Input'
import { useGoals } from '@/hooks/useGoals'
import toast from 'react-hot-toast'

const goalSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200, 'El título es muy largo'),
  description: z.string().optional(),
  type: z.enum(['vision', 'annual', 'quarterly', 'monthly', 'weekly', 'project']),
  level: z.number().min(1).max(6),
  wish: z.string().min(1, 'El deseo es requerido'),
  outcome: z.string().min(1, 'El resultado es requerido'),
  obstacle: z.string().min(1, 'El obstáculo es requerido'),
  plan: z.string().min(1, 'El plan es requerido'),
  specific: z.string().min(1, 'La descripción específica es requerida'),
  measurable: z.string().min(1, 'La medición es requerida'),
  achievable: z.boolean(),
  relevant: z.string().min(1, 'La relevancia es requerida'),
  timebound: z.date(),
  priority: z.number().min(1).max(5),
  parentGoalId: z.string().optional(),
})

interface GoalFormProps {
  initialData?: Partial<GoalFormData>
  onSuccess?: () => void
  onCancel?: () => void
}

export function GoalForm({ initialData, onSuccess, onCancel }: GoalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createGoal, updateGoal } = useGoals()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      type: initialData?.type || 'project',
      level: initialData?.level || 1,
      wish: initialData?.wish || '',
      outcome: initialData?.outcome || '',
      obstacle: initialData?.obstacle || '',
      plan: initialData?.plan || '',
      specific: initialData?.specific || '',
      measurable: initialData?.measurable || '',
      achievable: initialData?.achievable ?? true,
      relevant: initialData?.relevant || '',
      timebound: initialData?.timebound || new Date(),
      priority: initialData?.priority || 1,
      parentGoalId: initialData?.parentGoalId || '',
    },
  })

  const type = watch('type')

  const onSubmit = async (data: GoalFormData) => {
    try {
      setIsSubmitting(true)
      
      if (initialData) {
        // Update existing goal
        await updateGoal(initialData.id!, data)
        toast.success('Meta actualizada exitosamente')
      } else {
        // Create new goal
        await createGoal(data)
        toast.success('Meta creada exitosamente')
      }
      
      onSuccess?.()
    } catch (error) {
      toast.error('Error al guardar la meta')
    } finally {
      setIsSubmitting(false)
    }
  }

  const typeOptions = [
    { value: 'vision', label: 'Visión (10 años)' },
    { value: 'annual', label: 'Anual (1 año)' },
    { value: 'quarterly', label: 'Trimestral (3 meses)' },
    { value: 'monthly', label: 'Mensual (1 mes)' },
    { value: 'weekly', label: 'Semanal (1 semana)' },
    { value: 'project', label: 'Proyecto' },
  ]

  const levelOptions = [
    { value: 1, label: 'Nivel 1 - Visión' },
    { value: 2, label: 'Nivel 2 - Anual' },
    { value: 3, label: 'Nivel 3 - Trimestral' },
    { value: 4, label: 'Nivel 4 - Mensual' },
    { value: 5, label: 'Nivel 5 - Semanal' },
    { value: 6, label: 'Nivel 6 - Proyecto' },
  ]

  const priorityOptions = [
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
          {initialData ? 'Editar Meta' : 'Crear Nueva Meta'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
            
            <Input
              label="Título de la meta"
              {...register('title')}
              error={errors.title?.message}
              placeholder="Ej: Aprender a programar en React"
            />
            
            <Textarea
              label="Descripción (opcional)"
              {...register('description')}
              error={errors.description?.message}
              placeholder="Describe brevemente esta meta..."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Tipo de meta"
                {...register('type')}
                error={errors.type?.message}
                options={typeOptions}
              />
              
              <Select
                label="Nivel"
                {...register('level', { valueAsNumber: true })}
                error={errors.level?.message}
                options={levelOptions}
              />
            </div>
          </div>

          {/* WOOP Framework */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Framework WOOP</h3>
            <p className="text-sm text-gray-600">
              Utiliza el método WOOP para definir tu meta de manera efectiva.
            </p>
            
            <Textarea
              label="Deseo (Wish)"
              {...register('wish')}
              error={errors.wish?.message}
              placeholder="¿Qué deseas lograr?"
            />
            
            <Textarea
              label="Mejor resultado (Outcome)"
              {...register('outcome')}
              error={errors.outcome?.message}
              placeholder="¿Cuál sería el mejor resultado posible?"
            />
            
            <Textarea
              label="Obstáculo principal (Obstacle)"
              {...register('obstacle')}
              error={errors.obstacle?.message}
              placeholder="¿Cuál es el principal obstáculo interno?"
            />
            
            <Textarea
              label="Plan (Plan)"
              {...register('plan')}
              error={errors.plan?.message}
              placeholder="Si [obstáculo], entonces [acción]"
            />
          </div>

          {/* SMART Criteria */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Criterios SMART</h3>
            
            <Textarea
              label="Específico (Specific)"
              {...register('specific')}
              error={errors.specific?.message}
              placeholder="¿Qué exactamente quieres lograr?"
            />
            
            <Textarea
              label="Medible (Measurable)"
              {...register('measurable')}
              error={errors.measurable?.message}
              placeholder="¿Cómo medirás el progreso?"
            />
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('achievable')}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Alcanzable (Achievable)
              </label>
            </div>
            
            <Textarea
              label="Relevante (Relevant)"
              {...register('relevant')}
              error={errors.relevant?.message}
              placeholder="¿Por qué es importante esta meta?"
            />
            
            <Input
              label="Con plazo (Timebound)"
              type="datetime-local"
              {...register('timebound', { valueAsDate: true })}
              error={errors.timebound?.message}
            />
          </div>

          {/* Priority */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Configuración</h3>
            
            <Select
              label="Prioridad"
              {...register('priority', { valueAsNumber: true })}
              error={errors.priority?.message}
              options={priorityOptions}
            />
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
              {initialData ? 'Actualizar Meta' : 'Crear Meta'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
