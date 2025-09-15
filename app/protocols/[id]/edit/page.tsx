'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { ProtocolForm } from '@/components/protocols/ProtocolForm'

export default function EditProtocolPage() {
  const params = useParams()
  const [initialData, setInitialData] = useState<any | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/protocols`)
        const items = await res.json()
        const p = items.find((x: any) => x.id === params?.id)
        setInitialData(p || null)
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [params?.id])

  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto">
        {initialData && (
          <ProtocolForm initialData={initialData} onSuccess={() => history.back()} onCancel={() => history.back()} />
        )}
      </div>
    </Layout>
  )
}





