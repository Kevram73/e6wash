describe('Date formatting', () => {
  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) {
      return 'Date invalide'
    }
    return dateObj.toLocaleDateString('fr-FR')
  }

  const formatDateTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) {
      return 'Date invalide'
    }
    return dateObj.toLocaleString('fr-FR')
  }

  it('should format date correctly', () => {
    const testDate = new Date('2024-01-01')
    expect(formatDate(testDate)).toBe('01/01/2024')
  })

  it('should format date from string', () => {
    expect(formatDate('2024-01-01')).toBe('01/01/2024')
  })

  it('should handle invalid dates', () => {
    expect(formatDate('invalid-date')).toBe('Date invalide')
    expect(formatDate(new Date('invalid'))).toBe('Date invalide')
  })

  it('should format datetime correctly', () => {
    const testDate = new Date('2024-01-01T10:30:00')
    const formatted = formatDateTime(testDate)
    expect(formatted).toContain('01/01/2024')
    expect(formatted).toContain('10:30')
  })
})
