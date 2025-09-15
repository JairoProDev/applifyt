'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'
import toast from 'react-hot-toast'

interface ProtocolFormProps {
  initialData?: any
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProtocolForm({ initialData, onSuccess, onCancel }: ProtocolFormProps) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<any>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'habits',
    difficulty: initialData?.difficulty || 'Principiante',
    duration: initialData?.duration || '10 min',
    tags: initialData?.tags?.join(', ') || '',
    steps: initialData?.steps ? JSON.stringify(initialData.steps, null, 2) : ''
  })

  const update = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        difficulty: form.difficulty,
        duration: form.duration,
        tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        steps: form.steps ? JSON.parse(form.steps) : undefined,
      }
      const res = await fetch(initialData?.id ? `/api/protocols/${initialData.id}` : '/api/protocols', {
        method: initialData?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Error al guardar protocolo')
      toast.success('Protocolo guardado')
      onSuccess?.()
    } catch (e: any) {
      toast.error(e.message || 'Error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Editar Protocolo' : 'Nuevo Protocolo'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Título" value={form.title} onChange={(e: any) => update('title', e.target.value)} />
          <Textarea label="Descripción" value={form.description} onChange={(e: any) => update('description', e.target.value)} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Categoría" value={form.category} onChange={(e: any) => update('category', e.target.value)} />
            <Input label="Dificultad" value={form.difficulty} onChange={(e: any) => update('difficulty', e.target.value)} />
            <Input label="Duración" value={form.duration} onChange={(e: any) => update('duration', e.target.value)} />
          </div>
          <Input label="Tags (separados por coma)" value={form.tags} onChange={(e: any) => update('tags', e.target.value)} />
          <Textarea label="Steps (JSON opcional)" value={form.steps} onChange={(e: any) => update('steps', e.target.value)} />

          <div className="flex justify-end space-x-3 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>Cancelar</Button>
            )}
            <Button type="submit" disabled={saving} loading={saving}>{initialData ? 'Actualizar' : 'Crear'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}





