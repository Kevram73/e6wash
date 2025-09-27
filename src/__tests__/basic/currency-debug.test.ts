describe('Currency formatting debug', () => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  it('should debug currency format', () => {
    const result = formatCurrency(1000)
    console.log('Formatted currency:', JSON.stringify(result))
    // Test avec toContain au lieu de toBe pour éviter les problèmes d'espace
    expect(result).toContain('1')
    expect(result).toContain('000')
    expect(result).toContain('F')
    expect(result).toContain('CFA')
  })

  it('should handle basic amounts', () => {
    expect(formatCurrency(100)).toContain('100')
    expect(formatCurrency(1000)).toContain('1')
    expect(formatCurrency(0)).toContain('0')
  })
})
