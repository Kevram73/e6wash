import React from 'react'
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils'
import FinancePage from '@/pages/FinancePage'

// Mock the useApiCrudSimple hook
jest.mock('@/hooks/useApiCrudSimple', () => ({
  useApiCrudSimple: jest.fn(() => ({
    data: [
      { id: 'agency-1', name: 'Test Agency 1' },
      { id: 'agency-2', name: 'Test Agency 2' }
    ],
    loading: false,
    error: null
  }))
}))

// Mock fetch
global.fetch = jest.fn()

describe('FinancePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockClear()
  })

  it('should render finance page with correct title', () => {
    render(<FinancePage />)
    
    expect(screen.getByText('Finance')).toBeInTheDocument()
    expect(screen.getByText('Gestion des recettes et finances')).toBeInTheDocument()
  })

  it('should render date and agency filters', () => {
    render(<FinancePage />)
    
    expect(screen.getByDisplayValue(new Date().toISOString().split('T')[0])).toBeInTheDocument()
    expect(screen.getByText('Toutes les agences')).toBeInTheDocument()
    expect(screen.getByText('Filtrer')).toBeInTheDocument()
  })

  it('should render export button', () => {
    render(<FinancePage />)
    
    expect(screen.getByText('Exporter')).toBeInTheDocument()
  })

  it('should fetch receipts when component mounts', async () => {
    const mockResponse = {
      success: true,
      data: {
        date: '2024-01-01',
        summary: {
          totalReceipts: 10000,
          totalOrders: 5,
          paidOrders: 4,
          partialOrders: 1,
          averageOrderValue: 2000
        },
        receiptsByAgency: [
          {
            agencyName: 'Test Agency',
            totalAmount: 10000,
            orderCount: 5,
            payments: []
          }
        ],
        receiptsByMethod: [
          {
            method: 'CASH',
            totalAmount: 6000,
            count: 3
          },
          {
            method: 'CARD',
            totalAmount: 4000,
            count: 2
          }
        ],
        payments: []
      }
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    render(<FinancePage />)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/finance/daily-receipts'),
        expect.any(Object)
      )
    })
  })

  it('should display receipts data when loaded', async () => {
    const mockResponse = {
      success: true,
      data: {
        date: '2024-01-01',
        summary: {
          totalReceipts: 10000,
          totalOrders: 5,
          paidOrders: 4,
          partialOrders: 1,
          averageOrderValue: 2000
        },
        receiptsByAgency: [
          {
            agencyName: 'Test Agency',
            totalAmount: 10000,
            orderCount: 5,
            payments: []
          }
        ],
        receiptsByMethod: [
          {
            method: 'CASH',
            totalAmount: 6000,
            count: 3
          }
        ],
        payments: []
      }
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    render(<FinancePage />)

    await waitFor(() => {
      expect(screen.getByText('10 000 FCFA')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('4')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  it('should filter by agency when agency is selected', async () => {
    const mockResponse = {
      success: true,
      data: {
        date: '2024-01-01',
        summary: { totalReceipts: 0, totalOrders: 0, paidOrders: 0, partialOrders: 0, averageOrderValue: 0 },
        receiptsByAgency: [],
        receiptsByMethod: [],
        payments: []
      }
    }

    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    })

    render(<FinancePage />)

    // Wait for initial load
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled()
    })

    // Select an agency
    const agencySelect = screen.getByDisplayValue('Toutes les agences')
    fireEvent.change(agencySelect, { target: { value: 'agency-1' } })

    // Click filter button
    const filterButton = screen.getByText('Filtrer')
    fireEvent.click(filterButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('agencyId=agency-1'),
        expect.any(Object)
      )
    })
  })

  it('should filter by date when date is changed', async () => {
    const mockResponse = {
      success: true,
      data: {
        date: '2024-01-02',
        summary: { totalReceipts: 0, totalOrders: 0, paidOrders: 0, partialOrders: 0, averageOrderValue: 0 },
        receiptsByAgency: [],
        receiptsByMethod: [],
        payments: []
      }
    }

    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    })

    render(<FinancePage />)

    // Wait for initial load
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled()
    })

    // Change date
    const dateInput = screen.getByDisplayValue(new Date().toISOString().split('T')[0])
    fireEvent.change(dateInput, { target: { value: '2024-01-02' } })

    // Click filter button
    const filterButton = screen.getByText('Filtrer')
    fireEvent.click(filterButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('date=2024-01-02'),
        expect.any(Object)
      )
    })
  })

  it('should show loading state while fetching', () => {
    // Mock a delayed response
    ;(fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ success: true, data: { summary: {}, receiptsByAgency: [], receiptsByMethod: [], payments: [] } })
        }), 100)
      )
    )

    render(<FinancePage />)

    // The filter button should show loading state
    expect(screen.getByText('Chargement...')).toBeInTheDocument()
  })

  it('should display receipts by agency section', async () => {
    const mockResponse = {
      success: true,
      data: {
        date: '2024-01-01',
        summary: { totalReceipts: 0, totalOrders: 0, paidOrders: 0, partialOrders: 0, averageOrderValue: 0 },
        receiptsByAgency: [
          {
            agencyName: 'Test Agency',
            totalAmount: 5000,
            orderCount: 3,
            payments: []
          }
        ],
        receiptsByMethod: [],
        payments: []
      }
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    render(<FinancePage />)

    await waitFor(() => {
      expect(screen.getByText('Recettes par Agence')).toBeInTheDocument()
      expect(screen.getByText('Test Agency')).toBeInTheDocument()
      expect(screen.getByText('3 commandes')).toBeInTheDocument()
    })
  })

  it('should display receipts by payment method section', async () => {
    const mockResponse = {
      success: true,
      data: {
        date: '2024-01-01',
        summary: { totalReceipts: 0, totalOrders: 0, paidOrders: 0, partialOrders: 0, averageOrderValue: 0 },
        receiptsByAgency: [],
        receiptsByMethod: [
          {
            method: 'CASH',
            totalAmount: 3000,
            count: 2
          }
        ],
        payments: []
      }
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    render(<FinancePage />)

    await waitFor(() => {
      expect(screen.getByText('Recettes par Méthode de Paiement')).toBeInTheDocument()
      expect(screen.getByText('Cash')).toBeInTheDocument()
      expect(screen.getByText('2 transactions')).toBeInTheDocument()
    })
  })

  it('should handle API error gracefully', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

    render(<FinancePage />)

    // Should not crash and should still show the page structure
    expect(screen.getByText('Finance')).toBeInTheDocument()
    expect(screen.getByText('Gestion des recettes et finances')).toBeInTheDocument()
  })
})
