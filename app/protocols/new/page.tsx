'use client'

import React from 'react'
import { Layout } from '@/components/layout/Layout'
import { ProtocolForm } from '@/components/protocols/ProtocolForm'

export default function NewProtocolPage() {
  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto">
        <ProtocolForm onSuccess={() => history.back()} onCancel={() => history.back()} />
      </div>
    </Layout>
  )
}





