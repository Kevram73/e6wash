describe('Chatbot Utils', () => {
  // Intent analysis function
  const analyzeIntent = (message: string): { type: string; orderNumber?: string } => {
    const lowerMessage = message.toLowerCase()

    // Détection de l'état d'une commande
    if (lowerMessage.includes('état') || lowerMessage.includes('en est') || lowerMessage.includes('statut')) {
      const orderMatch = lowerMessage.match(/#?(\d+)/)
      return {
        type: 'order_status',
        orderNumber: orderMatch ? orderMatch[1] : undefined
      }
    }

    // Détection du montant dû
    if (lowerMessage.includes('combien') || lowerMessage.includes('montant') || lowerMessage.includes('payer') || lowerMessage.includes('dû')) {
      return { type: 'payment_info' }
    }

    // Détection de la date de livraison
    if (lowerMessage.includes('quand') || lowerMessage.includes('livraison') || lowerMessage.includes('prêt')) {
      return { type: 'delivery_info' }
    }

    // Détection de l'historique
    if (lowerMessage.includes('historique') || lowerMessage.includes('dernière') || lowerMessage.includes('avant')) {
      return { type: 'history' }
    }

    // Détection de salutation
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
      return { type: 'greeting' }
    }

    return { type: 'unknown' }
  }

  describe('Intent Analysis', () => {
    it('should detect order status intent', () => {
      expect(analyzeIntent('Où en est ma commande #123 ?')).toEqual({
        type: 'order_status',
        orderNumber: '123'
      })

      expect(analyzeIntent('Quel est l\'état de ma commande 456')).toEqual({
        type: 'order_status',
        orderNumber: '456'
      })

      expect(analyzeIntent('Statut de ma commande')).toEqual({
        type: 'order_status',
        orderNumber: undefined
      })
    })

    it('should detect payment info intent', () => {
      expect(analyzeIntent('Combien je dois payer ?')).toEqual({
        type: 'payment_info'
      })

      expect(analyzeIntent('Quel est le montant dû ?')).toEqual({
        type: 'payment_info'
      })
    })

    it('should detect delivery info intent', () => {
      expect(analyzeIntent('Quand ma commande sera prête ?')).toEqual({
        type: 'delivery_info'
      })

      expect(analyzeIntent('Date de livraison')).toEqual({
        type: 'delivery_info'
      })
    })

    it('should detect history intent', () => {
      expect(analyzeIntent('Voir mon historique')).toEqual({
        type: 'history'
      })

      expect(analyzeIntent('Qu\'est-ce que j\'ai déposé la dernière fois ?')).toEqual({
        type: 'history'
      })
    })

    it('should detect greeting intent', () => {
      expect(analyzeIntent('Bonjour')).toEqual({
        type: 'greeting'
      })

      expect(analyzeIntent('Salut')).toEqual({
        type: 'greeting'
      })

      expect(analyzeIntent('Hello')).toEqual({
        type: 'greeting'
      })
    })

    it('should return unknown for unrecognized messages', () => {
      expect(analyzeIntent('Message aléatoire')).toEqual({
        type: 'unknown'
      })

      expect(analyzeIntent('abcdef')).toEqual({
        type: 'unknown'
      })
    })
  })

  describe('Order Number Extraction', () => {
    it('should extract order numbers with hash', () => {
      const result = analyzeIntent('Où en est ma commande #123')
      expect(result.orderNumber).toBe('123')
    })

    it('should extract order numbers without hash', () => {
      const result = analyzeIntent('Quel est l\'état de ma commande 456')
      expect(result.orderNumber).toBe('456')
    })

    it('should extract first order number when multiple present', () => {
      const result = analyzeIntent('Où en est ma commande #123 et #456')
      expect(result.orderNumber).toBe('123')
    })
  })
})
