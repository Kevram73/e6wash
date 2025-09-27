import { NextRequest } from 'next/server'
import { GET as getDailyReceipts } from '@/app/api/finance/daily-receipts/route'
import { GET as getOrdersStatus } from '@/app/api/finance/orders-status/route'
import { prisma } from '@/lib/db'
import { createMockUser, createMockPayment, createMockOrder } from '../utils/test-utils'

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    payment: {
      findMany: jest.fn(),
    },
    order: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}))

// Mock NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('/api/finance/daily-receipts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return daily receipts for authenticated user', async () => {
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

    // Mock payments
    const mockPayments = [
      createMockPayment({
        amount: 5000,
        method: 'CASH',
        status: 'PAID',
        order: {
          customer: { fullname: 'Test Customer', phone: '+225123456789' },
          agency: { name: 'Test Agency' }
        }
      }),
      createMockPayment({
        amount: 3000,
        method: 'CARD',
        status: 'PAID',
        order: {
          customer: { fullname: 'Test Customer 2', phone: '+225123456790' },
          agency: { name: 'Test Agency' }
        }
      })
    ]

    mockPrisma.payment.findMany.mockResolvedValue(mockPayments)

    // Create request
    const request = new NextRequest('http://localhost:3000/api/finance/daily-receipts?date=2024-01-01')

    // Call API
    const response = await getDailyReceipts(request)
    const data = await response.json()

    // Assertions
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.summary.totalReceipts).toBe(8000)
    expect(data.data.summary.totalOrders).toBe(2)
    expect(data.data.receiptsByAgency).toHaveLength(1)
    expect(data.data.receiptsByMethod).toHaveLength(2)
  })

  it('should filter by agency for non-admin users', async () => {
    // Mock session
    const { getServerSession } = require('next-auth')
    getServerSession.mockResolvedValue({
      user: { id: 'user-1', tenantId: 'tenant-1' }
    })

    // Mock user with AGENT role
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      tenantId: 'tenant-1',
      agencyId: 'agency-1',
      role: 'AGENT'
    })

    mockPrisma.payment.findMany.mockResolvedValue([])

    const request = new NextRequest('http://localhost:3000/api/finance/daily-receipts')

    const response = await getDailyReceipts(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(mockPrisma.payment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          agencyId: 'agency-1'
        })
      })
    )
  })

  it('should return 401 for unauthenticated user', async () => {
    // Mock no session
    const { getServerSession } = require('next-auth')
    getServerSession.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/finance/daily-receipts')

    const response = await getDailyReceipts(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Non autorisé')
  })
})

describe('/api/finance/orders-status', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return orders with payment status', async () => {
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

    // Mock orders
    const mockOrders = [
      createMockOrder({
        id: 'order-1',
        orderNumber: 'ORD-001',
        totalAmount: 5000,
        paymentStatus: 'PAID',
        customer: { fullname: 'Test Customer', phone: '+225123456789', email: 'test@example.com' },
        agency: { name: 'Test Agency' },
        payments: [
          { amount: 5000, method: 'CASH', status: 'PAID', createdAt: new Date() }
        ],
        items: [
          { name: 'Lavage', quantity: 1, totalPrice: 5000, service: { name: 'Lavage', category: 'LAVAGE', type: 'DETAIL' } }
        ]
      }),
      createMockOrder({
        id: 'order-2',
        orderNumber: 'ORD-002',
        totalAmount: 3000,
        paymentStatus: 'PENDING',
        customer: { fullname: 'Test Customer 2', phone: '+225123456790', email: 'test2@example.com' },
        agency: { name: 'Test Agency' },
        payments: [],
        items: [
          { name: 'Repassage', quantity: 1, totalPrice: 3000, service: { name: 'Repassage', category: 'REPASSAGE', type: 'DETAIL' } }
        ]
      })
    ]

    mockPrisma.order.findMany.mockResolvedValue(mockOrders)
    mockPrisma.order.count.mockResolvedValue(2)

    const request = new NextRequest('http://localhost:3000/api/finance/orders-status?status=PAID')

    const response = await getOrdersStatus(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.orders).toHaveLength(2)
    expect(data.data.summary.totalAmount).toBe(8000)
    expect(data.data.summary.totalPaid).toBe(5000)
    expect(data.data.summary.totalRemaining).toBe(3000)
  })

  it('should filter overdue orders', async () => {
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

    mockPrisma.order.findMany.mockResolvedValue([])
    mockPrisma.order.count.mockResolvedValue(0)

    const request = new NextRequest('http://localhost:3000/api/finance/orders-status?status=OVERDUE')

    const response = await getOrdersStatus(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          paymentStatus: 'PENDING',
          createdAt: expect.objectContaining({
            lt: expect.any(Date)
          })
        })
      })
    )
  })
})
