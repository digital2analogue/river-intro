import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(__dirname, '../..')
let html: string
let css: string

beforeAll(() => {
  html = readFileSync(resolve(root, 'index.html'), 'utf8')
  css = readFileSync(resolve(root, 'style.css'), 'utf8')
})

describe('index.html structure', () => {
  it('is a valid HTML5 document with a lang attribute', () => {
    expect(html).toMatch(/^<!DOCTYPE html>/i)
    expect(html).toMatch(/<html lang="en">/)
  })

  it('has a title and viewport meta', () => {
    expect(html).toMatch(/<title>.+<\/title>/)
    expect(html).toContain('name="viewport"')
  })

  it('links the stylesheet', () => {
    expect(html).toContain('<link rel="stylesheet" href="style.css">')
  })

  it('has exactly one h1', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
  })

  it('avatar image has alt text', () => {
    const img = html.match(/<img[^>]*src="dithered\.jpg"[^>]*>/)?.[0]
    expect(img).toBeDefined()
    expect(img).toMatch(/alt="[^"]+"/)
  })

  it('external links open safely (rel="noopener" on every target="_blank")', () => {
    const blankLinks = html.match(/<a [^>]*target="_blank"[^>]*>/g) ?? []
    expect(blankLinks.length).toBeGreaterThan(0)
    for (const link of blankLinks) {
      expect(link, link).toContain('rel="noopener"')
    }
  })
})

describe('referenced assets exist on disk', () => {
  it('every local file referenced from index.html exists', () => {
    const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
      .map((m) => m[1])
      .filter((url) => !url.startsWith('http') && !url.startsWith('mailto:'))
    expect(refs.length).toBeGreaterThan(0)
    for (const ref of refs) {
      expect(existsSync(resolve(root, ref)), `${ref} referenced but missing`).toBe(true)
    }
  })

  it('every url() referenced from style.css exists', () => {
    const refs = [...css.matchAll(/url\(['"]?([^'")]+)['"]?\)/g)]
      .map((m) => m[1])
      .filter((url) => !url.startsWith('http') && !url.startsWith('data:'))
    for (const ref of refs) {
      expect(existsSync(resolve(root, ref)), `${ref} referenced but missing`).toBe(true)
    }
  })
})
