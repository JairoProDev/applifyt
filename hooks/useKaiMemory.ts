import { useState, useCallback } from 'react'

export interface KaiMemoryItem {
  id: string
  type: 'habit' | 'goal' | 'insight' | 'checkin' | 'note'
  content: string
  createdAt: string
  tags?: string[]
  metadata?: Record<string, any>
}

export function useKaiMemory() {
  const [memories, setMemories] = useState<KaiMemoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remember = useCallback(async (item: Omit<KaiMemoryItem, 'id' | 'createdAt'>) => {
    // Interface only: in future, send to vector DB / API
    const newItem: KaiMemoryItem = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...item,
    }
    setMemories(prev => [newItem, ...prev])
    return newItem
  }, [])

  const search = useCallback(async (query: string) => {
    // Placeholder local search; will be replaced by semantic search
    return memories.filter(m => m.content.toLowerCase().includes(query.toLowerCase()))
  }, [memories])

  return { memories, loading, error, remember, search }
}




