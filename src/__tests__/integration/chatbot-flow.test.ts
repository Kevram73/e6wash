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

describe('Chatbot Integration Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle complete customer inquiry flow', async () => {
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

    // Mock customer
    const mockCustomer = createMockCustomer({
      id: 'customer-1',
      fullname: 'John Doe',
      phone: '+225123456789'
    })

    mockPrisma.customer.findFirst.mockResolvedValue(mockCustomer)

    // Mock orders for the customer
    const mockOrders = [
      createMockOrder({
        id: 'order-1',
        orderNumber: '123',
        totalAmount: 5000,
        status: 'IN_PROGRESS',
        paymentStatus: 'PENDING',
        customer: { fullname: 'John Doe', phone: '+225123456789' },
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
      }),
      createMockOrder({
        id: 'order-2',
        orderNumber: '124',
        totalAmount: 3000,
        status: 'READY',
        paymentStatus: 'PENDING',
        customer: { fullname: 'John Doe', phone: '+225123456789' },
        agency: { name: 'Test Agency' },
        items: [
          { 
            name: 'Repassage', 
            quantity: 1, 
            totalPrice: 3000,
            service: { name: 'Repassage', category: 'REPASSAGE', type: 'DETAIL' }
          }
        ],
        payments: []
      })
    ]

    mockPrisma.order.findFirst.mockResolvedValue(mockOrders[0])
    mockPrisma.order.findMany.mockResolvedValue(mockOrders)

    // Test 1: Order status inquiry
    let request = new NextRequest('http://localhost:3000/api/chatbot', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Où en est ma commande #123 ?',
        customerPhone: '+225123456789'
      })
    })

    let response = await chatbotHandler(request)
    let data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data.type).toBe('order_status')
    expect(data.data.response).toContain('Commande #123')
    expect(data.data.response).toContain('John Doe')
    expect(data.data.response).toContain('En cours de traitement')

    // Test 2: Payment inquiry
    request = new NextRequest('http://localhost:3000/api/chatbot', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Combien je dois payer ?',
        customerPhone: '+225123456789'
      })
    })

    response = await chatbotHandler(request)
    data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data.type).toBe('payment_info')
    expect(data.data.response).toContain('Montant dû')
    expect(data.data.response).toContain('6000') // 3000 + 3000 remaining

    // Test 3: Delivery inquiry
    request = new NextRequest('http://localhost:3000/api/chatbot', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Quand ma commande sera prête ?',
        customerPhone: '+225123456789'
      })
    })

    response = await chatbotHandler(request)
    data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data.type).toBe('delivery_info')
    expect(data.data.response).toContain('Commande #123')
    expect(data.data.response).toContain('prête')

    // Test 4: History inquiry
    request = new NextRequest('http://localhost:3000/api/chatbot', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Qu\'est-ce que j\'ai déposé la dernière fois ?',
        customerPhone: '+225123456789'
      })
    })

    response = await chatbotHandler(request)
    data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data.type).toBe('history')
    expect(data.data.response).toContain('5 dernières commandes')
    expect(data.data.response).toContain('Commande #123')
    expect(data.data.response).toContain('Commande #124')
  })

  it('should handle customer not found scenario', async () => {
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

    // Mock customer not found
    mockPrisma.customer.findFirst.mockResolvedValue(null)
    mockPrisma.order.findFirst.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/chatbot', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Où en est ma commande #999 ?',
        customerPhone: '+225999999999'
      })
    })

    const response = await chatbotHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data.type).toBe('error')
    expect(data.data.response).toContain('pas trouvé de commande correspondante')
  })

  it('should handle no pending payments scenario', async () => {
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

    // Mock customer with no pending orders
    const mockCustomer = createMockCustomer({
      id: 'customer-1',
      fullname: 'John Doe',
      phone: '+225123456789'
    })

    mockPrisma.customer.findFirst.mockResolvedValue(mockCustomer)
    mockPrisma.order.findMany.mockResolvedValue([]) // No pending orders

    const request = new NextRequest('http://localhost:3000/api/chatbot', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Combien je dois payer ?',
        customerPhone: '+225123456789'
      })
    })

    const response = await chatbotHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data.type).toBe('payment_info')
    expect(data.data.response).toContain('aucune somme en attente')
  })

  it('should handle no order history scenario', async () => {
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

    // Mock customer with no orders
    const mockCustomer = createMockCustomer({
      id: 'customer-1',
      fullname: 'John Doe',
      phone: '+225123456789'
    })

    mockPrisma.customer.findFirst.mockResolvedValue(mockCustomer)
    mockPrisma.order.findMany.mockResolvedValue([]) // No orders

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
    expect(data.data.type).toBe('history')
    expect(data.data.response).toContain('pas encore de commandes')
  })

  it('should handle ambiguous messages gracefully', async () => {
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
        message: 'Je ne sais pas quoi demander'
      })
    })

    const response = await chatbotHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data.type).toBe('error')
    expect(data.data.response).toContain('ne comprends pas')
    expect(data.data.suggestions).toContain('Où en est ma commande #123 ?')
  })
})
