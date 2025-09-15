import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const protocolSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  difficulty: z.string().min(1),
  duration: z.string().min(1),
  tags: z.array(z.string()).default([]),
  steps: z.any().optional(),
  featured: z.boolean().optional().default(false),
})

export async function GET() {
  try {
    const items = await prisma.protocol.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(items)
  } catch (e) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const data = protocolSchema.parse(body)
    const created = await prisma.protocol.create({ data: { ...data, createdById: session.user.id } })
    return NextResponse.json(created)
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ errors: e.errors }, { status: 400 })
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}





