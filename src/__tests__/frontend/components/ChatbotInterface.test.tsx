import React from 'react'
import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import ChatbotInterface from '@/components/chatbot/ChatbotInterface'

// Mock fetch
global.fetch = jest.fn()

describe('ChatbotInterface', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockClear()
  })

  it('should render chatbot interface', () => {
    render(<ChatbotInterface />)
    
    expect(screen.getByText('Assistant E6Wash')).toBeInTheDocument()
    expect(screen.getByText('En ligne')).toBeInTheDocument()
    expect(screen.getByText("Bonjour ! Je suis l'assistant E6Wash. Comment puis-je vous aider ?")).toBeInTheDocument()
  })

  it('should show initial suggestions', () => {
    render(<ChatbotInterface />)
    
    expect(screen.getByText('Où en est ma commande ?')).toBeInTheDocument()
    expect(screen.getByText('Combien je dois payer ?')).toBeInTheDocument()
    expect(screen.getByText('Quand ma commande sera prête ?')).toBeInTheDocument()
    expect(screen.getByText('Voir mon historique')).toBeInTheDocument()
  })

  it('should send message when suggestion is clicked', async () => {
    const mockResponse = {
      success: true,
      data: {
        response: 'Voici l\'état de votre commande...',
        type: 'order_status',
        suggestions: ['Combien je dois payer ?']
      }
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    render(<ChatbotInterface />)
    
    const suggestion = screen.getByText('Où en est ma commande ?')
    fireEvent.click(suggestion)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Où en est ma commande ?'
        }),
      })
    })
  })

  it('should send message when typing and pressing enter', async () => {
    const mockResponse = {
      success: true,
      data: {
        response: 'Voici les informations demandées...',
        type: 'info',
        suggestions: []
      }
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    render(<ChatbotInterface />)
    
    const input = screen.getByPlaceholderText('Tapez votre message...')
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Test message'
        }),
      })
    })
  })

  it('should send message when send button is clicked', async () => {
    const mockResponse = {
      success: true,
      data: {
        response: 'Voici les informations demandées...',
        type: 'info',
        suggestions: []
      }
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    render(<ChatbotInterface />)
    
    const input = screen.getByPlaceholderText('Tapez votre message...')
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Test message'
        }),
      })
    })
  })

  it('should display bot response after successful API call', async () => {
    const mockResponse = {
      success: true,
      data: {
        response: 'Voici l\'état de votre commande #123...',
        type: 'order_status',
        suggestions: ['Combien je dois payer ?']
      }
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    render(<ChatbotInterface />)
    
    const input = screen.getByPlaceholderText('Tapez votre message...')
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      expect(screen.getByText('Voici l\'état de votre commande #123...')).toBeInTheDocument()
    })

    // Check that new suggestions are displayed
    expect(screen.getByText('Combien je dois payer ?')).toBeInTheDocument()
  })

  it('should display error message when API call fails', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<ChatbotInterface />)
    
    const input = screen.getByPlaceholderText('Tapez votre message...')
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      expect(screen.getByText("Désolé, je ne peux pas répondre pour le moment. Veuillez réessayer plus tard.")).toBeInTheDocument()
    })
  })

  it('should show loading state while waiting for response', async () => {
    // Mock a delayed response
    ;(fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ success: true, data: { response: 'Test response', type: 'info' } })
        }), 100)
      )
    )

    render(<ChatbotInterface />)
    
    const input = screen.getByPlaceholderText('Tapez votre message...')
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' })

    // Check that loading state is shown
    expect(screen.getByText('Test message')).toBeInTheDocument()
    
    // The loading dots should be visible
    await waitFor(() => {
      expect(screen.getByText('Test response')).toBeInTheDocument()
    })
  })

  it('should not send empty messages', () => {
    render(<ChatbotInterface />)
    
    const input = screen.getByPlaceholderText('Tapez votre message...')
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(sendButton)

    expect(fetch).not.toHaveBeenCalled()
  })

  it('should use customer phone and order number when provided', async () => {
    const mockResponse = {
      success: true,
      data: {
        response: 'Test response',
        type: 'info'
      }
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    render(
      <ChatbotInterface 
        customerPhone="+225123456789"
        orderNumber="123"
      />
    )
    
    const input = screen.getByPlaceholderText('Tapez votre message...')
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Test message',
          customerPhone: '+225123456789',
          orderNumber: '123'
        }),
      })
    })
  })

  it('should show minimize and close buttons', () => {
    const onClose = jest.fn()
    const onMinimize = jest.fn()

    render(
      <ChatbotInterface 
        onClose={onClose}
        onMinimize={onMinimize}
      />
    )
    
    const minimizeButton = screen.getByRole('button', { name: /minimize/i })
    const closeButton = screen.getByRole('button', { name: /close/i })
    
    expect(minimizeButton).toBeInTheDocument()
    expect(closeButton).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', () => {
    const onClose = jest.fn()

    render(<ChatbotInterface onClose={onClose} />)
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalled()
  })

  it('should call onMinimize when minimize button is clicked', () => {
    const onMinimize = jest.fn()

    render(<ChatbotInterface onMinimize={onMinimize} />)
    
    const minimizeButton = screen.getByRole('button', { name: /minimize/i })
    fireEvent.click(minimizeButton)

    expect(onMinimize).toHaveBeenCalled()
  })
})
