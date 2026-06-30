import { describe, it, expect } from 'vitest'

describe('River Intro Unit Tests', () => {
  it('demonstrates basic unit testing with Vitest', () => {
    const greet = (name: string) => `Hello, ${name}!`
    expect(greet('River')).toBe('Hello, River!')
  })

  it('validates simple logic', () => {
    const isEven = (num: number) => num % 2 === 0
    expect(isEven(4)).toBe(true)
    expect(isEven(5)).toBe(false)
  })
})
