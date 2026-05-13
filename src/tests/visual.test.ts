import { describe, it } from 'vitest'
import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

// NOTE: After running this test, use a Cursor agent to evaluate the screenshots in the timestamped folder against the expectations in @/expectations. The agent should load expectations, view screenshots, and check if they match.

const systemChromePaths = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium'
]

function getChromeExecutablePath() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH
  }

  return systemChromePaths.find((chromePath) => fs.existsSync(chromePath))
}

describe('Visual Tests', () => {
  it('captures screenshots', async () => {
    const browser = await puppeteer.launch({
      executablePath: getChromeExecutablePath(),
      headless: true
    })
    try {
      const page = await browser.newPage()
      await page.setViewport({ width: 1920, height: 1080 })

      const timestamp = new Date().toISOString().split('T')[0]
      const dir = path.join(__dirname, 'screenshots', timestamp)
      fs.mkdirSync(dir, { recursive: true })

      const baseUrl =
        process.env.PORTFOLIO_VISUAL_BASE_URL ?? 'http://localhost:3000'
      const pages = [
        { url: '/', name: 'home' },
        { url: '/about', name: 'about' },
        { url: '/projects', name: 'projects' },
        { url: '/notes', name: 'notes' },
        { url: '/objects', name: 'objects' },
        { url: '/contact', name: 'contact' },
        { url: '/resume', name: 'resume-redirect-to-about' },
        { url: '/blog', name: 'blog-redirect-to-notes' }
      ]

      for (const { url, name } of pages) {
        await page.goto(new URL(url, baseUrl).toString(), {
          waitUntil: 'networkidle2'
        })
        await page.screenshot({ path: `${dir}/${name}.png`, fullPage: true })
      }
    } finally {
      await browser.close()
    }
  }, 60000)
})
