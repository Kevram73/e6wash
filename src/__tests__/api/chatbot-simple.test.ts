/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'

// Mock NextAuth first
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    customer: {
      findFirst: jest.fn(),
    },
    order: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  },
}))

// Now import the handler
import { POST as chatbotHandler } from '@/app/api/chatbot/route'

describe('/api/chatbot - Simple Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 401 for unauthenticated user', async () => {
    // Mock no session
    const { getServerSession } = require('next-auth')
    getServerSession.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/chatbot', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Test message'
      })
    })

    const response = await chatbotHandler(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Non autorisé')
  })

  it('should return 400 for missing message', async () => {
    // Mock session
    const { getServerSession } = require('next-auth')
    getServerSession.mockResolvedValue({
      user: { id: 'user-1', tenantId: 'tenant-1' }
    })

    // Mock user
    const { prisma } = require('@/lib/db')
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      tenantId: 'tenant-1',
      agencyId: 'agency-1',
      role: 'ADMIN'
    })

    const request = new NextRequest('http://localhost:3000/api/chatbot', {
      method: 'POST',
      body: JSON.stringify({})
    })

    const response = await chatbotHandler(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Message requis')
  })

  it('should handle greeting message', async () => {
    // Mock session
    const { getServerSession } = require('next-auth')
    getServerSession.mockResolvedValue({
      user: { id: 'user-1', tenantId: 'tenant-1' }
    })

    // Mock user
    const { prisma } = require('@/lib/db')
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      tenantId: 'tenant-1',
      agencyId: 'agency-1',
      role: 'ADMIN'
    })

    const request = new NextRequest('http://localhost:3000/api/chatbot', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Bonjour'
      })
    })

    const response = await chatbotHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.type).toBe('info')
    expect(data.data.response).toContain('Bonjour')
    expect(data.data.response).toContain('assistant E6Wash')
    expect(data.data.suggestions).toContain('Où en est ma commande ?')
  })
})
