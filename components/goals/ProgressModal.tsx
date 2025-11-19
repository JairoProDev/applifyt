'use client'

import React, { useState } from 'react'
import { GoalWithProgress } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { useGoals } from '@/hooks/useGoals'
import { TrendingUp, X, Save } from 'lucide-react'
import toast from 'react-hot-toast'

interface ProgressModalProps {
  goal: GoalWithProgress
  onClose: () => void
  onSuccess?: () => void
}

export function ProgressModal({ goal, onClose, onSuccess }: ProgressModalProps) {
  const { logProgress } = useGoals()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    progress: goal.progress || 0,
    notes: '',
    evidence: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.progress < 0 || formData.progress > 100) {
      toast.error('El progreso debe estar entre 0 y 100')
      return
    }

    try {
      setIsSubmitting(true)

      await logProgress(
        goal.id,
        formData.progress,
        formData.notes,
        formData.evidence
      )

      toast.success('Progreso registrado exitosamente')
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error logging progress:', error)
      toast.error('Error al registrar el progreso')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleProgressChange = (value: number) => {
    const clampedValue = Math.max(0, Math.min(100, value))
    setFormData(prev => ({ ...prev, progress: clampedValue }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
              Registrar Progreso
            </CardTitle>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-medium text-gray-900">{goal.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Progress Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="progress" className="text-sm font-medium text-gray-700">
                  Progreso Actual
                </label>
                <span className="text-2xl font-bold text-primary-600">
                  {formData.progress}%
                </span>
              </div>

              <input
                id="progress"
                type="range"
                min="0"
                max="100"
                step="1"
                value={formData.progress}
                onChange={(e) => handleProgressChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />

              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>

              {/* Progress Bar Visual */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    formData.progress >= 80
                      ? 'bg-green-500'
                      : formData.progress >= 50
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${formData.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Previous Progress */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-medium">Progreso anterior:</span> {goal.progress}%
              </p>
              <p className="text-sm text-blue-800 mt-1">
                {formData.progress > goal.progress ? (
                  <span className="text-green-700">
                    ↑ Aumentando en {(formData.progress - goal.progress).toFixed(1)}%
                  </span>
                ) : formData.progress < goal.progress ? (
                  <span className="text-red-700">
                    ↓ Disminuyendo en {(goal.progress - formData.progress).toFixed(1)}%
                  </span>
                ) : (
                  <span className="text-gray-700">Sin cambios</span>
                )}
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notas (Opcional)
              </label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="¿Qué lograste? ¿Qué obstáculos encontraste? ¿Qué aprendiste?"
                rows={4}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Describe qué avances hiciste, qué desafíos enfrentaste y qué aprendiste.
              </p>
            </div>

            {/* Evidence */}
            <div className="space-y-2">
              <label htmlFor="evidence" className="block text-sm font-medium text-gray-700">
                Evidencia (Opcional)
              </label>
              <Textarea
                id="evidence"
                value={formData.evidence}
                onChange={(e) => setFormData(prev => ({ ...prev, evidence: e.target.value }))}
                placeholder="Agrega enlaces, métricas, o cualquier evidencia de tu progreso..."
                rows={3}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                URLs, métricas, archivos, o cualquier evidencia que respalde tu progreso.
              </p>
            </div>

            {/* Tips */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">
                💡 Consejos para registrar progreso:
              </h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Sé honesto con tu progreso real, no con lo que desearías</li>
                <li>• Documenta tanto éxitos como obstáculos</li>
                <li>• Incluye evidencia concreta cuando sea posible</li>
                <li>• Revisa tus registros regularmente para ajustar tu estrategia</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar Progreso
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
