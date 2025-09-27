import { NextRequest } from 'next/server'
import { POST as chatbotHandler } from '@/app/api/chatbot/route'
import { prisma } from '@/lib/db'
import { createMockUser, createMockOrder, createMockCustomer } from '../utils/test-utils'

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

// Mock NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('/api/chatbot', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle order status request', async () => {
    // Mock session
    const { getServerSession } = require('next-auth')
    getServerSession.mockResolvedValue({
      user: { id: 'user-1', tenantId: 'tenant-1' }
    })

    // Mock user
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      tenantId: 'tenant-1',
      agencyId: 'agency-1',
      role: 'ADMIN'
    })

    // Mock order
    const mockOrder = createMockOrder({
      id: 'order-1',
      orderNumber: '123',
      totalAmount: 5000,
      status: 'IN_PROGRESS',
      paymentStatus: 'PENDING',
      customer: { fullname: 'Test Customer', phone: '+225123456789' },
      agency: { name: 'Test Agency' },
      items: [
        { 
          name: 'Lavage', 
          quantity: 1, 
          totalPrice: 5000,
          service: { name: 'Lavage', category: 'LAVAGE', type: 'DETAIL' }
        }
      ],
      payments: [
        { amount: 2000, method: 'CASH', status: 'PAID', createdAt: new Date() }
      ]
    })

    mockPrisma.order.findFirst.mockResolvedValue(mockOrder)

    const request = new NextRequest('http://localhost:3000/api/chatbot', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Où en est ma commande #123 ?'
      })
    })

    const response = await chatbotHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.type).toBe('order_status')
    expect(data.data.response).toContain('Commande #123')
    expect(data.data.response).toContain('Test Customer')
    expect(data.data.response).toContain('En cours de traitement')
    expect(data.data.suggestions).toContain('Combien je dois payer ?')
  })

  it('should handle payment info request', async () => {
    // Mock session
    const { getServerSession } = require('next-auth')
    getServerSession.mockResolvedValue({
      user: { id: 'user-1', tenantId: 'tenant-1' }
    })

    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      tenantId: 'tenant-1',
      agencyId: 'agency-1',
      role: 'ADMIN'
    })

    // Mock orders with pending payments
    const mockOrders = [
      createMockOrder({
        id: 'order-1',
        orderNumber: '123',
        totalAmount: 5000,
        paymentStatus: 'PENDING',
        customer: { fullname: 'Test Customer' },
        payments: [
          { amount: 2000, method: 'CASH', status: 'PAID', createdAt: new Date() }
        ]
      }),
      createMockOrder({
        id: 'order-2',
        orderNumber: '124',
        totalAmount: 3000,
        paymentStatus: 'PENDING',
        customer: { fullname: 'Test Customer' },
        payments: []
      })
    ]

    mockPrisma.order.findMany.mockResolvedValue(mockOrders)

    const request = new NextRequest('http://localhost:3000/api/chatbot', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Combien je dois payer ?'
      })
    })

    const response = await chatbotHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.type).toBe('payment_info')
    expect(data.data.response).toContain('Montant dû')
    expect(data.data.response).toContain('6000') // 3000 + 3000 remaining
  })

  it('should handle delivery info request', async () => {
    // Mock session
    const { getServerSession } = require('next-auth')
    getServerSession.mockResolvedValue({
      user: { id: 'user-1', tenantId: 'tenant-1' }
    })

    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      tenantId: 'tenant-1',
      agencyId: 'agency-1',
      role: 'ADMIN'
    })

    // Mock order ready for delivery
    const mockOrder = createMockOrder({
      id: 'order-1',
      orderNumber: '123',
      status: 'READY',
      customer: { fullname: 'Test Customer' },
      agency: { name: 'Test Agency' }
    })

    mockPrisma.order.findFirst.mockResolvedValue(mockOrder)

    const request = new NextRequest('http://localhost:3000/api/chatbot', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Quand ma commande sera prête ?'
      })
    })

    const response = await chatbotHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.type).toBe('delivery_info')
    expect(data.data.response).toContain('Commande #123')
    expect(data.data.response).toContain('prête')
  })

  it('should handle history request', async () => {
    // Mock session
    const { getServerSession } = require('next-auth')
    getServerSession.mockResolvedValue({
      user: { id: 'user-1', tenantId: 'tenant-1' }
    })

    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      tenantId: 'tenant-1',
      agencyId: 'agency-1',
      role: 'ADMIN'
    })

    // Mock customer
    const mockCustomer = createMockCustomer({
      id: 'customer-1',
      fullname: 'Test Customer',
      phone: '+225123456789'
    })

    mockPrisma.customer.findFirst.mockResolvedValue(mockCustomer)

    // Mock orders history
    const mockOrders = [
      createMockOrder({
        id: 'order-1',
        orderNumber: '123',
        totalAmount: 5000,
        status: 'DELIVERED',
        customer: { fullname: 'Test Customer' },
        agency: { name: 'Test Agency' },
        items: [
          { 
            name: 'Lavage', 
            quantity: 1, 
            totalPrice: 5000,
            service: { name: 'Lavage', category: 'LAVAGE', type: 'DETAIL' }
          }
        ]
      }),
      createMockOrder({
        id: 'order-2',
        orderNumber: '124',
        totalAmount: 3000,
        status: 'READY',
        customer: { fullname: 'Test Customer' },
        agency: { name: 'Test Agency' },
        items: [
          { 
            name: 'Repassage', 
            quantity: 1, 
            totalPrice: 3000,
            service: { name: 'Repassage', category: 'REPASSAGE', type: 'DETAIL' }
          }
        ]
      })
    ]

    mockPrisma.order.findMany.mockResolvedValue(mockOrders)

    const request = new NextRequest('http://localhost:3000/api/chatbot', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Qu\'est-ce que j\'ai déposé la dernière fois ?',
        customerPhone: '+225123456789'
      })
    })

    const response = await chatbotHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.type).toBe('history')
    expect(data.data.response).toContain('5 dernières commandes')
    expect(data.data.response).toContain('Commande #123')
    expect(data.data.response).toContain('Commande #124')
  })

  it('should handle greeting message', async () => {
    // Mock session
    const { getServerSession } = require('next-auth')
    getServerSession.mockResolvedValue({
      user: { id: 'user-1', tenantId: 'tenant-1' }
    })

    mockPrisma.user.findUnique.mockResolvedValue({
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

    mockPrisma.user.findUnique.mockResolvedValue({
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
})
