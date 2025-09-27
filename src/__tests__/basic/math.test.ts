describe('Math operations', () => {
  it('should add numbers correctly', () => {
    expect(1 + 1).toBe(2)
    expect(5 + 3).toBe(8)
  })

  it('should multiply numbers correctly', () => {
    expect(2 * 3).toBe(6)
    expect(4 * 5).toBe(20)
  })

  it('should handle async operations', async () => {
    const asyncAdd = (a: number, b: number): Promise<number> => {
      return Promise.resolve(a + b)
    }

    const result = await asyncAdd(2, 3)
    expect(result).toBe(5)
  })
})
