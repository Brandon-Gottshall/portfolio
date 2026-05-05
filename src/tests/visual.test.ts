import { describe, it } from 'vitest'
import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

// NOTE: After running this test, use a Cursor agent to evaluate the screenshots in the timestamped folder against the expectations in @/expectations. The agent should load expectations, view screenshots, and check if they match.

describe('Visual Tests', () => {
  it('captures screenshots', async () => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.setViewport({ width: 1920, height: 1080 })

    const timestamp = new Date().toISOString().split('T')[0]
    const dir = path.join(__dirname, 'screenshots', timestamp)
    fs.mkdirSync(dir, { recursive: true })

    const pages = [
      { url: 'http://localhost:3000/', name: 'home' },
      { url: 'http://localhost:3000/about', name: 'about' },
      { url: 'http://localhost:3000/projects', name: 'projects' },
      { url: 'http://localhost:3000/resume', name: 'resume' },
      { url: 'http://localhost:3000/contact', name: 'contact' },
      { url: 'http://localhost:3000/blog', name: 'blog' }
    ]

    for (const { url, name } of pages) {
      await page.goto(url, { waitUntil: 'networkidle2' })
      await page.screenshot({ path: `${dir}/${name}.png`, fullPage: true })
    }

    await browser.close()
  })
})
